import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faCircleDot } from "@fortawesome/free-solid-svg-icons";

const EvMapInfo = () => {
  const [graphModal, setGraphModal] = useState(false);
  return (
    <div>
      <div className="absolute top-2 right-3 p-1">
        <FontAwesomeIcon
          icon={faCircleInfo}
          color="black"
          onClick={() => {
            setGraphModal(!graphModal);
          }}
        />
      </div>

      {graphModal && (
        <div className="absolute top-10 right-3 p-2 bg-white border border-gray-400 rounded shadow-md w-auto">
          <p className="text-black text-xs font-medium">
            <FontAwesomeIcon icon={faCircleDot} color="blue" /> - Amenitites
          </p>
          <p className="text-black text-xs font-medium">
            <FontAwesomeIcon icon={faCircleDot} color="green" /> - Existing EV
            Stations
          </p>
          <p className="text-black text-xs font-medium">
            <FontAwesomeIcon icon={faCircleDot} color="red" /> - Suggested EV
            Stations
          </p>
        </div>
      )}
    </div>
  );
};

export default EvMapInfo;