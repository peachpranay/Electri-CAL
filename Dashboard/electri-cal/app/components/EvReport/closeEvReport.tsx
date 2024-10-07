import React from "react";

const CloseEvReport = ({ setShowPopup }) => {
  return (
    <div>
      <button
        className="mt-4 bg-primary text-white px-4 py-2 rounded justify-start mr-20"
        onClick={() => setShowPopup(false)}
      >
        Close
      </button>
    </div>
  );
};

export default CloseEvReport;
