'use client'
import React, { useEffect, useState } from "react";
import axiosInstance from "../../AuthAxios";
import { useParams, useRouter } from "next/navigation";
import LoadingScreen from "../../../Components/loadingScreen";
import { FiArrowLeft } from "react-icons/fi";

// Helper function to render text & images correctly
function RenderedArticle({ content }: { content: string }) {
  const renderWithImages = (text: string) => {
    return text.split("\n").map((line, index) => {
      // Regex to detect and clean image URLs wrapped in [ ]
      const imageRegex = /\[(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))\]/g;

      // Replace image URLs with actual img elements, removing brackets
      const formattedLine = line.replace(imageRegex, (_, url) => `<img src="${url}" alt="Article" class="w-full max-w-xl rounded-xl mx-auto my-6 inline-block shadow-md" />`);

      return (
        <p key={index} className="text-[16px] md:text-[18px] leading-relaxed my-4 text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return <div className="prose dark:prose-invert max-w-none">{renderWithImages(content)}</div>;
}


export default function ArticlePage() {
  const [article, setArticle] = useState<any>();
  const [loading, setLoading] = useState(true); 
  const id = useParams().id;
  const router = useRouter();

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axiosInstance.get(`api/getAtricleById/${id}`); 
        setArticle(response.data.data); 
      } catch (err : any) {
        // console.error('Error fetching articles:', err);
      } finally {
        setLoading(false); 
      }
    }
    fetchArticles();
  }, [id]);

  if (loading) return <LoadingScreen />; 
  if (!article) return <p className="text-center mt-20 dark:text-white text-lg">Article not found.</p>;

  const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : '';

  return (
    <div className="min-h-screen flex flex-col dark:text-white bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Header Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4 px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              <FiArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <img className="w-9 h-9 object-contain drop-shadow-sm" src="/images/Logo.png" alt="Logo" />
              <h1 className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white flex items-baseline gap-1">
                <span className="text-Primary">Medi</span>Core 
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-10 md:py-16">
        
        {/* Title and Metadata */}
        <header className="mb-10 border-b border-gray-200 dark:border-gray-800 pb-8">
           <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
             {article?.title}
           </h1>
           
           <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
              {article.doctor && article.doctor.user && (
                <div className="flex items-center gap-3">
                  {article.doctor.user.img_path ? (
                    <img 
                      src={article.doctor.user.img_path} 
                      alt="Doctor" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-Primary/10 text-Primary font-bold flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                      {article.doctor.user.first_name?.[0]}{article.doctor.user.last_name?.[0]}
                    </div>
                  )}
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">
                    Dr. {article.doctor.user.first_name} {article.doctor.user.last_name}
                  </span>
                </div>
              )}
              {dateStr && (
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span className="text-gray-500 dark:text-gray-400">{dateStr}</span>
                </div>
              )}
           </div>
        </header>

        {/* Body */}
        <div className="article-content">
          <RenderedArticle content={article.body} />
        </div>
      </main>
    </div>
  );
}
