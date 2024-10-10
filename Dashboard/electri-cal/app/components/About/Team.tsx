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
    <div className="relative w-full h-[65vh] lg:w-1/4 group mt-6">
      <div className="relative w-full h-full flex justify-center items-center">
        <Image
          src="/images/teamUpdated.png"
          alt="Team photo"
          layout="fill"
          objectFit="cover"
          className="card shadow-md shadow-base-300 border border-gray-600"
        />
      </div>
      <div className="absolute card inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex justify-center items-center">
        <div className="card text-gray-200 text-center px-4 mx-1 py-10 group-hover:border-2 group-hover:border-gray-200 group-hover:outline-gray-200 group-hover:outline-[10px] transition-all duration-500 ease-in-out">
          <p className="underline underline-offset-8 text-3xl font-bold px-12 pt-16 pb-10 text-gray-200">
            OUR TEAM
          </p>
          <div className="pb-12">
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
  );
};

export default Team;
