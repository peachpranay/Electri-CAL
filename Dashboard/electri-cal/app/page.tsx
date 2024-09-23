import EvMap from "./components/evMap";
import GenerateReport from "./components/generateEvReport";
import ElectriCal from "./components/Header/electriCal";
import HelpMenu from "./components/Header/helpMenu";
import GenerateRouteReport from "./components/RouteReport/generateRouteReport";
import LocationInput from "./components/RouteReport/locationInput";
import VehicleModelDropdown from "./components/RouteReport/vehicleModelDropdown";

function Home() {
  return (
    <>
      <div className="bg-base-100 p-5">
        <header className="grid grid-cols-[15fr_1fr] text-4xl font-bold font-sans text-primary bg-base-300 p-3 card shadow-sm shadow-primary-content">
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
          <div className="border border-white card p-2">
            <h1>Route Report</h1>
            <VehicleModelDropdown />
            <LocationInput />
            <GenerateRouteReport />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
