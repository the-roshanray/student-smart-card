import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-end">
          <div className="w-full text-center">
            <p>&copy; 2024 Student Smart Card. All rights reserved.</p>
            <p>
              <Link href="#" className="hover:underline">
                Privacy Policy
              </Link>
              |
              <Link href="#" className="hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
