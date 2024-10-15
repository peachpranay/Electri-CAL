"use client";

import { SiGooglegemini } from "react-icons/si";
import React, { useState, useEffect } from "react";

import axios from "axios";
import SelectDistrict from "./selectDistrict";
import EvReportModal from "./evReportModal";
import ErrorPopup from "./errorPopup";

const formatReport = (reportText) => {
  const sections = reportText.split("\n\n");
  return sections.map((section, index) => {
    const [heading, ...content] = section.split("\n");
    return { heading, content: content.join("\n") };
  });
};

const GenerateReport = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [error, setError] = useState(null);
  const [districtOptions, setDistrictOptions] = useState([]);

  useEffect(() => {
    fetch("/Files/districts.json")
      .then((response) => response.json())
      .then((data) => {
        const districtOptions = data.map((district) => ({
          label: district,
          value: district,
        }));
        setDistrictOptions(districtOptions);
      })
      .catch((err) => {
        setError("Failed to load districts.");
      });
  }, []);
  const generateReport = async () => {
    if (!selectedDistrict) {
      setError("Please select a District");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/generate_report/${selectedDistrict["value"]}`
      );

      setReport(response.data.report);
      setShowPopup(true);
    } catch (error) {
      setError(
        `Error generating report: ${
          error.response?.data?.detail || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-3 relative">
      <div className="grid grid-cols-[1fr_4fr]">
        <SelectDistrict
          districtOptions={districtOptions}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
        />

        <button
          className="text-primary shadow-sm shadow-primary-content border-primary-content btn w-full bg-base-300 font-bold text-xl size-10 
        hover:bg-base-300 hover:opacity-75 hover:border-primary-content"
          onClick={generateReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Report "}{" "}
          <SiGooglegemini className="ml-1" />
        </button>
      </div>

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}

      {showPopup && report && (
        <EvReportModal
          formatReport={formatReport}
          report={report}
          setShowPopup={setShowPopup}
          selectedDistrict={selectedDistrict}
        />
      )}
    </div>
  );
};

export default GenerateReport;
