import React from "react";

const vehicleModel = (selectedCar) => {
  return selectedCar.replace(/ /g, "_");
};

const GenerateRouteReport = ({
  selectedCar,
  setSelectedCar,
  startLat,
  setStartLat,
  startLng,
  setStartLng,
  destinationLat,
  setDestinationLat,
  destinationLng,
  setDestinationLng,
}) => {
  return (
    <div>
      <button
        className="mt-4  text-primary shadow-sm shadow-primary-content border-primary-content btn w-full bg-base-300 font-bold text-sm size-10 
        hover:bg-base-300 hover:opacity-80 hover:border-primary-content"
        onClick={() => {
          console.log(
            `selectedCar : ${vehicleModel(selectedCar)}\nstart : ${[
              startLat,
              startLng,
            ]}\ndestination : ${[destinationLat, destinationLng]}`
          );
        }}
      >
        Generate Route Report
      </button>
    </div>
  );
};

export default GenerateRouteReport;
