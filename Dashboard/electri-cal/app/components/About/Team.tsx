import React from "react";
import Image from "next/image";
import Link from "next/link";

const Team = () => {
  const teamMembers = [
    {
      name: "Rahul Sharma",
      url: "https://www.linkedin.com/in/rahul-sharma-b96866280/",
    },
    { name: "Parth Ratra", url: "https://www.linkedin.com/in/parthratra11/" },
    {
      name: "Pranay Rajvanshi",
      url: "https://www.linkedin.com/in/pranay-rajvanshi/",
    },
    {
      name: "Kirti Rathi",
      url: "https://www.linkedin.com/in/kirti-rathi-92b273284/",
    },
    {
      name: "Sakshi Dhariwal",
      url: "https://www.linkedin.com/in/sakshi-dhariwal-626b11295/",
    },
  ];

  return (
    <div className="absolute right-0 w-full h-[65vh] lg:w-1/4 group mt-6">
      <div className="relative w-full h-full flex justify-center items-center">
        <Image
          src="/images/teamUpdated.png"
          alt="Team photo"
          layout="fill"
          objectFit="cover"
          className="rounded-l-2xl shadow-md shadow-base-300 border border-gray-600"
        />
      </div>
      <div
        className="absolute rounded-l-2xl inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 
      transition-opacity duration-500 ease-in-out flex justify-center items-center"
      >
        <div
          className="rounded-l-2xl overflow-hidden text-white text-center px-10 py-8 ml-4 
        group-hover:border-l-2 group-hover:border-t-2 group-hover:border-b-2 group-hover:border-gray-200 group-hover:outline-gray-200 group-hover:outline-[10px] 
        transition-all duration-500 ease-in-out"
        >
          <p className="underline underline-offset-8 text-2xl font-bold px-12 pt-16 pb-10 text-gray-200">
            OUR TEAM
          </p>
          <div className="pb-12">
            <div className="inset-0 flex flex-col items-center justify-center transition-transform duration-700 ease-in-out transform translate-x-full group-hover:translate-x-0">
              {teamMembers.map((member, index) => (
                <p className="text-xl font-semibold py-1" key={index}>
                  <Link
                    href={member.url}
                    target="_blank"
                    className="inline-block hover:scale-110 transition-transform duration-100 ease-in-out text-gray-200"
                  >
                    {member.name}
                  </Link>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
