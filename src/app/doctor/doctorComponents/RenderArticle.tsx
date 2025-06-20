import React from 'react';

export default function RenderedArticle({ content }: { content: string }) {
  const renderWithImages = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
      const imageMatch = line.match(/^\[(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))\]$/);
      if (imageMatch) {
        return (
          <div key={index} className="my-4">
            <img
              src={imageMatch[1]}
              alt="article"
              className="w-full max-w-xl rounded-lg mx-auto"
            />
          </div>
        );
      } else {
        return (
          <p key={index} className="text-base leading-relaxed my-2">
            {line}
          </p>
        );
      }
    });
  };

  return <div className="prose dark:prose-invert">{renderWithImages(content)}</div>;
}
