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
      <div className="absolute top-2 right-3 p-1">
        <FontAwesomeIcon icon={faCircleInfo} color="black" />
      </div>
      {/* CLICKING IT SHOULD OPEN A MODAL GIVING INFO REGARDING WHAT COLOUR PLOTS TO WHOM */}
    </div>
  );
};

export default EvMap;
