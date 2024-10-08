import React from "react";

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

export default ErrorPopup;
