"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { coursesAndDepartments, statesAndDistricts } from "@/Data/Information";

const AddStudent = () => {
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [departments, setDepartments] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const barcodeRef = useRef(null);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setDistricts(statesAndDistricts[state] || []);
    setFormData({ ...formData, state });
  };

  const handleCourseChange = (e) => {
    const course = e.target.value;
    setSelectedCourse(course);
    setDepartments(coursesAndDepartments[course] || []);
    setFormData({ ...formData, course });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      setFormData({ ...formData, profilePicture: file });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleStatusToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      status: prevData.status === "Active" ? "Blocked" : "Active",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("FormData before submit:", formData);

    try {
      const response = await fetch("/api/student/[rollNumber]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Saved");

        await fetch("/api/student/sendCredential", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: formData.userId,
            password: formData.password,
            email: formData.email,
          }),
        });

        router.push("/office/student");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit data:", errorData.message);
        alert(errorData.message);
      }
    } catch (error) {
      console.error("An error occurred while submitting data:", error);
    }
  };

  useEffect(() => {
    if (formData.rollNumber && barcodeRef.current) {
      JsBarcode(barcodeRef.current, formData.rollNumber, {
        format: "CODE128",
        displayValue: true,
        width: 2,
        height: 30,
      });
    }
  }, [formData.rollNumber]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-16">
      <div className="flex flex-col md:flex-row gap-6 space-x-40 items-center md:items-start">
        <div className="flex flex-col w-full md:w-1/2 gap-4 mb-2">
          <div>
            <label
              htmlFor="userId"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              onChange={handleInputChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              placeholder="Enter User ID"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              minLength={8}
              onChange={handleInputChange}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center mb-4">
            <div className="rounded-full overflow-hidden border border-gray-300 w-22 h-22 aspect-square">
              <Image
                src={profilePicture || "/profile.png"}
                alt="Profile Preview"
                className="object-cover"
                width={88}
                height={88}
              />
            </div>
          </div>
          <input
            type="file"
            id="profilePictureUpload"
            onChange={handleProfilePictureChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-1"
            aria-describedby="profilePictureHelp"
          />
        </div>
      </div>

      <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            onChange={handleInputChange}
            type="text"
            id="name"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="fatherName"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Father Name
          </label>
          <input
            onChange={handleInputChange}
            type="text"
            id="fatherName"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter father's name"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="contactNumber"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Contact Number
          </label>
          <input
            onChange={handleInputChange}
            type="tel"
            id="contactNumber"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter contact number"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            onChange={handleInputChange}
            type="text"
            id="address"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter address"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="state"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            State
          </label>
          <select
            id="state"
            value={selectedState}
            onChange={handleStateChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          >
            <option value="">Select State</option>
            {Object.keys(statesAndDistricts).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="district"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            District
          </label>
          <select
            id="district"
            value={formData.district || ""}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="course"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Course
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={handleCourseChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          >
            <option value="">Select Course</option>
            {Object.keys(coursesAndDepartments).map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="department"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <select
            id="department"
            value={formData.department || ""}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="rollNumber"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Roll Number
          </label>
          <input
            onChange={handleInputChange}
            type="text"
            id="rollNumber"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter roll number"
            required
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="collegeEmail"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={handleInputChange}
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="col-span-2 ">
          <label
            htmlFor="documentUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Documents
          </label>

          <div className="flex h-16 justify-between items-center space-x-12 ">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="documentUpload"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documentUpload: e.target.files[0],
                  })
                }
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-1"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Card Status:
              </label>
              <label className="inline-flex items-center cursor-pointer space-x-1">
                <input
                  type="checkbox"
                  checked={formData.status === "Active"}
                  onChange={handleStatusToggle}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-red-700 peer-checked:bg-green-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                <span className="text-sm font-medium text-gray-900">
                  {formData.status}
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Available Balance:
              </label>
              <span className=" text-green-500 font-bold text-2xl items-center justify-center ">
                ₹ {formData.balance}
              </span>
            </div>

            <svg ref={barcodeRef} />
          </div>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
