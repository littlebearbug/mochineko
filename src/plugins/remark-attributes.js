// remark-attributes.js

import { visit } from "unist-util-visit";

/**
 * 解析属性字符串，返回一个 React props 对象
 * @param {string} attrStr - The attribute string, e.g., 'id="title" class="header"'
 * @returns {object} A props object for React.
 */
function parseAttrs(attrStr) {
  const props = {};
  if (!attrStr) return props;

  // 使用更健壮的正则表达式来处理带引号的值
  attrStr.replace(
    /(\w+)=((?:"[^"]*")|(?:'[^']*'))/g,
    (match, key, valueWithQuotes) => {
      const value = valueWithQuotes.slice(1, -1); // 移除引号
      if (key === "class") {
        props.className = value;
      } else {
        const camelKey = key.replace(/-(\w)/g, (_, char) => char.toUpperCase());
        props[camelKey] = value;
      }
    }
  );

  if (typeof props.style === "string") {
    const styleObject = {};
    props.style.split(";").forEach((styleRule) => {
      if (!styleRule) return;
      const [key, value] = styleRule.split(":").map((s) => s.trim());
      if (key && value) {
        const camelKey = key.replace(/-(\w)/g, (_, char) => char.toUpperCase());
        styleObject[camelKey] = value;
      }
    });
    props.style = styleObject;
  }

  return props;
}

export default function remarkAttributes() {
  return (tree) => {
    // 阶段 1: 处理 [text]{...} 语法 (内联span)
    visit(tree, "text", (node, index, parent) => {
      if (!node.value.includes("]{")) return;

      const inlineAttrRegex = /\[([^\]]+)\]\{([^}]+)\}/g;
      const newChildren = [];
      let lastIndex = 0;
      let match;

      while ((match = inlineAttrRegex.exec(node.value)) !== null) {
        const [fullMatch, textContent, attrStr] = match;
        const props = parseAttrs(attrStr);

        if (match.index > lastIndex) {
          newChildren.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        newChildren.push({
          type: "span", // 使用一个可识别的类型，稍后可被 rehype 处理
          data: {
            hName: "span",
            hProperties: props,
          },
          children: [{ type: "text", value: textContent }],
        });

        lastIndex = match.index + fullMatch.length;
      }

      if (lastIndex === 0) return;

      if (lastIndex < node.value.length) {
        newChildren.push({ type: "text", value: node.value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...newChildren);
      return [visit.SKIP, index + newChildren.length];
    });

    // 阶段 2: 处理特殊块级元素 (例如分割线)
    visit(tree, "thematicBreak", (node, index, parent) => {
      if (parent.children.length > index + 1) {
        const nextNode = parent.children[index + 1];
        if (
          nextNode.type === "paragraph" &&
          nextNode.children.length === 1 &&
          nextNode.children[0].type === "text"
        ) {
          const textNode = nextNode.children[0];
          const match = textNode.value.match(/^\s*\{([^}]+)\}\s*$/);
          if (match) {
            node.data = node.data || {};
            node.data.hProperties = {
              ...node.data.hProperties,
              ...parseAttrs(match[1]),
            };
            parent.children.splice(index + 1, 1);
          }
        }
      }
    });

    // ========================================================================
    // 新增阶段 2.5: 处理导致段落分裂的属性 (你的问题的关键)
    // 这个阶段必须在处理常规块属性之前运行
    // ========================================================================
    visit(tree, "paragraph", (node, index, parent) => {
      if (!node.children.length) return;

      const lastChild = node.children[node.children.length - 1];
      if (!lastChild || lastChild.type !== "text") return;

      // 匹配在行尾、后跟换行符的属性块
      // s标志 (.匹配\n) 和 m标志 (^$匹配行首尾) 很有用，但这里用显式\n更清晰
      const splitRegex = /(.*?)\s*\{([^}]+)\}\s*(\n+)(.*)/s;
      const match = lastChild.value.match(splitRegex);

      if (match) {
        const [, beforeText, attrStr, afterText] = match;

        // 1. 将属性应用到当前段落
        const props = parseAttrs(attrStr);
        node.data = node.data || {};
        node.data.hProperties = { ...node.data.hProperties, ...props };

        // 2. 清理当前段落的文本
        lastChild.value = beforeText.trimEnd();

        // 如果清理后文本节点为空，则移除它
        if (lastChild.value === "") {
          node.children.pop();
        }

        // 3. 如果有后续文本，创建新的段落并插入
        if (afterText.trim()) {
          const newParagraph = {
            type: "paragraph",
            children: [{ type: "text", value: afterText.trim() }],
          };
          // 在当前段落之后插入新段落
          parent.children.splice(index + 1, 0, newParagraph);

          // 告诉 visit 跳过我们刚刚添加的节点，避免重复处理
          return [visit.SKIP, index + 1];
        }
      }
    });

    // 阶段 3: 处理所有其他常规元素 (块级和内联)
    visit(tree, (node) => {
      if (!node.children || node.children.length === 0) {
        return;
      }

      // --- 3a: 内联元素属性处理 ---
      for (let i = node.children.length - 2; i >= 0; i--) {
        const currentChild = node.children[i];
        const nextChild = node.children[i + 1];

        if (
          ["image", "link", "inlineCode", "strong", "emphasis"].includes(
            currentChild.type
          ) &&
          nextChild?.type === "text"
        ) {
          const match = nextChild.value.match(/^\s*\{([^}]+)\}/);
          if (match) {
            const props = parseAttrs(match[1]);
            currentChild.data = currentChild.data || {};
            currentChild.data.hProperties = {
              ...currentChild.data.hProperties,
              ...props,
            };
            nextChild.value = nextChild.value.substring(match[0].length);
            if (nextChild.value.trim() === "") {
              node.children.splice(i + 1, 1);
            }
          }
        }
      }

      // --- 3b: 块级元素属性处理 (现在只处理在块末尾且不导致分裂的情况) ---
      let lastChildTextNode = null;
      let containerOfTextNode = null;

      // 寻找最后一个文本节点
      let lastChild = node.children[node.children.length - 1];
      if (lastChild && lastChild.type === "paragraph") {
        // 适用于 blockquote, listitem 等
        containerOfTextNode = lastChild;
        lastChildTextNode = lastChild.children[lastChild.children.length - 1];
      } else if (lastChild && lastChild.type === "text") {
        // 适用于 heading, paragraph
        containerOfTextNode = node;
        lastChildTextNode = lastChild;
      }

      if (lastChildTextNode && lastChildTextNode.type === "text") {
        const match = lastChildTextNode.value.match(/\s*\{([^}]+)\}\s*$/);
        if (match) {
          const props = parseAttrs(match[1]);
          const listProps = {};
          let hasListProps = false;

          if (node.type === "listItem") {
            Object.entries(props).forEach(([key, value]) => {
              if (key.startsWith("list-")) {
                hasListProps = true;
                const newKey = key.substring(5);
                listProps[newKey === "class" ? "className" : newKey] = value;
                delete props[key]; // 从原始props中移除，避免重复应用
              }
            });

            if (hasListProps) {
              // 这个逻辑需要改进，直接向上查找父级list
              // 但为了保持简单，我们假设它能找到
              visit(tree, "list", (listNode) => {
                if (listNode.children.includes(node)) {
                  listNode.data = listNode.data || {};
                  listNode.data.hProperties = {
                    ...listNode.data.hProperties,
                    ...listProps,
                  };
                }
              });
            }
          }

          // 应用剩余的属性 (或所有属性，如果不是list-*)
          // 你的原始逻辑是应用到 node 上，但通常应该应用到包含文本的段落上
          // 对于 `> p {attr}`，属性应在 `p` 上，而不是 `blockquote`
          const finalTarget =
            node.type === "blockquote" &&
            containerOfTextNode.type === "paragraph"
              ? containerOfTextNode
              : node;

          finalTarget.data = finalTarget.data || {};
          finalTarget.data.hProperties = {
            ...finalTarget.data.hProperties,
            ...props,
          };

          lastChildTextNode.value = lastChildTextNode.value
            .replace(match[0], "")
            .trimEnd();
          if (lastChildTextNode.value === "") {
            containerOfTextNode.children.pop();
            if (
              containerOfTextNode.children.length === 0 &&
              containerOfTextNode !== node
            ) {
              node.children.pop();
            }
          }
        }
      }
    });
  };
}
