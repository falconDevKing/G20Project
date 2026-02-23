// components/messaging/InsertImageModal.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Editor } from "@tiptap/react";

interface InsertImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageNumber: number;
  editor: Editor;
}

const InsertImageModal = ({ open, onOpenChange, imageNumber, editor }: InsertImageModalProps) => {
  const [url, setUrl] = useState<string[]>([]);
  const [alt, setAlt] = useState("");

  const handleInsert = () => {
    if (!(url.filter(Boolean).length === imageNumber && url.every((u) => !!u.trim()))) return;

    if (!editor) return;

    const imagesContentArray = Array.from({ length: imageNumber })
      .map((_, i) => url[i]?.trim())
      .filter(Boolean)

    const actualImageNumber = imagesContentArray.length;
    const imageWidth = actualImageNumber === 1 ? "100%" : actualImageNumber === 2 ? "49%" : actualImageNumber === 3 ? "32%" : "100%";

    const imagesContent = imagesContentArray
      .map((src, i) => ({
        type: "image",
        attrs: {
          src,
          alt: `${alt || "Image"} ${i + 1}`,
          style: `width:${imageWidth}; border:1px solid #f2e394; height:auto; border-radius:6px;`,
        },
      }));

    if (!imagesContent.length) return;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "imageRow",
        content: imagesContent,
      })
      .run();

    setUrl([]);
    setAlt("");
    onOpenChange(false);
  };

  useEffect(() => {
    setUrl([]);
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert image{imageNumber > 1 ? "s" : ""}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {Array.from({ length: imageNumber }).map((_, index) => (
            <Input
              key={index}
              placeholder={`Image URL ${index + 1} (https://...)`}
              value={url[index] || ""}
              onChange={(e) => {
                const newUrl = [...url];
                newUrl[index] = e.target.value;
                setUrl(newUrl);
              }}
            />
          ))}

          <Input
            placeholder="Alt text (optional)"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!(url.filter(Boolean).length === imageNumber && url.every((u) => !!u.trim()))}          >
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InsertImageModal;