"use client";

import { SiGooglegemini } from "react-icons/si";
import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';


const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  heading: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  subheading: { fontSize: 14, marginBottom: 5, fontWeight: 'bold' },
  content: { fontSize: 12, marginBottom: 10 },
});


const formatReport = (reportText) => {
  const sections = reportText.split('\n\n');
  return sections.map((section, index) => {
    const [heading, ...content] = section.split('\n');
    return { heading, content: content.join('\n') };
  });
};


const PDFDocument = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>EV Charging Report </Text>
        {formatReport(report).map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subheading}>{section.heading}</Text>
            <Text style={styles.content}>{section.content}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const GenerateReport = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedZipCode, setSelectedZipCode] = useState(null);
  const [error, setError] = useState(null);

  const zipOptions = [];
  for (let i = 90001; i <= 99362; i++) {
    zipOptions.push({ label: i, value: i });
  }

  const generateReport = async () => {
    if (!selectedZipCode) {
      setError("Please select a ZIP code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:8000/generate_report/${selectedZipCode.value}`);

      setReport(response.data.report);
      setShowPopup(true);
    } catch (error) {
      setError(`Error generating report: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorPopup = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4 text-red-500">Error</h2>
        <p className="text-black mb-4">{message}</p>
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-3 relative">
      <div className="grid grid-cols-[1fr_4fr]">
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
          onClick={generateReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Report "}{" "}
          <SiGooglegemini className="ml-1" />
        </button>
      </div>

      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}

      {showPopup && report && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4 text-black">EV Charging Stations Report for Zip code: {selectedZipCode.value}</h2>
            {formatReport(report).map((section, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-black">
                  {section.heading}
                </h3>
                <p className="text-black whitespace-pre-wrap">{section.content}</p>
              </div>
            ))}
            <div className="grid grid-cols-[1fr_1fr]">
              <button
                className="mt-4 bg-primary text-white px-4 py-2 rounded justify-start mr-20"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
              <PDFDownloadLink
                document={<PDFDocument report={report} />}
                fileName={`EVChargingReport-${selectedZipCode.value}.pdf`}

                className="mt-4 bg-accent text-white px-4 py-2 rounded ml-20 text-center"
              >
                {({ blob, url, loading, error }) =>
                  loading ? 'Loading document...' : 'Save as PDF'
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;