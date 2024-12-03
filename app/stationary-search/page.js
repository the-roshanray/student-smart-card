"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    setRollNumber(e.target.value);
  };

  const handleRouting = (rollNumber) => {
    router.push(`/stationary/${rollNumber}`);
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      if (rollNumber.trim() !== "") {
        setLoading(true);
        setError("");

        try {
          const response = await fetch(`/api/student/${encodeURIComponent(rollNumber)}`);
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(
              errorResponse.message || "No student found for this roll number."
            );
          }
          const data = await response.json();
          setStudentData(data);
        } catch (err) {
          setError(err.message);
          setStudentData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setStudentData(null);
      }
    };

    fetchStudentData();
  }, [rollNumber]);

  return (
    <div className="flex flex-col items-center space-y-6 p-4 mt-20 min-h-screen bg-gray-50">
      <label htmlFor="roll-number" className="text-xl font-semibold text-gray-700">
        Enter or Scan Roll Number
      </label>
      <input
        id="roll-number"
        placeholder="Roll Number"
        value={rollNumber}
        onChange={handleInputChange}
        className="w-64 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
      />

      {loading && <div className="loader mt-2"></div>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {studentData && (
        <div className="relative w-full max-w-3xl shadow-lg rounded-lg overflow-hidden bg-white mt-4">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-3 px-4 text-left text-sm">Roll Number</th>
                <th className="py-3 px-4 text-left text-sm">Name</th>
                <th className="py-3 px-4 text-left text-sm">Course</th>
                <th className="py-3 px-4 text-left text-sm">Department</th>
                <th className="py-3 px-4 text-left text-sm">Card Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                onClick={() => handleRouting(studentData.rollNumber)}
              >
                <td className="py-3 px-4 border-b text-sm text-gray-700">
                  {studentData.rollNumber}
                </td>
                <td className="py-3 px-4 border-b text-sm text-gray-700">
                  {studentData.name}
                </td>
                <td className="py-3 px-4 border-b text-sm text-gray-700">
                  {studentData.course}
                </td>
                <td className="py-3 px-4 border-b text-sm text-gray-700">
                  {studentData.department}
                </td>
                <td className="py-3 px-4 border-b text-sm text-gray-700">
                  {studentData.status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
