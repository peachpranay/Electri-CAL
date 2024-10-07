// "use client";

// import React, { useState } from "react";
// import { SiGooglegemini } from "react-icons/si";

// const GenerateReport = () => {
//   const [report, setReport] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   const API_KEY = "YOUR_PERPLEXITY_API_KEY_HERE";

//   const fetchPerplexityResponse = async () => {
//     setIsLoading(true);
//     try {
//       // Fetching the three CSV files
//       const existingStationsFile = await fetch("/dc_fast_charger_data.csv").then((res) => res.text());
//       const evDataWithZipFile = await fetch("/merged_evDatawithZip.csv").then((res) => res.text());
//       const suggestedStationsFile = await fetch("/suggested_ev_stations.csv").then((res) => res.text());

//       // Parsing CSV data into arrays
//       const existingStations = existingStationsFile.split("\n").slice(1).map((row) => row.split(","));
//       const evDataWithZip = evDataWithZipFile.split("\n").slice(1).map((row) => row.split(","));
//       const suggestedStations = suggestedStationsFile.split("\n").slice(1).map((row) => row.split(","));

//       // Constructing the prompt for the Perplexity API
//       const prompt = `
//         Analyze the existing and suggested EV charging stations in California and provide a comprehensive report.
//         Existing Stations: ${JSON.stringify(existingStations)}
//         EV Data with Zip: ${JSON.stringify(evDataWithZip)}
//         Suggested Stations: ${JSON.stringify(suggestedStations)}
//       `;

//       // Sending request to Perplexity API
//       const perplexityResponse = await fetch("https://api.perplexity.ai/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gpt-3.5-turbo",
//           messages: [
//             {
//               role: "system",
//               content: "You are an AI assistant analyzing EV charging station data.",
//             },
//             { role: "user", content: prompt },
//           ],
//           max_tokens: 1000,
//         }),
//       });

//       // Handling the response
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
//         {isLoading ? "Generating..." : "Generate Report"} <SiGooglegemini className="ml-1" />
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

import { SiGooglegemini } from "react-icons/si";
import React, { useState } from "react";
import Select from "react-select";

const GenerateReport = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedZipCode, setSelectedZipCode] = useState(null);

  const zipOptions = [];
  for (let i = 90001; i <= 99362; i++) {
    zipOptions.push({ label: i, value: i });
  }

  const demoReport = {
    title: "Suggested Charging Stations in Los Angeles, ZIP 90012",
    sections: [
      {
        heading: "Recommended Charging Stations",
        content: `
          Based on clustering analysis, additional chargers have been recommended for ZIP code 90012 to meet the growing demand:
          - Suggested Station ID 78834: Located at latitude 34.01223 and longitude -118.334323 with a recommendation for 4 chargers.
          - Suggested Station ID 81130: Located at latitude 34.049772 and longitude -118.245106 with a recommendation for 4 chargers.
        `,
      },
      {
        heading: "Existing Charging Stations",
        content: `
          In ZIP code 90012, there are several existing charging stations. Notable ones include:
          - Station ID 1525: Located at latitude 34.059133 and longitude -118.248589 with 12 chargers.
          - Station ID 1572: Located at latitude 34.066801 and longitude -118.227605 with 1 charger.
          - Station ID 63047: Located at latitude 34.055505 and longitude -118.248852 with 3 chargers.
          - Station ID 63052: Located at latitude 34.060148 and longitude -118.250747 with 6 chargers.
        `,
      },
      {
        heading: "Analysis of Recommendations",
        content: `
          **Proximity of EVs to Charging Stations**
          - EV Density: The area has a significant number of battery electric vehicles, totaling 1,446 EVs in ZIP code 90012. This high density indicates a strong demand for additional charging infrastructure.
          - Strategic Locations: The recommended locations are strategically placed to cover areas within the ZIP code that may not be adequately served by existing stations.

          **Reasons for New Charging Stations**
          - High Demand: The high number of EVs relative to the available charging points suggests potential congestion during peak hours.
          - Urban Center: As a central urban area, Los Angeles's ZIP code 90012 experiences high traffic volumes, making it essential to have sufficient charging capacity to support both residents and commuters.

          **Cost Considerations**
          The cost of installing new charging stations includes:
          - Equipment and Installation Costs: Costs associated with purchasing chargers, site preparation, and installation.
          - Operational Costs: Ongoing maintenance and potential upgrades to electrical infrastructure.
          - Funding Opportunities: Potential subsidies or incentives from government programs can help offset some costs.
        `,
      },
      {
        heading: "Conclusion",
        content:
          "The recommendation for additional charging stations in Los Angeles's ZIP code 90012 is based on a detailed analysis of EV distribution, existing infrastructure capacity, and strategic location needs. These additions will help alleviate congestion at existing stations and ensure that the growing demand for EV charging is met efficiently.",
      },
    ],
  };

  const generateDemoReport = () => {
    console.log(selectedZipCode["value"]); //! TO CHECK IF THE REPORT IS BEING GENERATED FOR THE CORRECT ZIPCODE, TO BE REMOVED LATER
    setIsLoading(true);
    setTimeout(() => {
      setReport(demoReport);
      setShowPopup(true);
      setIsLoading(false);
    });
  };

  return (
    <div className="pt-3 relative">
      <div className=" grid grid-cols-[1fr_4fr]">
        <div className="relative ml-1 mr-2 card justify-center text-gray-500">
          <Select
            placeholder="ZIP Code"
            options={zipOptions}
            value={selectedZipCode}
            onChange={(zipCodeOption) => {
              setSelectedZipCode(zipCodeOption);
            }}
            className="font-medium text-gray-500"
            menuPlacement="auto"
          />
        </div>

        <button
          className="text-primary shadow-sm shadow-primary-content border-primary-content btn w-full bg-base-300 font-bold text-xl size-10 
        hover:bg-base-300 hover:opacity-75 hover:border-primary-content"
          onClick={generateDemoReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Report "}{" "}
          <SiGooglegemini className="ml-1" />
        </button>
      </div>
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
                <p className="text-black whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_1fr]">
              <button
                className="mt-4 bg-primary text-white px-4 py-2 rounded justify-start mr-20"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
              <button
                className="mt-4 bg-accent text-white px-4 py-2 rounded ml-20"
                onClick={() => setShowPopup(false)}
              >
                Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;
