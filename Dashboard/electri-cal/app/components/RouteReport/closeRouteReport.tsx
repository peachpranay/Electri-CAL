import React from "react";

const CloseRouteReport = ({ setIsModalOpen }) => {
  return (
    <div>
      <button
        onClick={() => setIsModalOpen(false)}
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default CloseRouteReport;
