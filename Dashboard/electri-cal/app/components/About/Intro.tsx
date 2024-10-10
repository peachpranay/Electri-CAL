import React from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  weight: "600",
  subsets: ["latin"],
});

const Intro = () => {
  return (
    <div className="w-full lg:w-3/4 mb-10 lg:mb-0">
      <h1
        className={`${orbitron.className} uppercase text-6xl text-gray-200 tracking-wide leading-snug custom-word-spacing`}
      >
        Navigating Routes To Sustainable Mobility
      </h1>
      <p className="py-4 pr-40 opacity-70 leading-relaxed text-lg">
        Our vision is to create a cost-effective, sustainable network of EV
        charging stations throughout California&apos;s urban areas. By
        leveraging renewable energy sources and advanced data-driven insights,
        we will strategically deploy charging infrastructure to promote
        widespread electric vehicle adoption.
      </p>
    </div>
  );
};

export default Intro;
