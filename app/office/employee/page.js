"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/employee");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-20">{error}</div>;
  }

  return (
    <div className="mt-20 px-6 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-700">
        Employee List
      </h1>
      {employees.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-500">No employees found.</p>
        </div>
      ) : (
        <div className="overflow-auto rounded-lg shadow-lg">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left font-semibold">User ID</th>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Category</th>
                <th className="p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.userId} className="border-b hover:bg-blue-50">
                  <td className="p-3 text-gray-700">{employee.userId}</td>
                  <td className="p-3 text-gray-700">{employee.name}</td>
                  <td className="p-3 text-gray-700">{employee.category}</td>
                  <td className="p-3 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      <FiEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-medium">
                      <FiTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-center m-4">
        <Link href={"/office/employee/add-employee"}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow-lg transition duration-200">
            Add Employee
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EmployeePage;
