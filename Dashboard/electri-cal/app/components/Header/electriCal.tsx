import React from "react";
import Link from "next/link";

const ElectriCal = () => {
  return (
    
    <div>
      <Link href = '/'>
        <h1 className="ml-1 btn btn-ghost text-4xl font-bold font-sans hover:bg-inherit hover:opacity-75">
          Electri-Cal
        </h1>
      </Link>
    </div>
    
  );
};

export default ElectriCal;
