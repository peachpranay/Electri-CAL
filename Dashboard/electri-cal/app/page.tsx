"use client";

import React, { useState } from "react";
import EvMap from "./components/evMap";
import GenerateReport from "./components/generateEvReport";
import ElectriCal from "./components/Header/electriCal";
import HelpMenu from "./components/Header/aboutUs";
import GenerateRouteReport from "./components/RouteReport/generateRouteReport";
import LocationInput from "./components/RouteReport/locationInput";
import VehicleModelDropdown from "./components/RouteReport/vehicleModelDropdown";

function Home() {
  const [selectedCar, setSelectedCar] = useState("");

  const [startLat, setStartLat] = useState("");
  const [startLng, setStartLng] = useState("");
  const [destinationLat, setDestinationLat] = useState("");
  const [destinationLng, setDestinationLng] = useState("");
  return (
    <>
      <div className="bg-base-100 p-5">
        <header className="grid grid-cols-[15fr_2fr] font-bold font-sans text-primary bg-base-300 p-3 card shadow-sm shadow-primary-content">
          <ElectriCal />
          <HelpMenu />
        </header>

        {/* MAIN DIV */}
        <div className="grid grid-cols-[5fr_2fr] gap-6 mt-6 p-2">
          {/* COLUMN 1 */}
          <div className="grid grid-rows-[90fr_11fr]">
            {/* MAP */}
            <EvMap />

            {/* GENERATE REPORT */}
            <GenerateReport />
          </div>

          {/* COLUMN 2 */}
          <div className="border border-primary-content card py-2 px-3 flex justify-center bg-base-300 shadow-sm shadow-primary-content">
            <div className="flex justify-center text-2xl mb-4 mt-2 text-primary">
              <p className="font-bold">Route Report</p>
            </div>
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
            <GenerateRouteReport
              selectedCar={selectedCar}
              setSelectedCar={setSelectedCar}
              startLat={startLat}
              setStartLat={setStartLat}
              startLng={startLng}
              setStartLng={setStartLng}
              destinationLat={destinationLat}
              setDestinationLat={setDestinationLat}
              destinationLng={destinationLng}
              setDestinationLng={setDestinationLng}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
