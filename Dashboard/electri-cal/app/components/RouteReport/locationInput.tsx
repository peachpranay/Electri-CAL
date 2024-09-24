"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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

        <div className="grid grid-cols-[1fr_0.1fr_2.5fr]">
          <p className="flex self-center h-fit font-semibold">Latitude</p>
          <p className="flex self-center h-fit font-semibold">:</p>
          <input
            type="text"
            className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
            value={startLat}
            onChange={(e) => setStartLat(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-[1fr_0.1fr_2.5fr]">
          <p className="flex self-center font-semibold">Longitude</p>
          <p className="flex self-center h-fit font-semibold">:</p>
          <input
            type="text"
            className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
            value={startLng}
            onChange={(e) => setStartLng(e.target.value)}
          />
        </div>
      </div>

      <div className="card border border-dotted p-2 mt-2">
        <div className="flex flex-row mb-4">
          <p className="font-bold">Destination</p>
          <FontAwesomeIcon
            icon={faArrowRight}
            className="flex self-center ml-2"
          />
        </div>

        <div className="grid grid-cols-[1fr_0.1fr_2.5fr]">
          <p className="flex self-center font-semibold">Latitude</p>
          <p className="flex self-center h-fit font-semibold">:</p>
          <input
            type="text"
            className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
            value={destinationLat}
            onChange={(e) => setDestinationLat(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-[1fr_0.1fr_2.5fr]">
          <p className="flex self-center font-semibold">Longitude</p>
          <p className="flex self-center h-fit font-semibold">:</p>
          <input
            type="text"
            className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
            value={destinationLng}
            onChange={(e) => setDestinationLng(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default LocationInput;
