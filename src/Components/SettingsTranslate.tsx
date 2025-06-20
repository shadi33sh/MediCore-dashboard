"use client";

import React, { useEffect, useState } from "react";

const GoogleTranslate = () => {
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [direction, setDirection] = useState("ltr"); // ✅ Default text direction

  useEffect(() => { updateDirection();}, []);

  // ✅ Function to check language from Google Translate cookie
  const updateDirection = () => {
    const langCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="));

    if (langCookie && langCookie.includes("/en/ar")) {
    } else {
      setDirection("ltr"); // ✅ Default to left-to-right (LTR)
    }
  };

  return (
    <div>

      <div id="google_translate_element" style={{ display: "none" }} />

      {/* ✅ Buttons to trigger translation */}
      <button
        onClick={() => {
          document.cookie = "googtrans=/en/ar; path=/";
          window.location.reload();
        }}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
      >
        Arabic
      </button>

      <button
        onClick={() => {
          document.cookie = "googtrans=/en/en; path=/";
          window.location.reload();
        }}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        English
      </button>
    </div>
  );
};

export default GoogleTranslate;
