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
        className={`${orbitron.className} mt-4 uppercase text-5xl text-white tracking-wide leading-tight custom-word-spacing`}
      >
        Modernizing EV <br />
        Grid Development
      </h1>
      <br></br>
      <p className="py-4 pr-40 opacity-70 leading-relaxed text-m">
        The electric vehicles revolution is changing ahead at lightening speed
        ahead, and the EV infrastructure planning is an essential pillar to
        support this cause. We aim to simplify the decision-making for the
        authorities, and relieving them of their burden. With this vision in
        mind, Electri-Cal came into existence to enhance EV charging stations by
        integrating renewable energy sources and leveraging advanced data-driven
        insights.
        <span style={{ display: "block", height: "20px" }}></span>
        This pilot project has been set on the epicentre of EVs - California.
        California is not only an entertainment hub, but a data-vault for the
        crucial information of EVs, amenities and the existing charging
        stations. Electri-Cal solves the problem of range anxiety, charging
        time, and the geographical disparities through it's innovative and
        comprehensive EV charging network solution.
        <br></br>
        <br></br>
        <span>
          Join us in our mission and help optimize EV stations of cities across
          the globe !
        </span>
      </p>
    </div>
  );
};

export default Intro;
