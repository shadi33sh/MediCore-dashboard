"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "../doctorComponents/DocDashboardLayout";
import { AnimatePresence, motion } from "framer-motion";
import { IoAddCircle } from "react-icons/io5";
import axiosInstance from "../../AuthAxios";
import AddArticleForm from "../doctorComponents/AddArticleForm";
import Loading from "../../../Components/loading";

export default function Page() {
  const [addArticleModal, setAddArticleModal] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axiosInstance.get("api/getAtricles"); // Adjust endpoint if needed
        setArticles(response.data.data.articles); // Store article list
      } catch (err: any) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false); // Turn off loading state
      }
    }
    fetchArticles();
  }, []);

  return (
    <DashboardLayout title="Doctor Articles">
      <button
        className="px-4 py-3 rounded-xl bg-Primary flex items-center gap-2"
        onClick={() => setAddArticleModal(true)}
      >
        <IoAddCircle /> Add an Article
      </button>

      <AnimatePresence>
        {addArticleModal && (
          <>
            <motion.div
              className="fixed center h-screen w-screen bg-black/80 -top-6 left-0 scroll-hidden"
              onClick={() => setAddArticleModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="center w-full h-full p-10 fixed left-0 -top-6 scroll-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setAddArticleModal(false)}
                className="absolute top-8 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl scroll-hidden"
              >
                &times;
              </button>
              <div className="bg-gray-900 w-full h-full rounded-xl">
                <AddArticleForm />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Show loading screen while fetching data */}
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md"
            >
              <img
                src={article.image}
                alt={article.title}
                className="rounded-md h-48 w-full object-cover mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(article.date).toLocaleDateString()} •{" "}
                {article.doctorName}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
