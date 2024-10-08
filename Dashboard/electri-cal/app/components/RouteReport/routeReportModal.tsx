import React from "react";
import CloseRouteReport from "./closeRouteReport";

const RouteReportModal = ({ modalContent, setIsModalOpen }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <div className="text-black text-md">
          <h2 className="text-xl font-bold mb-4">Route Report</h2>
          <p>
            <strong className="font-semibold">Battery State:</strong>{" "}
            {modalContent.batteryState} %
          </p>
          <p>
            <strong className="font-semibold">Distance:</strong>{" "}
            {modalContent.distance} km
          </p>
          <p>
            <strong className="font-semibold">Energy Electric:</strong>{" "}
            {modalContent.energyElectric} kWh
          </p>
          <p>
            <strong className="font-semibold">Time:</strong> {modalContent.time}{" "}
            minutes
          </p>

          <CloseRouteReport setIsModalOpen={setIsModalOpen} />
        </div>
      </div>
    </div>
  );
};

export default RouteReportModal;
