"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const VehicleModelDropdown = () => {
  const [selectedCar, setSelectedCar] = useState("");
  const [carOptions, setCarOptions] = useState([]);

  useEffect(() => {
    fetch("/vehicleModels.json") // Update with the correct path to your JSON file
      .then((response) => response.json())
      .then((data) => {
        const models = data.available_models.map((model) =>
          model.replace(/_/g, " ")
        ); // Replace underscores with spaces for display
        setCarOptions(models);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);
  return (
    <div className="mx-1">
      <select
        className="block appearance-none w-full bg-gray-200 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring focus:border-blue-500"
        value={selectedCar}
        onChange={(e) => {
          setSelectedCar(e.target.value);
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
      {/* IMPLEMENT CARET DOWN BUTTON AT THE RIGHTMOST END OF THE DROPDOWN */}
    </div>
  );
};

export default VehicleModelDropdown;
