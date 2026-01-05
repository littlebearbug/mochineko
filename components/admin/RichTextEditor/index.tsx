'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const items = [
    {
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      label: 'Strike',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      label: 'H1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'H3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
    },
    {
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      label: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      label: 'Quote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      label: 'Code',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.preventDefault();
            item.action();
          }}
          className={`px-2 py-1 text-xs font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            item.isActive()
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default function RichTextEditor({
  value,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: `blog focus:outline-none min-h-[500px] p-4 ${className || ''}`,
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      onChange((editor.storage as any).markdown.getMarkdown());
    },
  });

  // Update content if value changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && value !== (editor.storage as any).markdown.getMarkdown()) {
      // Avoid cursor jump if partial update, but for now simple sync
      // This comparison might be tricky with markdown conversion, so we might skip
      // if it's "close enough" or just do it on mount.
      // For simple forms, usually we only set it if it's empty or drastically different.
      // But for Controller pattern, we need to be careful not to loop.
      // Let's rely on initial content mainly, or check if editor is empty?
      // A safer check:
      if ((editor.storage as any).markdown.getMarkdown() === '') {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-all duration-200 focus-within:border-indigo-600 focus-within:ring-0">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
