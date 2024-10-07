import React from "react";
import Select from "react-select";

function SelectZipCode({ zipOptions, selectedZipCode, setSelectedZipCode }) {
  return (
    <div className="relative ml-1 mr-2 card justify-center text-gray-500">
      <Select
        placeholder="ZIP Code"
        options={zipOptions}
        value={selectedZipCode}
        onChange={(zipCodeOption) => {
          setSelectedZipCode(zipCodeOption);
        }}
        className="font-medium text-gray-500"
        menuPlacement="auto"
      />
    </div>
  );
}

export default SelectZipCode;
