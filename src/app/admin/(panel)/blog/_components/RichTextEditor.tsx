"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeIcon,
  MinusIcon,
  LinkIcon,
  Link2OffIcon,
  Undo2Icon,
  Redo2Icon,
} from "lucide-react";

function Sep() {
  return <span className="w-px h-5 bg-gray-800 mx-0.5 shrink-0" />;
}

function TBtn({
  onClick,
  active = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center justify-center w-7 h-7 rounded-md text-sm transition-colors ${
        active
          ? "bg-yellow-600 text-black"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  defaultContent = "",
  onChange,
}: {
  defaultContent?: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder: "Write your post…" }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: false,
      }),
    ],
    content: defaultContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: { class: "tiptap-content" },
    },
  });

  const handleLink = () => {
    const prev = editor?.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL:", prev);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) return null;

  const h = (level: 1 | 2 | 3) => () =>
    editor.chain().focus().toggleHeading({ level }).run();

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-800 bg-gray-900/60">
        <TBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2Icon size={13} />
        </TBtn>
        <TBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2Icon size={13} />
        </TBtn>

        <Sep />

        <TBtn title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={h(1)}>
          <span className="text-[11px] font-bold">H1</span>
        </TBtn>
        <TBtn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={h(2)}>
          <span className="text-[11px] font-bold">H2</span>
        </TBtn>
        <TBtn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={h(3)}>
          <span className="text-[11px] font-bold">H3</span>
        </TBtn>

        <Sep />

        <TBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <BoldIcon size={13} />
        </TBtn>
        <TBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <ItalicIcon size={13} />
        </TBtn>
        <TBtn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={13} />
        </TBtn>
        <TBtn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <StrikethroughIcon size={13} />
        </TBtn>

        <Sep />

        <TBtn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <ListIcon size={13} />
        </TBtn>
        <TBtn title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrderedIcon size={13} />
        </TBtn>

        <Sep />

        <TBtn title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <QuoteIcon size={13} />
        </TBtn>
        <TBtn title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <CodeIcon size={13} />
        </TBtn>
        <TBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <MinusIcon size={13} />
        </TBtn>

        <Sep />

        <TBtn title="Link" active={editor.isActive("link")} onClick={handleLink}>
          <LinkIcon size={13} />
        </TBtn>
        {editor.isActive("link") && (
          <TBtn title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
            <Link2OffIcon size={13} />
          </TBtn>
        )}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
