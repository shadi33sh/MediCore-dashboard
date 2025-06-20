import React, { useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import axiosInstance from "../app/AuthAxios";
import { useAlert } from "./Alert";

export default function QuillEditor({ value, setValue }) {
  const editorRef = useRef(null);
  let quillInstance = null;
  const {showAlert } = useAlert()
  // Upload image to ImgBB
  const uploadImageToImgBB = async (imageFile) => {
    // const apiKey = "f3a594de5bf2676aec185924fe98050f";
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axiosInstance.post('api/imageUpload',
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return `${process.env.NEXT_PUBLIC_API_URL}${response.data.data}`;
    } catch (error) {
      showAlert('error' , 'Image upload failed')
      return null;
    }
  };

  useEffect(() => {
    // Initialize Quill editor


    quillInstance = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          ["image"],
        ],
      },
      placeholder: "Start writing your article here...",

      readOnly: false
    });

    quillInstance.root.innerHTML = value;

    quillInstance.on("text-change", () => {
      setValue(quillInstance.root.innerHTML);
    });

    quillInstance.root.addEventListener("paste", (event) => {
        event.stopPropagation();
        event.preventDefault();
      
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData("text");
      
        if (pastedText) {
          let range = quillInstance.getSelection();
          
          // Ensure range exists, otherwise set cursor at the end
          if (!range) {
            range = { index: quillInstance.getLength() }; // Default to end
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
      
              // Insert new lines before and after the image
              quillInstance.insertText(range.index, "\n\n");
              quillInstance.insertEmbed(range.index + 1, "image", imageUrl);
              quillInstance.insertText(range.index + 2, "\n\n");
      
              // Move cursor to the next line after the image
              quillInstance.setSelection(range.index + 3);
            }
          }
        };
      });
           
  }, []);

  return <div ref={editorRef} className="quill-editor-container"/>;
}
