import React from "react";

const StartLocation = ({ startLat, setStartLat, startLng, setStartLng }) => {
  return (
    <div>
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
  );
};

export default StartLocation;
