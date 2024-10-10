import React from "react";
import ElectriCal from "../Header/electriCal";
import HelpMenu from "../Header/aboutUs";

const Header = () => {
  return (
    <header className="grid grid-cols-[15fr_2fr] font-bold font-sans text-primary bg-base-300 p-3 card shadow-sm shadow-primary-content">
      <ElectriCal />
      <HelpMenu />
    </header>
  );
};

export default Header;
