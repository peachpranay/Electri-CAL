import React from "react";
import EvMapInfo from "./evMapInfo";

const EvMap = () => {
  return (
    <div className="card border border-gray-400 flex h-full justify-center items-center overflow-clip hover:cursor-pointer">
      <iframe
        src="/Maps/latestEVPlot.html"
        title="location Map"
        style={{ height: "100%", width: "100%" }}
      />
      <EvMapInfo />
    </div>
  );
};

export default EvMap;

// import React, { useState, useEffect } from "react";
// import EvMapInfo from "./EvMapInfo";

// const EvMap = () => {
//   const [stationData, setStationData] = useState(null); // State to store station data

//   useEffect(() => {
//     // Listener for messages from the iframe
//     const handleMessage = (event) => {
//       if (event.data && event.origin === window.location.origin) {
//         setStationData(event.data); // Update state with data from iframe
//       }
//     };

//     window.addEventListener("message", handleMessage);

//     // Clean up event listener on component unmount
//     return () => {
//       window.removeEventListener("message", handleMessage);
//     };
//   }, []);

//   return (
//     <div className="card border border-gray-400 flex h-full justify-center items-center overflow-clip hover:cursor-pointer">
//       <iframe
//         src="/Maps/latestEVPlot.html"
//         title="location Map"
//         style={{ height: "100%", width: "100%" }}
//       />
//       {/* Pass the station data to the EvMapInfo component */}
//       <EvMapInfo stationData={stationData} />
//     </div>
//   );
// };

// export default EvMap;
