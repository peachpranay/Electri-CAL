"use client";

import React, { useState } from "react";

const LocationInput = () => {
  const [startLocation, setStartLocation] = useState(["", ""]);
  const [destination, setDestination] = useState(["", ""]);

  const [startLat, setStartLat] = useState("");
  const [startLng, setStartLng] = useState("");
  const [destinationLat, setDestinationLat] = useState("");
  const [destinationLng, setDestinationLng] = useState("");

  return (
    <div>
      <div>
        <p>Starting Location</p>
        <div className="grid grid-cols-[1fr_2.5fr]">
          <p>Latitude</p>
          <input
            type="text"
            className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
            value={startLat}
          />
        </div>
        <div className="grid grid-cols-[1fr_2.5fr]">
          <p>Longitude</p>
          <input
            type="text"
            className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
          />
        </div>
      </div>
      <div>
        <p>Destination</p>
        <div className="grid grid-cols-[1fr_2.5fr]">
          <p>Latitude</p>
          <input
            type="text"
            className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
          />
        </div>
        <div className="grid grid-cols-[1fr_2.5fr]">
          <p>Longitude</p>
          <input
            type="text"
            className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
