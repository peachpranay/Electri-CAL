import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";


const AboutUsRedirect = () => {
  return (
    <button className="btn btn-ghost text-lg ml-6 hover:bg-inherit hover:opacity-75 ">
      <Link href = '/about-us'>
        About Us
      </Link>
    </button>
  );
};

export default AboutUsRedirect;
