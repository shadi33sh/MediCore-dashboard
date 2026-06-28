"use client";
import React, { useState } from "react";
import QuillEditor from "../../../Components/QuillEditor";
import axiosInstance from "../../AuthAxios";
import { useAlert } from "../../../Components/Alert";

export default function AddArticleForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const { showAlert } = useAlert();

  const extractPlainTextWithImages = (html: string) => {
    if (typeof document === "undefined") return "";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    let formattedText = "";

    tempDiv.childNodes.forEach((node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeName === "IMG") {
          formattedText += `\n[${(child as HTMLImageElement).getAttribute("src")}]\n`;
        } else if (
          child.nodeType === Node.TEXT_NODE ||
          child.nodeName === "P"
        ) {
          formattedText += `${child.textContent?.trim() ?? ""}\n`;
        }
      });
    });

    return formattedText.replace(/\n+/g, "\n").trim();
  };

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Convert Quill content to formatted text with image URLs
    const processedContent = extractPlainTextWithImages(formData.content);

    console.log("Formatted Article:", {
      title: formData.title,
      body: processedContent,
    });

    try {
      const response = await axiosInstance.post(
        "api/postArticle",
        { title: formData.title, body: processedContent },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return `${process.env.NEXT_PUBLIC_API_URL}${response.data.data}`;
    } catch (error: any) {
      showAlert("error", "filed to upload article");
      return null;
    }

    // TODO: Send processedContent to backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-screen text-gray-900 dark:text-gray-100"
    >
      {/* Title Input */}
      <div className="top-0 z-10 p-2 bg-white dark:bg-gray-900">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter article title..."
          className="w-full text-2xl font-semibold px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
      </div>

      {/* Quill Editor with Dark Mode */}
      <div className="flex-1 overflow-y-auto scroll-hidden  p-4">
        <QuillEditor value={formData.content} setValue={handleContentChange} />
      </div>

      {/* Bottom Controls */}
      <div className="sticky bottom-0 z-10 p-4 border-t border-gray-200 dark:border-gray-800 bg-black flex justify-between gap-2">
        <button
          type="submit"
          // onClick={()=>console.log(extractPlainTextWithImages(formData.content))}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
        >
          Publish Article
        </button>
      </div>
    </form>
  );
}
