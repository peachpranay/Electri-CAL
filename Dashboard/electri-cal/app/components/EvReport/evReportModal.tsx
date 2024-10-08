import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import CloseEvReport from "./closeEvReport";
import PDFDocumentFormat from "./pdfDocumentFormat";

const EvReportModal = ({
  formatReport,
  report,
  setShowPopup,
  selectedZipCode,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">
          EV Charging Stations Report for Zip code: {selectedZipCode.value}
        </h2>

        {formatReport(report).map((section, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-black">
              {section.heading}
            </h3>
            <p className="text-black whitespace-pre-wrap">{section.content}</p>
          </div>
        ))}

        <div className="grid grid-cols-[1fr_1fr]">
          <CloseEvReport setShowPopup={setShowPopup} />

          <PDFDownloadLink
            document={
              <PDFDocumentFormat report={report} formatReport={formatReport} />
            }
            fileName={`EVChargingReport-${selectedZipCode.value}.pdf`}
            className="mt-4 bg-accent text-white px-4 py-2 rounded ml-20 text-center"
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Save as PDF"
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default EvReportModal;
