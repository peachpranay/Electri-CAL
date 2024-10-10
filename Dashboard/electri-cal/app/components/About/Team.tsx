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
    <div className="relative w-full h-[70vh] lg:w-1/4 group">
      <div className="relative w-full h-full flex justify-center items-center">
        <Image
          src="/images/teamFinal.png"
          alt="Team photo"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex justify-center items-center">
        <div className="text-white text-center px-4 py-10 group-hover:border-2 group-hover:border-white group-hover:outline-white group-hover:outline-[10px] transition-all duration-500 ease-in-out">
          <p className="underline underline-offset-8 text-4xl font-bold p-12">
            OUR TEAM
          </p>
          {teamMembers.map((member, index) => (
            <p className="pb-2 text-2xl font-semibold" key={index}>
              <Link href={member.url} target="_blank">
                {member.name}
              </Link>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
