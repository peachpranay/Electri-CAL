import React from "react";

const Destination = ({
  destinationLat,
  setDestinationLat,
  destinationLng,
  setDestinationLng,
}) => {
  return (
    <div>
      <div className="grid grid-cols-[1fr_0.1fr_2.5fr]">
        <p className="flex self-center font-semibold text-gray-300">Latitude</p>
        <p className="flex self-center h-fit font-semibold text-gray-300">:</p>
        <input
          type="text"
          className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
          value={destinationLat}
          onChange={(e) => setDestinationLat(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-[1fr_0.1fr_2.5fr]">
        <p className="flex self-center font-semibold text-gray-300">
          Longitude
        </p>
        <p className="flex self-center h-fit font-semibold text-gray-300">:</p>
        <input
          type="text"
          className="block rounded mb-2 text-black text-sm h-8 w-full font-semibold pl-2 bg-gray-200"
          value={destinationLng}
          onChange={(e) => setDestinationLng(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Destination;
