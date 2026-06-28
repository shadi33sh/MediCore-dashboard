"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheckCircle, MdError } from "react-icons/md"; // Import success/error icons

const AlertContext = createContext(null);

export const AlertProvider = ({ children} : {children : ReactNode}) => {
  const [alert, setAlert] = useState({ message: "", type: "" });
  const showAlert = (type: "success" | "error", message: string | object) => {
    let formattedMessage = "";
  
    // If message is already an object
    if (typeof message === "object" && message !== null) {
      const errorData = (message as any).data ?? message;
  
      if (typeof errorData === "object") {
        formattedMessage = Object.entries(errorData)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(", ")}`;
            }
            return `${field}: ${messages}`;
          })
          .join("\n");
      } else {
        formattedMessage = (message as any).msg || "An error occurred.";
      }
    }
  
    // If message is a string
    else if (typeof message === "string") {
      try {
        const parsed = JSON.parse(message);
        return showAlert(type, parsed); // Recurse with parsed object
      } catch {
        formattedMessage = message; // Plain string fallback
      }
    }
  
    setAlert({ message: formattedMessage, type });
  
    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 5000);
  };
  

  return (
    <AlertContext.Provider value={{ alert, showAlert } as any}>
      <AnimatePresence>
        {alert.message && (
        <motion.div
        initial={{ opacity: 0, scale: 0, translateY: -20 }}
        animate={{ opacity: 1, scale: 1, translateY: 30 }} // **Smooth upward movement**
        exit={{ opacity: 0, scale: 0.5, translateY: 0 }} // **Shrinks while fading out**
        transition={{
          opacity: { duration: 0.8, ease: "easeOut" }, // **Smoother fade-in effect**
          scale: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }, // **Natural scaling curve**
          translateY: { duration: 2.5, ease: [0.4, 0, 0.2, 1] }, // **Better vertical transition**
        }}
        className="fixed top-4 center w-full z-50"
      >
      
            <div
              className={`transform max-w-[500px] w-fit p-2 px-5 text-white rounded-lg shadow-xl flex flex-row items-center justify-center gap-4  ${
                alert.type === "success" ? "bg-green-600 shadow-lg shadow-green-600/50" : "bg-red-600  drop-shadow-xl shadow-red-700/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {alert.type === "success" ? <MdCheckCircle size={24} /> : <MdError size={24} />}
                <p className="font-bold">{alert.type === "success" ? "Success!" : "Error!"}</p>
              </div>

              {/* Properly Render Multi-Line Error Messages */}
              {alert.type === "error" && (
                <div className="text-[12px] font-semibold font-mono whitespace-pre-line">{alert.message}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </AlertContext.Provider>
  );
};

export const useAlert : any = () => useContext(AlertContext)
