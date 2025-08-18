import { visit } from 'unist-util-visit';

/**
 * 解析属性字符串，返回一个 React props 对象
 * @param {string} attrStr - The attribute string, e.g., 'id="title" class="header"'
 * @returns {object | null} A props object or null for React.
 */
function parseAttrs(attrStr) {
  if (!attrStr?.trim()) return null;

  const props = {};
  let hasAttrs = false;

  // 缓存正则表达式
  const attrRegex = /(\w+)=((?:"[^"]*")|(?:'[^']*'))/g;

  attrStr.replace(attrRegex, (match, key, valueWithQuotes) => {
    hasAttrs = true;
    const value = valueWithQuotes.slice(1, -1);

    if (key === 'class') {
      props.className = value;
    } else {
      const camelKey = key.replace(/-(\w)/g, (_, char) => char.toUpperCase());
      props[camelKey] = value;
    }
  });

  if (!hasAttrs) return null;

  // 优化 style 属性解析
  if (typeof props.style === 'string') {
    const styleObject = {};
    const styleRules = props.style.split(';');

    for (const styleRule of styleRules) {
      if (!styleRule) continue;

      const colonIndex = styleRule.indexOf(':');
      if (colonIndex === -1) continue;

      const key = styleRule.slice(0, colonIndex).trim();
      const value = styleRule.slice(colonIndex + 1).trim();

      if (key && value) {
        const camelKey = key.replace(/-(\w)/g, (_, char) => char.toUpperCase());
        styleObject[camelKey] = value;
      }
    }
    props.style = styleObject;
  }

  return props;
}

// 提取公共函数：创建文本节点
function createTextNode(value) {
  return { type: 'text', value };
}

// 提取公共函数：创建段落节点
function createParagraphNode(children) {
  return { type: 'paragraph', children };
}

// 提取公共函数：设置节点属性
function setNodeProperties(node, props, tagName = null) {
  node.data = { ...node.data };
  if (tagName) node.data.hName = tagName;
  node.data.hProperties = { ...node.data.hProperties, ...props };
}

// 提取公共函数：处理属性匹配
function processAttributeMatch(node, match, tagName = null) {
  const attrStr = match[1];
  const props = parseAttrs(attrStr);

  if (props) {
    setNodeProperties(node, props, tagName);
    return true;
  }
  return false;
}

// 提取公共函数：处理换行分割
function processLineSplits(
  splits,
  parentChildren,
  isLast = false,
  shouldProcessAttrs = false
) {
  let attributesProcessed = false;

  if (isLast && shouldProcessAttrs) {
    const potentialAttrStr = splits.pop();
    const props = parseAttrs(potentialAttrStr);

    if (props) {
      attributesProcessed = true;
    } else {
      splits.push(potentialAttrStr);
    }
  }

  splits.forEach((line, index) => {
    if (line) {
      parentChildren.push(createTextNode(line));
    }
    if (index < splits.length - 1) {
      parentChildren.push({ type: 'break' });
    }
  });

  return attributesProcessed;
}

function processBlockquoteSplits(
  splits,
  newNodeChildren,
  currentIndex,
  allChildren
) {
  if (currentIndex === 0) {
    splits.forEach((line) => {
      newNodeChildren.push(createParagraphNode([createTextNode(line)]));
    });
  } else {
    const prevChild = allChildren[currentIndex - 1];
    if (prevChild.type !== 'text') {
      splits.forEach((line, index) => {
        if (index === 0) {
          newNodeChildren[newNodeChildren.length - 1].children.push(
            createTextNode(line)
          );
        } else {
          newNodeChildren.push(createParagraphNode([createTextNode(line)]));
        }
      });
    }
  }
}

export default function remarkAttributes() {
  return (tree) => {
    const inlineAttrRegex = /\[([^\]]+)\]\{([^}]+)\}/g;
    const attrEndRegex = /\s*\{([^}]+)\}\s*$/;
    const attrImageRegex = /^\s*\{([^}]+)\}\s*/;
    const lineBreakRegex = /\r?\n/;

    visit(tree, 'text', (node, index, parent) => {
      if (!node.value.includes(']{')) return;

      const newChildren = [];
      let lastIndex = 0;
      let match;
      inlineAttrRegex.lastIndex = 0;

      while ((match = inlineAttrRegex.exec(node.value)) !== null) {
        const [fullMatch, textContent, attrStr] = match;
        const props = parseAttrs(attrStr);

        if (match.index > lastIndex) {
          newChildren.push(
            createTextNode(node.value.slice(lastIndex, match.index))
          );
        }

        newChildren.push({
          type: 'span',
          data: {
            hName: 'span',
            hProperties: props || {},
          },
          children: [createTextNode(textContent)],
        });

        lastIndex = match.index + fullMatch.length;
      }

      if (lastIndex === 0) return;

      if (lastIndex < node.value.length) {
        newChildren.push(createTextNode(node.value.slice(lastIndex)));
      }

      parent.children.splice(index, 1, ...newChildren);
      return [visit.SKIP, index + newChildren.length];
    });

    // 处理列表属性
    visit(tree, 'list', (node) => {
      const listLastChild = node.children?.[node.children.length - 1];
      const listItemLastChild =
        listLastChild?.children?.[listLastChild.children.length - 1];
      const lastTextNode =
        listItemLastChild?.children?.[listItemLastChild.children.length - 1];

      if (!lastTextNode?.value || lastTextNode.type !== 'text') return;

      const splits = lastTextNode.value.split(lineBreakRegex);

      if (splits.length <= 1) {
        if (splits[0].trim().startsWith('{')) {
          const props = parseAttrs(splits[0]);
          if (props) {
            node.children.pop();
            setNodeProperties(node, props, node.ordered ? 'ol' : 'ul');
          }
        }
      } else {
        const potentialAttrStr = splits.pop();
        const props = parseAttrs(potentialAttrStr);

        listItemLastChild.children.pop();

        if (props) {
          processLineSplits(splits, listItemLastChild.children);
          setNodeProperties(node, props, node.ordered ? 'ol' : 'ul');
        } else {
          splits.push(potentialAttrStr);
          processLineSplits(splits, listItemLastChild.children);
        }
      }
    });

    // 处理块引用属性
    visit(tree, 'blockquote', (node) => {
      const lastParagraph = node.children?.[node.children.length - 1];
      if (!lastParagraph || lastParagraph.type !== 'paragraph') return;

      const newNodeChildren = [];

      for (let i = 0; i < lastParagraph.children.length; i++) {
        const currentChild = lastParagraph.children[i];

        if (currentChild.type !== 'text') {
          if (newNodeChildren.length > 0) {
            newNodeChildren[newNodeChildren.length - 1].children.push(
              currentChild
            );
          } else {
            newNodeChildren.push(createParagraphNode([currentChild]));
          }
          continue;
        }

        const splits = currentChild.value.split(lineBreakRegex);
        const isLastChild = i === lastParagraph.children.length - 1;

        if (isLastChild) {
          const potentialAttrStr = splits.pop();
          if (potentialAttrStr.trim().startsWith('{')) {
            const props = parseAttrs(potentialAttrStr);

            if (props) {
              processBlockquoteSplits(
                splits,
                newNodeChildren,
                i,
                lastParagraph.children
              );
              setNodeProperties(node, props, 'blockquote');
            } else {
              splits.push(potentialAttrStr);
              processBlockquoteSplits(
                splits,
                newNodeChildren,
                i,
                lastParagraph.children
              );
            }
          } else {
            splits.push(potentialAttrStr);
            processBlockquoteSplits(
              splits,
              newNodeChildren,
              i,
              lastParagraph.children
            );
          }
        } else {
          processBlockquoteSplits(
            splits,
            newNodeChildren,
            i,
            lastParagraph.children
          );
        }
      }

      node.children.pop();
      node.children.push(...newNodeChildren);
    });

    // 处理图片属性
    visit(tree, 'image', (node, index, parent) => {
      const nextNode = parent.children[index + 1];

      if (nextNode?.type === 'text') {
        const match = nextNode.value.match(attrImageRegex);
        if (match && processAttributeMatch(node, match)) {
          nextNode.value = nextNode.value.slice(match[0].length).trim();
        }
      }
    });

    // 处理列表项属性
    visit(tree, 'listItem', (node) => {
      const paragraphNode = node.children[node.children.length - 1];
      const lastChild =
        paragraphNode?.children?.[paragraphNode.children.length - 1];

      if (!lastChild?.value) return;

      const match = lastChild.value.match(attrEndRegex);

      if (match && processAttributeMatch(node, match)) {
        lastChild.value = lastChild.value.slice(0, match.index);
        if (!lastChild.value.trim()) {
          node.children.pop();
        }
      }
    });

    // 处理通用元素属性
    visit(
      tree,
      ['strong', 'emphasis', 'link', 'paragraph', 'heading', 'tableCell'],
      (node) => {
        if (!node.children?.length) return;

        const lastChild = node.children[node.children.length - 1];
        if (!lastChild?.value || lastChild.type !== 'text') return;

        const match = lastChild.value.match(attrEndRegex);

        if (match && processAttributeMatch(node, match)) {
          lastChild.value = lastChild.value.slice(0, match.index);
          if (!lastChild.value.trim()) {
            node.children.pop();
          }
        }
      }
    );
  };
}
