import React from "react";
import Select from "react-select";

function SelectDistrict({
  districtOptions,
  selectedDistrict,
  setSelectedDistrict,
}) {
  return (
    <div className="relative ml-1 mr-2 card justify-center text-gray-500">
      <Select
        placeholder="District"
        options={districtOptions}
        value={selectedDistrict}
        onChange={(districtOption) => {
          setSelectedDistrict(districtOption);
        }}
        className="font-medium text-gray-500"
        menuPlacement="auto"
      />
    </div>
  );
}

export default SelectDistrict;
