import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const EvMap = () => {
  return (
    <div className="card border border-gray-400 flex h-full justify-center items-center overflow-clip hover:cursor-pointer">
      <iframe
        src="/Maps/latestEVPlot.html"
        title="location Map"
        style={{ height: "100%", width: "100%" }}
      />
      <div className="absolute top-3 right-3 p-2">
        <FontAwesomeIcon icon={faCircleInfo} color="black" />
      </div>
    </div>
  );
};

export default EvMap;
