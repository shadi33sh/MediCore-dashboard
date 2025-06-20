"use client";
import React, { useEffect, useState } from "react";

const GoogleTranslate = () => {
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [direction, setDirection] = useState("ltr"); // ✅ Default text direction

  useEffect(() => {
    // ✅ Inject Google Translate script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onload = () => {
      setLoading(false); // ✅ Hide loading overlay once script loads
      updateDirection(); // ✅ Update text direction based on language
    };
    document.body.appendChild(script);

    // ✅ Define Google Translate init function globally
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    // ✅ Check translation state on page load
    updateDirection();
  }, []);

  // ✅ Function to check language from Google Translate cookie
  const updateDirection = () => {
    const langCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("googtrans="));

    if (langCookie && langCookie.includes("/en/ar")) {
      setDirection("rtl"); // ✅ Set right-to-left (RTL) for Arabic
      document.body.classList.add("rlt") 

    } else {
      setDirection("ltr"); // ✅ Default to left-to-right (LTR)
    }
  };

  return <>
  
  {loading && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center text-white text-lg">
          Language is loading...
        </div>
      )}
      </>
};

export default GoogleTranslate;
