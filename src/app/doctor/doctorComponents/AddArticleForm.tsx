"use client";
import React, { useState } from "react";
import QuillEditor from "../../../Components/QuillEditor";
import axiosInstance from "../../AuthAxios";
import { useAlert } from "../../../Components/Alert";
import Loading from "../../../Components/loading";
import { FiCheck, FiTag } from "react-icons/fi";

export default function AddArticleForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    // Convert Quill content to formatted text with image URLs
    const processedContent = extractPlainTextWithImages(formData.content);

    try {
      const response = await axiosInstance.post(
        "api/postArticle",
        { title: formData.title, body: processedContent },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      showAlert("success", "Article published successfully!");
      setFormData({ title: "", content: "" });
      // Reload page to show the new article
      window.location.reload();
      return `${process.env.NEXT_PUBLIC_API_URL}${response.data.data}`;
    } catch (error: any) {
      showAlert("error", "Failed to upload article");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      {/* Title Input */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
          <FiTag size={13} className="text-Primary" />
          Article Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. 10 Tips to Keep Your Heart Healthy"
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-base text-gray-850 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all"
          required
        />
      </div>

      {/* Quill Editor with Dark Mode */}
      <div className="flex-1 overflow-y-auto p-5 bg-white dark:bg-gray-900 min-h-[300px]">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">
          Content
        </label>
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800">
          <QuillEditor value={formData.content} setValue={handleContentChange} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-5 border-t border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end">
        {loading ? (
          <div className="py-2 px-6">
            <Loading size={24} />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-Primary to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-Primary/20 hover:shadow-xl transition flex items-center justify-center gap-2"
          >
            <FiCheck size={16} />
            Publish Article
          </button>
        )}
      </div>
    </form>
  );
}
