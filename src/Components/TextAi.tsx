'use client'
import { useState } from "react";
import axios from "axios";

const SymptomForm = () => {
  const [organ, setOrgan] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setData(null);

    const options = {
      method: "GET",
      url: `https://healthwise.p.rapidapi.com/body/symptoms/${organ}`,
      headers: {
        "x-rapidapi-key": "290a72aeefmshd0f839ca6d53b12p1ef1ebjsn65559db3c935",
        "x-rapidapi-host": "healthwise.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setData(response.data);
    } catch (err : any) {
      setError("Failed to fetch data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Find Symptoms by Organ</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter organ name"
          value={organ}
          onChange={(e : any) => setOrgan(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
      </form>
      {data && (
        <div className="bg-white shadow-md rounded-lg p-4 mt-4 w-full max-w-md">
          <pre className="text-gray-700">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}      
      </div>
  );
};

export default SymptomForm;
