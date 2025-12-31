import remarkAttributes from '../utils/plugins/remark-attributes.js';

// Mock visit function if needed, or rely on the real one if it works.
// Since remark-attributes uses 'unist-util-visit', and it is in package.json, it should work.
// But just in case, we can rely on node resolution.

async function test() {
  console.log('Starting test...');

  const cases = [
    {
      name: 'Standard Attribute',
      // Simulate a paragraph with text that has attributes
      tree: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: 'text {class="my-class"}' }],
          },
        ],
      },
      check: (tree) => {
        // Expecting the text node to be modified or split
        const p = tree.children[0];
        return p.data?.hProperties?.className === 'my-class';
      },
    },
    {
      name: 'Kebab Case Attribute',
      tree: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: 'text {data-id="123"}' }],
          },
        ],
      },
      check: (tree) => {
        const p = tree.children[0];
        return p.data?.hProperties?.dataId === '123';
      },
    },
    {
      name: 'Inline Attribute',
      tree: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'prefix [content]{title="hover"} suffix' },
            ],
          },
        ],
      },
      check: (tree) => {
        // Should find a span with title property
        const p = tree.children[0];
        const span = p.children.find((c) => c.type === 'span');
        return span && span.data?.hProperties?.title === 'hover';
      },
    },
    {
      name: 'Nested Bold with Spaces',
      // text **bold {style="color: pink"}** text
      tree: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'text ' },
              {
                type: 'strong',
                children: [
                  { type: 'text', value: 'bold {style="color: pink"}' },
                ],
              },
              { type: 'text', value: ' text' },
            ],
          },
        ],
      },
      check: (tree) => {
        const p = tree.children[0];
        const strong = p.children.find((c) => c.type === 'strong');
        // Should have style prop and text should be stripped of attribute
        const hasStyle = strong.data?.hProperties?.style?.color === 'pink';
        const cleanText = strong.children[0].value === 'bold';
        return hasStyle && cleanText;
      },
    },
    {
      name: 'Nested Bold without Spaces',
      // text**bold {style="color: pink"}**text
      tree: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'text' },
              {
                type: 'strong',
                children: [
                  { type: 'text', value: 'bold {style="color: pink"}' },
                ],
              },
              { type: 'text', value: 'text' },
            ],
          },
        ],
      },
      check: (tree) => {
        const p = tree.children[0];
        const strong = p.children.find((c) => c.type === 'strong');
        const hasStyle = strong.data?.hProperties?.style?.color === 'pink';
        const cleanText = strong.children[0].value === 'bold';
        return hasStyle && cleanText;
      },
    },
    {
      name: 'Intraword Bold Failure Case',
      // The parser might see this as just one text string if GFM strictness prevents intraword emphasis with spaces inside?
      // Actually user says: "This is a text with **bold {attr}** inside".
      // If input is: "text**bold {attr}**text" as a single text node.
      tree: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'prefix**bold {style="color: red"}**suffix',
              },
            ],
          },
        ],
      },
      check: (tree) => {
        // Should have split into text, strong, text
        const p = tree.children[0];
        const strong = p.children.find((c) => c.type === 'strong');
        if (!strong) return false;

        const hasStyle = strong.data?.hProperties?.style?.color === 'red';
        const cleanText = strong.children[0].value === 'bold';
        return hasStyle && cleanText;
      },
    },
    {
      name: 'Intraword Italic Failure Case',
      // prefix*italic {style="color: blue"}*suffix
      tree: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'prefix*italic {style="color: blue"}*suffix',
              },
            ],
          },
        ],
      },
      check: (tree) => {
        const p = tree.children[0];
        const em = p.children.find((c) => c.type === 'emphasis');
        if (!em) return false;

        const hasStyle = em.data?.hProperties?.style?.color === 'blue';
        const cleanText = em.children[0].value === 'italic';
        return hasStyle && cleanText;
      },
    },
  ];

  const transformer = remarkAttributes();

  for (const c of cases) {
    try {
      // deep copy tree to avoid mutation issues between runs if any (though we recreate)
      const treeCopy = JSON.parse(JSON.stringify(c.tree));

      transformer(treeCopy);

      if (c.check(treeCopy)) {
        console.log(`[PASS] ${c.name}`);
      } else {
        console.log(`[FAIL] ${c.name}`);
        // console.log("Tree:", JSON.stringify(treeCopy, null, 2));
      }
    } catch (e) {
      console.log(`[ERROR] ${c.name}: ${e.message}`);
      console.error(e);
    }
  }
}

test();
