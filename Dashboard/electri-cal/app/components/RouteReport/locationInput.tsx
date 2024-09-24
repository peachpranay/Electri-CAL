"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import StartLocation from "./startLocation";
import Destination from "./destination";

function LocationInput({
  startLat,
  setStartLat,
  startLng,
  setStartLng,
  destinationLat,
  setDestinationLat,
  destinationLng,
  setDestinationLng,
}) {
  return (
    <div>
      <div className="card border border-dotted p-2 mt-4">
        <div className="flex flex-row mb-4">
          <p className="font-bold">Starting Location</p>
          <FontAwesomeIcon
            icon={faArrowRight}
            className="flex self-center ml-2"
          />
        </div>

        <StartLocation
          startLat={startLat}
          setStartLat={setStartLat}
          startLng={startLng}
          setStartLng={setStartLng}
        />
      </div>

      <div className="card border border-dotted p-2 mt-2">
        <div className="flex flex-row mb-4">
          <p className="font-bold">Destination</p>
          <FontAwesomeIcon
            icon={faArrowRight}
            className="flex self-center ml-2"
          />
        </div>

        <Destination
          destinationLat={destinationLat}
          setDestinationLat={setDestinationLat}
          destinationLng={destinationLng}
          setDestinationLng={setDestinationLng}
        />
      </div>
    </div>
  );
}

export default LocationInput;
