import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center absolute p-2 bottom-0 bg-gray-900 w-full bg-opacity-45">
      <section className="text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Electri-Cal. All rights reserved.
        </p>
      </section>
    </footer>
  );
};

export default Footer;
