"use client";

import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface LocationInputProps {
  startLat: string;
  setStartLat: React.Dispatch<React.SetStateAction<string>>;
  startLng: string;
  setStartLng: React.Dispatch<React.SetStateAction<string>>;
  destinationLat: string;
  setDestinationLat: React.Dispatch<React.SetStateAction<string>>;
  destinationLng: string;
  setDestinationLng: React.Dispatch<React.SetStateAction<string>>;
}

const LocationInput: React.FC<LocationInputProps> = ({
  startLat,
  setStartLat,
  startLng,
  setStartLng,
  destinationLat,
  setDestinationLat,
  destinationLng,
  setDestinationLng
}) => {
  useEffect(() => {
    console.log("LocationInput props:", {
      startLat,
      startLng,
      destinationLat,
      destinationLng
    });
  }, [startLat, startLng, destinationLat, destinationLng]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const renderInput = (label: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => (
    <div className="grid grid-cols-[1fr_0.1fr_2.5fr]">
      <p className="flex self-center font-semibold">{label}</p>
      <p className="flex self-center h-fit font-semibold">:</p>
      <input
        type="text"
        className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
        value={value}
        onChange={handleInputChange(setter)}

        aria-label={label}
      />
    </div>
  );

  return (
    <div>
      <div className="card border border-dotted p-2 mt-4">
        <div className="flex flex-row mb-4">
          <p className="font-bold">Starting Location</p>
          <FontAwesomeIcon icon={faArrowRight} className="flex self-center ml-2" />
        </div>
        {renderInput("Latitude", startLat, setStartLat)}
        {renderInput("Longitude", startLng, setStartLng)}
      </div>

      <div className="card border border-dotted p-2 mt-2">
        <div className="flex flex-row mb-4">
          <p className="font-bold">Destination</p>
          <FontAwesomeIcon icon={faArrowRight} className="flex self-center ml-2" />
        </div>
        {renderInput("Latitude", destinationLat, setDestinationLat)}
        {renderInput("Longitude", destinationLng, setDestinationLng)}
      </div>
    </div>
  );
};

export default LocationInput;