import { GeneralTooltip } from "@/components/FormTooltips";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Text,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImagePlus
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import InsertImageModal from "./insertImageModal";
import { cn } from "@/lib/utils";

const buttonClass = (active: boolean) =>
  `p-1.5 border dark:text-white hover:text-black rounded hover:bg-gray-100 transition ${active ? "bg-GGP-lightGold  text-black border-GGP-darkGold" : "text-gray-700"}`;

const MessageToolbar = ({ MessageEditor }: { MessageEditor: Editor }) => {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageNumber, setImageNumber] = useState(1);

  if (!MessageEditor) return null;

  return (
    <div className="flex flex-wrap gap-2 border p-2 rounded bg-transparent mb-2">
      <GeneralTooltip text="Bold">
        <button onClick={() => MessageEditor.chain().focus().toggleBold().run()} className={buttonClass(MessageEditor.isActive("bold"))}>
          <Bold size={16} className="hover:text-black" />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Italic">
        <button onClick={() => MessageEditor.chain().focus().toggleItalic().run()} className={buttonClass(MessageEditor.isActive("italic"))}>
          <Italic size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Underline">
        <button onClick={() => MessageEditor.chain().focus().toggleUnderline().run()} className={buttonClass(MessageEditor.isActive("underline"))}>
          <UnderlineIcon size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Bullet List">
        <button onClick={() => MessageEditor.chain().focus().toggleBulletList().run()} className={buttonClass(MessageEditor.isActive("bulletList"))}>
          <List size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Numbered List">
        <button onClick={() => MessageEditor.chain().focus().toggleOrderedList().run()} className={buttonClass(MessageEditor.isActive("orderedList"))}>
          <ListOrdered size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Align Left">
        <button onClick={() => MessageEditor.chain().focus().setTextAlign("left").run()} className={buttonClass(MessageEditor.isActive({ textAlign: "left" }))}>
          <AlignLeft size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Align Center">
        <button
          onClick={() => MessageEditor.chain().focus().setTextAlign("center").run()}
          className={buttonClass(MessageEditor.isActive({ textAlign: "center" }))}
        >
          <AlignCenter size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Align Right">
        <button
          onClick={() => MessageEditor.chain().focus().setTextAlign("right").run()}
          className={buttonClass(MessageEditor.isActive({ textAlign: "right" }))}
        >
          <AlignRight size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Justify">
        <button
          onClick={() => MessageEditor.chain().focus().setTextAlign("justify").run()}
          className={buttonClass(MessageEditor.isActive({ textAlign: "justify" }))}
        >
          <AlignJustify size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Blockquote">
        <button onClick={() => MessageEditor.chain().focus().toggleBlockquote().run()} className={buttonClass(MessageEditor.isActive("blockquote"))}>
          <Quote size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Paragraph">
        <button onClick={() => MessageEditor.chain().focus().setParagraph().run()} className={buttonClass(MessageEditor.isActive("paragraph"))}>
          <Text size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Heading 1">
        <button
          onClick={() => MessageEditor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={buttonClass(MessageEditor.isActive("heading", { level: 1 }))}
        >
          <Heading1 size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Heading 2">
        <button
          onClick={() => MessageEditor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={buttonClass(MessageEditor.isActive("heading", { level: 2 }))}
        >
          <Heading2 size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Insert Link">
        <button
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) MessageEditor.chain().focus().setLink({ href: url }).run();
          }}
          className={buttonClass(MessageEditor.isActive("link"))}
        >
          <LinkIcon size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Remove Link">
        <button onClick={() => MessageEditor.chain().focus().unsetLink().run()} className={buttonClass(false)}>
          <Unlink size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Undo">
        <button onClick={() => MessageEditor.chain().focus().undo().run()} className={buttonClass(false)}>
          <Undo size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Redo">
        <button onClick={() => MessageEditor.chain().focus().redo().run()} className={buttonClass(false)}>
          <Redo size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Image">
        <button
          onClick={() => {
            setImageNumber(1);
            setOpenImageModal(true)
          }}
          className={buttonClass(false)}
        >
          <ImagePlus size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Double Row Image">
        <button
          onClick={() => {
            setImageNumber(2);
            setOpenImageModal(true)
          }}
          className={cn(buttonClass(false), 'flex')}
        >
          <ImagePlus size={16} /> <ImagePlus size={16} />
        </button>
      </GeneralTooltip>

      <GeneralTooltip text="Triple Row Image">
        <button
          onClick={() => {
            setImageNumber(3);
            setOpenImageModal(true)
          }}
          className={cn(buttonClass(false), 'flex')}
        >
          <ImagePlus size={16} /> <ImagePlus size={16} /> <ImagePlus size={16} />
        </button>
      </GeneralTooltip>

      <InsertImageModal
        open={openImageModal}
        onOpenChange={setOpenImageModal}
        editor={MessageEditor}
        imageNumber={imageNumber}
      />
    </div>
  );
};

export default MessageToolbar;
