import React from "react";

interface GenerateRouteReportProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onGenerateReport: () => void;
}

const GenerateRouteReport: React.FC<GenerateRouteReportProps> = ({ onGenerateReport, ...props }) => {
  return (
    <div>
      <button
        className="mt-4 text-primary shadow-sm shadow-primary-content border-primary-content btn w-full bg-base-300 font-bold text-sm size-10 hover:bg-base-300 hover:opacity-80 hover:border-primary-content"
        onClick={onGenerateReport}
        {...props}
      >
        Generate Route Report
      </button>
    </div>
  );
};

export default GenerateRouteReport;