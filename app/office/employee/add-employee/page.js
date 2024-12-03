"use client";
import { useState } from "react";
import Image from "next/image";
import { statesAndDistricts } from "@/Data/Information";
import { useRouter } from "next/navigation";

const AddEmployee = () => {
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setDistricts(statesAndDistricts[state] || []);
    setFormData({ ...formData, state });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Saved");
        router.push("/office/employee");
      } else {
        const errorData = await response.json();
        console.error("Failed to submit data:", errorData.message);
      }
    } catch (error) {
      console.error("An error occurred while submitting data:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-16">
      <div className="flex flex-col md:flex-row gap-6 space-x-40 items-center md:items-start">
        <div className="flex flex-col w-full md:w-1/2 gap-4 mb-2">
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
                priority
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
            type="text"
            id="name"
            onChange={handleInputChange}
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
            type="text"
            id="fatherName"
            onChange={handleInputChange}
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
            type="tel"
            id="contactNumber"
            onChange={handleInputChange}
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter contact number"
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="contactNumber"
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

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            onChange={handleInputChange}
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
            required
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
            required
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
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            onChange={handleInputChange}
            defaultValue=""
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Library">Library</option>
            <option value="Stationary">Stationary</option>
            <option value="Canteen">Canteen</option>
          </select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="qualification"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Qualification
          </label>
          <input
            type="text"
            id="qualification"
            onChange={handleInputChange}
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter Qualification"
            required
          />
        </div>

        <div className="col-span-2">
          <label
            htmlFor="documentUpload"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Upload Documents
          </label>
          <input
            type="file"
            id="documentUpload"
            onChange={(e) =>
              setFormData({ ...formData, documentUpload: e.target.files[0] })
            }
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-1"
            aria-describedby="profilePictureHelp"
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2.5 rounded-lg mt-4 hover:bg-indigo-700"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
