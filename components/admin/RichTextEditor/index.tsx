'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import { useEffect, useRef, useState } from 'react';
import Prompt from '../Prompt';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface MenuItem {
  label: string;
  action: () => void;
  isActive: () => boolean;
  separator?: boolean;
}

interface MenuBarProps {
  editor: Editor | null;
  onOpenPrompt: (config: {
    title: string;
    defaultValue: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }) => void;
}

const MenuBar = ({ editor, onOpenPrompt }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    onOpenPrompt({
      title: 'Insert Link',
      defaultValue: previousUrl,
      placeholder: 'https://example.com',
      onConfirm: (url: string) => {
        if (url === '') {
          editor.chain().focus().extendMarkRange('link').unsetLink().run();
          return;
        }
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url })
          .run();
      },
    });
  };

  const addImage = () => {
    onOpenPrompt({
      title: 'Insert Image',
      defaultValue: '',
      placeholder: 'https://example.com/image.png',
      onConfirm: (url: string) => {
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
    });
  };

  const items: MenuItem[] = [
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
      separator: true,
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
      separator: true,
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
      separator: true,
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
      separator: true,
    },
    {
      label: 'Link',
      action: setLink,
      isActive: () => editor.isActive('link'),
    },
    {
      label: 'Image',
      action: addImage,
      isActive: () => editor.isActive('image'),
    },
    {
      label: 'Divider',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: () => false,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <button
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
          {item.separator && (
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          )}
        </div>
      ))}
    </div>
  );
};

export default function RichTextEditor({
  value,
  onChange,
  className,
}: RichTextEditorProps) {
  const isInternalUpdate = useRef(false);
  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    defaultValue: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    defaultValue: '',
    placeholder: '',
    onConfirm: () => {},
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
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
      isInternalUpdate.current = true;
      onChange((editor.storage as any).markdown.getMarkdown());
    },
  });

  // Sync external value changes to editor
  useEffect(() => {
    if (!editor) return;

    // Skip if this update came from the editor itself
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const currentContent = (editor.storage as any).markdown.getMarkdown();

    // Only update if the value is actually different
    if (value !== currentContent) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handleOpenPrompt = (config: Omit<typeof promptConfig, 'isOpen'>) => {
    setPromptConfig({ ...config, isOpen: true });
  };

  const handleClosePrompt = () => {
    setPromptConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-all duration-200 focus-within:border-indigo-600 focus-within:ring-0">
      <MenuBar editor={editor} onOpenPrompt={handleOpenPrompt} />
      <EditorContent editor={editor} />
      <Prompt
        isOpen={promptConfig.isOpen}
        title={promptConfig.title}
        defaultValue={promptConfig.defaultValue}
        placeholder={promptConfig.placeholder}
        onConfirm={(value) => {
          promptConfig.onConfirm(value);
          handleClosePrompt();
        }}
        onCancel={handleClosePrompt}
      />
    </div>
  );
}
