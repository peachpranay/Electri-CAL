"use client";

import React from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  weight: "600",
  subsets: ["latin"],
});

const TextCarousel = () => {
  return (
    <div className="overflow-hidden bg-gray-100 shadow-md">
      <div className={`${orbitron.className} whitespace-nowrap animate-scroll`}>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
        <span className="inline-block px-12 py-4 text-2xl text-gray-800">
          ⚡Electri-CAL⚡
        </span>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TextCarousel;
