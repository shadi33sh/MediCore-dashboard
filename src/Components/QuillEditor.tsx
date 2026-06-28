import React, { useRef, useEffect } from "react";
import "quill/dist/quill.snow.css";
import axiosInstance from "../app/AuthAxios";
import { useAlert } from "./Alert";

export default function QuillEditor({ value, setValue }) {
  const editorRef = useRef(null);
  let quillInstance = null;
  const { showAlert } = useAlert();

  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axiosInstance.post("api/imageUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return `${process.env.NEXT_PUBLIC_API_URL}${response.data.data}`;
    } catch (error) {
      showAlert("error", "Image upload failed");
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { default: Quill } = await import("quill");
      if (!mounted || !editorRef.current) return;

      quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [["image"]],
        },
        placeholder: "Start writing your article here...",
        readOnly: false,
      });

      quillInstance.root.innerHTML = value;

      quillInstance.on("text-change", () => {
        setValue(quillInstance.root.innerHTML);
      });

      quillInstance.root.addEventListener("paste", (event) => {
        event.stopPropagation();
        event.preventDefault();

        const clipboardData = event.clipboardData || window.Clipboard;
        const pastedText = clipboardData.getData("text");

        if (pastedText) {
          let range = quillInstance.getSelection();

          if (!range) {
            range = { index: quillInstance.getLength() };
          }

          quillInstance.insertText(range.index, pastedText);
          quillInstance.setSelection(range.index + pastedText.length);
        }
      });

      quillInstance.getModule("toolbar").addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          if (file) {
            const imageUrl = await uploadImageToImgBB(file);
            if (imageUrl) {
              const range = quillInstance.getSelection();

              quillInstance.insertText(range.index, "\n\n");
              quillInstance.insertEmbed(range.index + 1, "image", imageUrl);
              quillInstance.insertText(range.index + 2, "\n\n");
              quillInstance.setSelection(range.index + 3);
            }
          }
        };
      });
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return <div ref={editorRef} className="quill-editor-container" />;
}