import Link from "next/link";
import React from "react";
import { FaUserPlus, FaUserTie, FaFileAlt } from "react-icons/fa";

const StudentPage = () => {
  return (
    <div className="mt-16">
      <section
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Heritage Institute of Technology
          </h1>
          <p className="text-lg mb-6">
            Empowering students for a better tomorrow
          </p>
        </div>
      </section>

      <div className="flex flex-col items-center bg-gray-50 p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <FaUserPlus className="text-blue-500 text-3xl mr-3" />
              <h2 className="text-2xl font-bold">Manage Students</h2>
            </div>
            <p className="text-gray-600 mb-4">
              You Enroll new students with comprehensive personal and academic
              details seamlessly.
            </p>
            <Link href={"/office/student"}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                Go to Manage Student
              </button>
            </Link>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <FaUserTie className="text-green-500 text-3xl mr-3" />
              <h2 className="text-2xl font-bold">Manage Employee</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Manage and onboard new employees for college departments.
            </p>
            <Link href={"/office/employee"}>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300">
                Go to Manage Employee
              </button>
            </Link>
          </div>

          <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <FaFileAlt className="text-purple-500 text-3xl mr-3" />
              <h2 className="text-2xl font-bold">College Documents</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Access and manage important college-related documents.
            </p>
            <Link href={"/office/college-documents"}>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300">
                View Documents
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
