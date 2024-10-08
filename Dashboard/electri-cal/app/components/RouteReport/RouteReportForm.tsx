"use client";

import React, { useState } from "react";
import VehicleModelDropdown from "./VehicleModelDropdown";
import LocationInput from "./LocationInput";
import GenerateRouteReport from "./routeReport";

const RouteReportForm = () => {
  const [selectedCar, setSelectedCar] = useState("");
  const [startLat, setStartLat] = useState("");
  const [startLng, setStartLng] = useState("");
  const [destinationLat, setDestinationLat] = useState("");
  const [destinationLng, setDestinationLng] = useState("");

  const handleGenerateReport = () => {
    console.log({
      selectedCar,
      startLat,
      startLng,
      destinationLat,
      destinationLng,
    });
  };

  return (
    <div>
      <VehicleModelDropdown
        selectedCar={selectedCar}
        setSelectedCar={setSelectedCar}
      />
      <LocationInput
        startLat={startLat}
        setStartLat={setStartLat}
        startLng={startLng}
        setStartLng={setStartLng}
        destinationLat={destinationLat}
        setDestinationLat={setDestinationLat}
        destinationLng={destinationLng}
        setDestinationLng={setDestinationLng}
      />
      <GenerateRouteReport onGenerateReport={handleGenerateReport} />
    </div>
  );
};

export default RouteReportForm;
