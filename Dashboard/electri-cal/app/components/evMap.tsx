import React from "react";

const EvMap = () => {
  return (
    <div className="card border border-gray-400 flex h-full justify-center items-center overflow-clip hover:cursor-pointer">
      <iframe
        src="/Maps/latestEVPlot.html"
        title="location Map"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default EvMap;
