"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

function VehicleModelDropdown({ selectedCar, setSelectedCar }) {
  const [carOptions, setCarOptions] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    fetch("/Files/vehicleModels.json")
      .then((response) => response.json())
      .then((data) => {
        const models = data.available_models.map((model) =>
          model.replace(/_/g, " ")
        );
        setCarOptions(models);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  return (
    <div className="relative mx-1">
      <select
        className="block appearance-none w-full bg-gray-200 border border-gray-300 text-gray-700 
        py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring focus:border-blue-500 font-medium"
        value={selectedCar}
        onChange={(e) => {
          setSelectedCar(e.target.value);
        }}
        onClick={() => {
          setOpenDropdown(!openDropdown);
        }}
      >
        <option value="" disabled>
          Choose your vehicle
        </option>
        {carOptions.map((car, index) => (
          <option key={index} value={car} className="text-sm">
            {car}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
        {openDropdown ? (
          <FontAwesomeIcon icon={faCaretUp} />
        ) : (
          <FontAwesomeIcon icon={faCaretDown} />
        )}
      </div>
    </div>
  );
}

export default VehicleModelDropdown;
