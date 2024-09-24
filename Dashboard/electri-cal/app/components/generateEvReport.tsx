// "use client";

// import React, { useState } from "react";

// const GenerateReport = () => {
//   const [report, setReport] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   const API_KEY = "YOUR_PERPLEXITY_API_KEY_HERE";

//   const fetchPerplexityResponse = async () => {
//     setIsLoading(true);
//     try {
//       const existingStationsFile = await fetch(
//         "/dc_fast_charger_data.csv"
//       ).then((res) => res.text());
//       const suggestedStationsFile = await fetch(
//         "/suggested_ev_stations.csv"
//       ).then((res) => res.text());

//       const existingStations = existingStationsFile
//         .split("\n")
//         .slice(1)
//         .map((row) => row.split(","));
//       const suggestedStations = suggestedStationsFile
//         .split("\n")
//         .slice(1)
//         .map((row) => row.split(","));

//       const prompt = `Analyze the existing and suggested EV charging stations in California and provide a comprehensive report.`;

//       const perplexityResponse = await fetch(
//         "https://api.perplexity.ai/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${API_KEY}`,
//           },
//           body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [
//               {
//                 role: "system",
//                 content:
//                   "You are an AI assistant analyzing EV charging station data.",
//               },
//               { role: "user", content: prompt },
//               {
//                 role: "user",
//                 content: `Existing stations: ${JSON.stringify(
//                   existingStations
//                 )}`,
//               },
//               {
//                 role: "user",
//                 content: `Suggested stations: ${JSON.stringify(
//                   suggestedStations
//                 )}`,
//               },
//             ],
//             max_tokens: 1000,
//           }),
//         }
//       );

//       const data = await perplexityResponse.json();
//       setReport(JSON.parse(data.choices[0].message.content));
//       setShowPopup(true);
//     } catch (error) {
//       console.error("Error:", error);
//       setReport({ error: "An error occurred while generating the report." });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="pt-3 relative">
//       <button
//         className="text-primary shadow-sm shadow-primary-content border-primary-content btn w-full bg-base-300 font-bold text-xl size-10
//         hover:bg-base-300 hover:opacity-80 hover:border-primary-content"
//         onClick={fetchPerplexityResponse}
//         disabled={isLoading}
//       >
//         {isLoading ? "Generating..." : "Generate Report"}
//       </button>
//       {showPopup && report && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
//             <h2 className="text-2xl font-bold mb-4">Generated Report</h2>
//             <div className="whitespace-pre-wrap">
//               {JSON.stringify(report, null, 2)}
//             </div>
//             <button
//               className="mt-4 bg-primary text-white px-4 py-2 rounded"
//               onClick={() => setShowPopup(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateReport;

"use client";
import { SiGooglegemini } from "react-icons/si";
import React, { useState } from "react";

const GenerateReport = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const demoReport = {
    title: "Optimizing California's Electric Vehicle Charging Infrastructure",
    sections: [
      {
        heading: "Current Infrastructure Overview",
        content:
          "California's existing EV charging network consists of 493 unique locations with DC fast charging stations. This infrastructure has been crucial in supporting the state's growing EV adoption.",
      },
      {
        heading: "Optimization Strategy",
        content:
          "The new suggested charging stations, determined through K-means clustering analysis, aim to enhance the existing network by strategically placing chargers where they are most needed. This data-driven approach offers several key benefits:",
      },
      {
        heading: "Key Improvements",
        content: [
          "Expanded Coverage: The suggested stations significantly increase the number of charging locations, potentially more than doubling the current infrastructure.",
          "Demand-Based Distribution: The new stations are allocated based on the number of vehicles nearby, ensuring that areas with higher EV concentrations receive more chargers.",
          "Rural Area Support: The plan includes smaller stations (1-10 chargers) in less populated areas, ensuring statewide coverage and enabling long-distance EV travel.",
          "High-Capacity Stations: In high-demand areas, the plan suggests large charging hubs with over 100 chargers, which can significantly reduce waiting times during peak hours.",
          "Balanced Urban-Rural Distribution: While focusing on high-demand urban areas, the plan also includes stations in smaller towns and along major highways, creating a comprehensive network.",
        ],
      },
      {
        heading: "Conclusion",
        content:
          "The suggested optimization of California's EV charging infrastructure represents a significant step forward in supporting the state's transition to electric vehicles. By strategically placing new charging stations based on demand and geographic distribution, this plan addresses current gaps in the network and prepares for future growth in EV adoption.",
      },
    ],
  };

  const generateDemoReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setReport(demoReport);
      setShowPopup(true);
      setIsLoading(false);
    }, 20000); // 20 seconds delay
  };

  return (
    <div className="pt-3 relative">
      <button
        className="text-primary shadow-sm shadow-primary-content border-primary-content btn w-full bg-base-300 font-bold text-xl size-10 
        hover:bg-base-300 hover:opacity-80 hover:border-primary-content"
        onClick={generateDemoReport}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Report "}{" "}
        <SiGooglegemini className="ml-1" />
      </button>
      {showPopup && report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4 text-black">
              {report.title}
            </h2>
            {report.sections.map((section, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-black">
                  {section.heading}
                </h3>
                {Array.isArray(section.content) ? (
                  <ul className="list-disc pl-5 text-black">
                    {section.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-black">{section.content}</p>
                )}
              </div>
            ))}
            <button
              className="mt-4 bg-primary text-white px-4 py-2 rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;
