'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAlert } from '../../../Components/Alert';

function MedicalChatbot() {
  const specializations = [
    "family",
    "internal",
    "pediatrics",
    "cardiology",
    "neurology",
    "orthopedics",
    "dermatology",
    "psychiatry",
    "oncology",
    "gastroenterology",
    "urology",
    "nephrology",
    "endocrinology",
    "obstetrics",
    "radiology",
    "anesthesiology",
    "pathology",
    "emergency",
    "allergy-immunology",
    "general"
  ];
  
      const  jsonStr = `{
          "status": "success",
          "message": "Medical analysis completed successfully",
          "result": {
              "response": {
                  "message": "FUE, or Follicular Unit Extraction, is a popular hair transplant technique used to treat hair loss. In this minimally invasive procedure, individual hair follicles are extracted from a donor area (usually the back of the scalp) and then transplanted to the balding or thinning areas. FUE is favored for its reduced scarring compared to traditional strip methods and allows for quicker recovery times.",
                  "recommendations": [
                      "Consider consulting a dermatologist or a hair restoration specialist for a personalized assessment.",
                      "Evaluate the potential causes of hair loss, such as genetics, hormonal changes, or medical conditions.",
                      "Research and understand the FUE procedure, including costs, recovery times, and potential side effects."
                  ],
                  "warnings": [
                      "This information is for educational purposes only and should not substitute for professional medical advice.",
                      "Consult a qualified healthcare provider for a proper diagnosis and treatment options."
                  ],
                  "references": [
                      "American Academy of Dermatology - Hair Loss Treatment",
                      "International Society of Hair Restoration Surgery (ISHRS) - FUE Techniques"
                  ],
                  "followUp": [
                      "What specific concerns do you have about hair loss?",
                      "Have you considered other treatment options besides FUE?"
                  ]
              },
              "metadata": {
                  "specialization": "Dermatology/Hair Restoration",
                  "confidence": "High",
                  "requiresPhysicianConsult": true,
                  "emergencyLevel": "routine",
                  "topRelatedSpecialties": [
                      "Dermatology",
                      "Plastic Surgery",
                      "Trichology"
                  ]
              }
          },
          "cacheTime": 1749134617606,
          "metadata": {
              "language": "en",
              "specialization": "family",
              "queryTime": "2025-06-05T14:43:37.606Z"
          }
      }`

  // Default specialization is the first one.
  const [selectedSpecialization, setSelectedSpecialization] = useState(specializations[0]);

  // Chat history: each entry contains the user's message and the structured bot reply.
  const [chatHistory, setChatHistory] = useState<
    Array<{
      user: string;
      bot: {
        message: string;
        followUp?: string[];
        recommendations?: string[];
        references?: string[];
        warnings?: string[];
      };
    }>
  >([]);
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    // Build the API request using the selected specialization.
    const options = {
      method: 'POST',
      url: 'https://ai-doctor-api-ai-medical-chatbot-healthcare-ai-assistant.p.rapidapi.com/chat',
      params: { noqueue: '1' },
      headers: {
        'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY', // Replace with your actual key
        'x-rapidapi-host': 'ai-doctor-api-ai-medical-chatbot-healthcare-ai-assistant.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        message: message,
        specialization: selectedSpecialization,
        language: 'en'
      }
    };

    try {
      const response = await axios.request(options);
      
      /*  
          Assuming the API returns:
          {
            status: "success",
            message: "Medical analysis completed successfully",
            result: {
              response: {
                message: "FUE, or Follicular Unit Extraction, is a popular hair transplant technique ...",
                recommendations: [ ... ],
                warnings: [ ... ],
                references: [ ... ],
                followUp: [ ... ]
              },
              metadata: { ... }
            },
            cacheTime: ...,
            metadata: { ... }
          }
      */
      const apiData = response.data;
      const botResponse = apiData.result.response;
      const newEntry = {
        user: message,
        bot: {
          message: botResponse.message,
          followUp: botResponse.followUp,
          recommendations: botResponse.recommendations,
          references: botResponse.references,
          warnings: botResponse.warnings
        }
      };
      
      setChatHistory(prev => [...prev, newEntry]);
      setMessage('');
    } catch (err : any) {
      showAlert('error', "Failed to retrieve the response. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Parse the JSON string
    const parsed = JSON.parse(jsonStr);
    // Map to your expected format:
    const entry = {
      user: "Test user", // You can provide a label for test data
      bot: {
        message: parsed.result.response.message,
        followUp: parsed.result.response.followUp,
        recommendations: parsed.result.response.recommendations,
        references: parsed.result.response.references,
        warnings: parsed.result.response.warnings
      }
    };
  
    setChatHistory(prev => [...prev, entry]);
  }, []);
  
  return (
    <div className="p-6 rounded-xl shadow-md w-full h-full scroll-hidden">
      
      <div className="overflow-y-auto rounded-xl p-3 mb-4 h-full scroll-hidden">
        {chatHistory.length === 0 && (
          <p className="text-gray-600 dark:text-gray-300">
            No messages yet. Start by asking a question!
          </p>
        )}
        {chatHistory.map((chat, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold text-teal-600 dark:text-teal-300">You: {chat.user}</p>
            <div className="ml-4">
              {/* <p className="text-gray-700 dark:text-gray-300"><strong>Doctor AI:</strong> {chat.bot.message}</p> */}
              <strong>Doctor Say:</strong>
              <p>
                {chat.bot.message}
              </p>
              {chat.bot.recommendations && chat.bot.recommendations.length > 0 && (
                <div className="mt-2">
                  <strong>Recommendations:</strong>
                  <ul className="list-disc list-inside">
                    {chat.bot.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              {chat.bot.references && chat.bot.references.length > 0 && (
                <div className="mt-2">
                  <strong>References:</strong>
                  <ul className="list-disc list-inside">
                    {chat.bot.references.map((ref, idx) => (
                      <li key={idx}>
                        <a
                          href={ref.match(/https?:\/\/\S+/)?.[0] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline dark:text-blue-300"
                        >
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {chat.bot.warnings && chat.bot.warnings.length > 0 && (
                <div className="mt-2">
                  <strong>Warnings:</strong>
                  <ul className="list-disc list-inside">
                    {chat.bot.warnings.map((warn, idx) => (
                      <li key={idx} className="text-red-500 dark:text-red-400">{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
              {chat.bot.followUp && chat.bot.followUp.length > 0 && (
                <div className="mt-2">
                  <strong>Follow-up Questions:</strong>
                  <ul className="list-disc list-inside">
                    {chat.bot.followUp.map((q, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Message Input Section */}
      <form onSubmit={handleSendMessage} className="flex gap-3 fixed bottom-12 right-12 ">
        <input
          type="text"
          placeholder="Ask a medical question..."
          value={message}
          onChange={(e : any) => setMessage(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2 bg-gray-200 dark:bg-gray-900   dark:text-white"
        />

        
      <select
          id="specializationSelect"
          value={selectedSpecialization}
          onChange={(e : any) => setSelectedSpecialization(e.target.value)}
          className="px-4 py-2  rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec.charAt(0).toUpperCase() + spec.slice(1)}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-Primary text-white px-4 py-2 rounded-xl">
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
      
    </div>
  );
}

export default MedicalChatbot;
