import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            src="/card-key.png"
            alt="Logo"
            width={50}
            height={50}
            className="object-cover"
          />

          <div className="text-2xl font-bold text-gray-800">
            Students Smart Card
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
