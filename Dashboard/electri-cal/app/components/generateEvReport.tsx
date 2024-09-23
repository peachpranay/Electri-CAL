"use client";

import React, { useState } from "react";

const GenerateReport = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const API_KEY = "YOUR_PERPLEXITY_API_KEY_HERE";

  const fetchPerplexityResponse = async () => {
    setIsLoading(true);
    try {
      const existingStationsFile = await fetch(
        "/dc_fast_charger_data.csv"
      ).then((res) => res.text());
      const suggestedStationsFile = await fetch(
        "/suggested_ev_stations.csv"
      ).then((res) => res.text());

      const existingStations = existingStationsFile
        .split("\n")
        .slice(1)
        .map((row) => row.split(","));
      const suggestedStations = suggestedStationsFile
        .split("\n")
        .slice(1)
        .map((row) => row.split(","));

      const prompt = `Analyze the existing and suggested EV charging stations in California and provide a comprehensive report.`;

      const perplexityResponse = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI assistant analyzing EV charging station data.",
              },
              { role: "user", content: prompt },
              {
                role: "user",
                content: `Existing stations: ${JSON.stringify(
                  existingStations
                )}`,
              },
              {
                role: "user",
                content: `Suggested stations: ${JSON.stringify(
                  suggestedStations
                )}`,
              },
            ],
            max_tokens: 1000,
          }),
        }
      );

      const data = await perplexityResponse.json();
      setReport(JSON.parse(data.choices[0].message.content));
      setShowPopup(true);
    } catch (error) {
      console.error("Error:", error);
      setReport({ error: "An error occurred while generating the report." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-3 relative">
      <button
        className="text-primary shadow-sm shadow-primary-content border-primary-content btn w-full bg-base-300 font-bold text-xl size-10 
        hover:bg-base-300 hover:opacity-80 hover:border-primary-content"
        onClick={fetchPerplexityResponse}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Report"}
      </button>
      {showPopup && report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Generated Report</h2>
            <div className="whitespace-pre-wrap">
              {JSON.stringify(report, null, 2)}
            </div>
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
