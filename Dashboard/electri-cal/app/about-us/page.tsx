import React from "react";
import Link from "next/link";
import ElectriCal from "../components/Header/electriCal";
import HelpMenu from "../components/Header/aboutUs";

const AboutUsPage = () => {
  return (
    
    <div className="bg-base-100 p-5">
      <header className="grid grid-cols-[15fr_2fr] font-bold font-sans text-primary bg-base-300 p-3 card shadow-sm shadow-primary-content">
        <ElectriCal />
        <HelpMenu />
      </header>
      <p className = 'p-5'>About Us Placeholder</p>
    </div>
    
  );
};

export default AboutUsPage;
