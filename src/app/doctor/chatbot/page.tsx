'use client'
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../doctorComponents/DocDashboardLayout'
import axios from 'axios';
import { useAlert } from '../../../Components/Alert';
import {motion} from 'framer-motion'
import Loading from '../../../Components/loading';
export default function page() {
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
      
          const  jsonStr = `[
                  {
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
          },
          {
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
          },
                  {
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
          },
          {
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
          },
                  {
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
          },
          {
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
          }
          ]`
    
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
      const [isFocused, setIsFocused] = useState(false);

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
            'x-rapidapi-key': '290a72aeefmshd0f839ca6d53b12p1ef1ebjsn65559db3c935', // Replace with your actual key
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
        const parsed = JSON.parse(jsonStr);
        const entries = parsed.map((item: any) => ({
          user: "what is Fue", 
          bot: {
            message: item.result.response.message,
            followUp: item.result.response.followUp,
            recommendations: item.result.response.recommendations,
            references: item.result.response.references,
            warnings: item.result.response.warnings
          }
        }));
        setChatHistory(prev => [...prev, ...entries]);
      }, []);
      
  
      
  return (
   <DashboardLayout title="Medical Chatbot">
    <div className="md:p-6 max-md:p-0 rounded-xl w-full h-[93%] overflow-hidden scroll-hidden">
      
      <div className="overflow-y-auto rounded-xl mb-4 h-full  overflow-hidden scroll-hidden">
        {chatHistory.length === 0 && (
          <div className='h-[60vh] w-full center'>
            <p className="text-gray-600 dark:text-gray-300">
              Start Your Madical Chat
            </p>
          </div>
        )}
        {chatHistory.map((chat, index) => (
          <div key={index} className="mb-4">
            <div className='flex my-5 items-center gap-4'>
                <img src="/images/Doc 4.jpg" className='rounded-full w-6 h-6' alt="" />
                <p className="font-semibold text-teal-600 dark:text-teal-300 px-6 py-2 text-[14px] rounded-full dark:bg-gray-800 bg-gray-100 w-fit">{chat.user}</p>
            </div>
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
   
      {/* Sticky Input Bar with Animated Input */}
      <div className="sticky max-md:hidden bottom-0 flex justify-center w-full px-4">
          <motion.form
            animate={{ width: isFocused ? "90%" : "50%" }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSendMessage}
            className="flex gap-3 items-center bg-gray-100 dark:bg-gray-900 p-2 rounded-full border border-Primary 
                       w-full "
          >
            {/* Animated Motion Input */}
            <input
              type="text"
              placeholder="Ask a medical question..."
              value={message}
              onChange={(e : any) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 rounded-xl px-4 py-2 bg-transparent dark:text-white focus:outline-none relative"
            />

            <select
              id="specializationSelect"
              value={selectedSpecialization}
              onChange={(e : any) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </option>
              ))}
            </select>
          
            <div className="w-16 mr-1 flex items-center justify-center">
              {!loading ? (
                <button type="submit" className="bg-Primary text-white px-4 py-2 rounded-full">
                  Send
                </button>
              ) : (
                <Loading size={35} />
              )}
            </div>
          </motion.form>
      </div>
      
      <div className="sticky md:hidden bottom-10 flex items-center justify-center w-full px-4">

          <motion.form
            animate={{ width: isFocused ? "100%" : "85%" }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSendMessage}
            className="flex gap-3 items-center flex-col  bg-gray-100 shadow-md shadow-Primary/50 dark:bg-gray-900  rounded-3xl p-3  border border-Primary 
                       w-full "
          >
            {/* Animated Motion Input */}
            <input
              type="text"
              placeholder="Ask a medical question..."
              value={message}
              onChange={(e : any) => setMessage(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 rounded-xl px-4 py-2 bg-transparent dark:text-white focus:outline-none relative"
            />
            <div className='flex gap-2 center'>   
                <select
                  id="specializationSelect"
                  value={selectedSpecialization}
                  onChange={(e : any) => setSelectedSpecialization(e.target.value)}
                  className=" px-2 py-2 rounded-full basis-1/3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec.charAt(0).toUpperCase() + spec.slice(1)}
                    </option>
                  ))}
                </select>
              
                <div className="w-16 mr-1 flex items-center justify-center">
                  {!loading ? (
                    <button type="submit" className="bg-Primary text-white px-4 py-2 rounded-full">
                      Send
                    </button>
                  ) : (
                    <Loading size={35} />
                  )}
                </div>   
            </div>
          </motion.form>
      </div>

    </div>
   </DashboardLayout>

  )
}
