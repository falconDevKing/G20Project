// ImageRow.ts
import { Node, mergeAttributes } from "@tiptap/core";

export const ImageRow = Node.create({
  name: "imageRow",

  group: "block",
  content: "image+",
  defining: true,
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="image-row"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "image-row",
        style: "display:flex; gap:10px; align-items:flex-start; flex-wrap:nowrap; margin-bottom:10px;",
      }),
      0,
    ];
  },
});
