import { visit } from 'unist-util-visit';

// Cache regex for performance
// Allows alphanumeric keys with hyphens, e.g., data-id, aria-label
const ATTR_REGEX = /([\w-]+)=((?:"[^"]*")|(?:'[^']*'))/g;

/**
 * 解析属性字符串，返回一个 React props 对象
 * @param {string} attrStr - The attribute string, e.g., 'id="title" class="header"'
 * @returns {object | null} A props object or null for React.
 */
function parseAttrs(attrStr) {
  if (!attrStr?.trim()) return null;

  const props = {};
  let hasAttrs = false;

  attrStr.replace(ATTR_REGEX, (match, key, valueWithQuotes) => {
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
    const attrEndRegex = /\s*\{([^}]+)\}\s*$/;
    const attrImageRegex = /^\s*\{([^}]+)\}\s*/;
    const lineBreakRegex = /\r?\n/;

    // Unified text node visitor for both inline [text]{attr} and formatted **text {attr}**
    visit(tree, 'text', (node, index, parent) => {
      const combinedRegex =
        /\[([^\]]+)\]\{([^}]+)\}|(\*\*|__)(?!\s)(.+?)\s*\{([^}]+)\}\3|(\*|_)(?!\s)(.+?)\s*\{([^}]+)\}\6/g;

      const content = node.value;
      const newChildren = [];
      let lastIndex = 0;
      let matched = false;
      let match;

      while ((match = combinedRegex.exec(content)) !== null) {
        matched = true;
        const [
          fullMatch,
          // Bracket match
          spanText,
          spanAttr,
          // Bold match
          boldDelim,
          boldText,
          boldAttr,
          // Italic match
          italicDelim,
          italicText,
          italicAttr,
        ] = match;

        if (match.index > lastIndex) {
          newChildren.push(
            createTextNode(content.slice(lastIndex, match.index))
          );
        }

        if (spanText !== undefined) {
          const props = parseAttrs(spanAttr);
          newChildren.push({
            type: 'span',
            data: { hName: 'span', hProperties: props || {} },
            children: [createTextNode(spanText)],
          });
        } else if (boldText !== undefined) {
          const props = parseAttrs(boldAttr);
          newChildren.push({
            type: 'strong',
            data: { hName: 'strong', hProperties: props || {} },
            children: [createTextNode(boldText)],
          });
        } else if (italicText !== undefined) {
          const props = parseAttrs(italicAttr);
          newChildren.push({
            type: 'emphasis',
            data: { hName: 'em', hProperties: props || {} },
            children: [createTextNode(italicText)],
          });
        }

        lastIndex = match.index + fullMatch.length;
      }

      if (matched) {
        if (lastIndex < content.length) {
          newChildren.push(createTextNode(content.slice(lastIndex)));
        }
        if (parent && parent.children) {
          parent.children.splice(index, 1, ...newChildren);
          return [visit.SKIP, index + newChildren.length];
        }
      }
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
