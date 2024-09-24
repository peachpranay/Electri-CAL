"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface VehicleModelDropdownProps {
  selectedCar: string;
  setSelectedCar: React.Dispatch<React.SetStateAction<string>>;
}

const VehicleModelDropdown: React.FC<VehicleModelDropdownProps> = ({ selectedCar, setSelectedCar }) => {
  const [carOptions, setCarOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarModels = useCallback(async () => {
    try {
      const response = await fetch("/vehicleModels.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const models = data.available_models.map((model: string) =>
        model.replace(/_/g, " ")
      );
      setCarOptions(models);
    } catch (e) {
      setError("Failed to load vehicle models. Please try again later.");
      console.error("Error loading JSON:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarModels();
  }, [fetchCarModels]);

  if (isLoading) return <div>Loading vehicle models...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative mx-1">
      <select
        className="block appearance-none w-full bg-gray-200 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring focus:border-blue-500"
        value={selectedCar}
        onChange={(e) => setSelectedCar(e.target.value)}
        aria-label="Select vehicle model"
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
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <FontAwesomeIcon icon={faCaretDown} />
      </div>
    </div>
  );
};

export default VehicleModelDropdown;