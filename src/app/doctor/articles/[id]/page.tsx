'use client'
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../AuthAxios";
import { useParams } from "next/navigation";
import LoadingScreen from "../../../../Components/loadingScreen";

// Helper function to render text & images correctly
function RenderedArticle({ content }: { content: string }) {
  const renderWithImages = (text: string) => {
    return text.split("\n").map((line, index) => {
      // Regex to detect and clean image URLs wrapped in [ ]
      const imageRegex = /\[(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))\]/g;

      // Replace image URLs with actual img elements, removing brackets
      const formattedLine = line.replace(imageRegex, (_, url) => `<img src="${url}" alt="Article" class="w-full max-w-xl rounded-xl mx-auto my-4 inline-block" />`);

      return (
        <p key={index} className="text-[13px] md:text-[15px] leading-relaxed my-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return <div className="prose dark:prose-invert">{renderWithImages(content)}</div>;
}


export default function ArticlePage() {
  const [article, setArticle] = useState<{title :string , body : string}>();
  const [loading, setLoading] = useState(true); // Loading state
  const id = useParams().id

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axiosInstance.get(`api/getAtricleById/${id}`); 
        setArticle(response.data.data); 
      } catch (err : any) {
        // console.error('Error fetching articles:', err);
      } finally {
        setLoading(false); // Turn off loading state
      }
    }
    fetchArticles();
  }, []);


  if (loading) return <LoadingScreen />; // Display loading screen before rendering content
  if (!article) return <p className="text-center mt-20 dark:text-white">Article not found.</p>;

  return (
    <div className="min-h-screen flex flex-col dark:text-white items-center  p-6">
      {/* Header */}
      <div className="flex items-center gap-3 fixed top-0 p-4 w-screen dark:bg-gray-900 z-50">
        <img className="w-[60px] h-[60px]" src="/images/Logo.png" alt="Logo" />
        <h1 className="font-bold  text-2xl  ">
          <span className="text-Primary">Medi</span>Core <span className="text-sm italic font-thin">Medical Articles</span>
        </h1>
      </div>

      {/* Article Content */}
    <div className="w-full max-w-3xl  p-6 rounded-xl  mt-20">
       <h1 className="text-4xl max-md:text-3xl font-black">{article?.title}</h1>
        {/* <div className="flex items-center gap-3 py-5 relative">
            <img className="w-10 h-10 rounded-full shadow-md object-cover" src={article.doctor.image} alt={article.doctor.name} />
                <div className="flex flex-col">
                  <h2 className="text-[20px] max-md:text-[15px] font-bold  ">{article.doctor.name} <span className="px-3 text-lg font-semibold text-yellow-500">{article.doctor.rating} ⭐</span></h2>
                  <p className=" text-gray-600 text-sm dark:text-grmay-300 font-bold">{article.doctor.section}</p>
        </div>
        </div> */}

        <RenderedArticle content={article.body} />
      </div>
    </div>
  );
}
