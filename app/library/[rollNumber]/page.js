"use client";
import { addTwoWeeks, getTodayDate } from "@/Data/Information";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const LibraryPage = ({ params }) => {
  const { rollNumber } = React.use(params);
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    issueDate: getTodayDate(),
    dueDate: addTwoWeeks(),
  });
  const [returnData, setReturnData] = useState({
    code: "",
    bookName: "",
    dueDate: "",
    fineAmount: "",
  });
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [items, setItems] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]);
  const [finePaymentAmount, setFinePaymentAmount] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  useEffect(() => {
    setTotalAmount(finePaymentAmount);
  }, [finePaymentAmount]);

  useEffect(() => {
    const fetchData = async () => {
      if (!rollNumber) return;
      try {
        const response = await fetch(`/api/student/${rollNumber}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStudentData(data);
        setUpdatedBalance(data.balance || 0);
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rollNumber]);

  const handleCheckout = async () => {
    // Parse finePaymentAmount as a number
    const fineAmount = parseFloat(finePaymentAmount) || 0;
    const totalDeduction = totalAmount + fineAmount;

    if (updatedBalance >= totalDeduction) {
      const newBalance = updatedBalance - totalDeduction;
      setUpdatedBalance(newBalance);

      try {
        await fetch(`/api/student/${rollNumber}/updateBalance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ balance: newBalance }),
        });

        await handleSubmit();

        alert("Transaction completed successfully, including fine deduction!");
        setItems([]);
        setReturnedItems([]);
        setFinePaymentAmount("");
      } catch (error) {
        console.error("Error during transaction:", error);
        alert("Transaction failed: " + error.message);
      }
    } else {
      alert("Insufficient balance to proceed with checkout and fine payment.");
    }
  };

  const handleSubmit = async () => {
    try {
      await fetch("/api/library/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber,
          studentName: studentData.name,
          course: studentData.course,
          department: studentData.department,
          issue: items,
          returns: returnedItems,
          totalAmount,
        }),
      });
    } catch (error) {
      console.error("Error recording transaction:", error);
      alert("Failed to record transaction: " + error.message);
    }
  };

  const handleAddIssue = () => {
    if (Object.values(formData).every((value) => value)) {
      setItems((prev) => [...prev, formData]);
      setFormData({
        code: "",
        name: "",
        issueDate: getTodayDate(),
        dueDate: addTwoWeeks(),
      });
    } else {
      alert("Please fill all fields for the issue.");
    }
  };

  const handleAddReturn = () => {
    const isIssued = items.some(
      (item) =>
        item.code === returnData.code && item.name === returnData.bookName
    );

    if (isIssued) {
      if (Object.values(returnData).every((value) => value)) {
        setReturnedItems((prev) => [...prev, returnData]);
        setReturnData({
          code: "",
          bookName: "",
          dueDate: "",
          fineAmount: "",
        });
      } else {
        alert("Please fill all fields for the return.");
      }
    } else {
      alert("You can only return books that have been issued to you.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendOtp = async () => {
    setIsOtpLoading(true);
    try {
      const res = await fetch(`/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactNumber: `+91${studentData.contactNumber}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setOtpError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Error sending OTP. Please check your network.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsOtpLoading(true);
    try {
      const res = await fetch(`/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp,
          contactNumber: `+91${studentData.contactNumber}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        handleCheckout();
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Error verifying OTP. Please check your network.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600 mt-10">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 mt-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">
        {/* Student Information */}
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-screen-2xl">
          {/* Student profile and details */}
          <div className="flex flex-col items-center">
            <Image
              src={studentData?.profile?.profilePictureUrl || "/Roshan.jpg"}
              alt="User Profile"
              className="w-28 h-28 rounded-full mb-4"
              width={112}
              height={112}
              priority
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              {studentData?.name || "User"}
            </h2>
            {/* Student details */}
            <div className="grid grid-cols-2 gap-4 w-full text-gray-600 mt-4">
              <p>
                <span className="font-semibold">Roll No:</span>{" "}
                {studentData.rollNumber}
              </p>
              <p>
                <span className="font-semibold">Course:</span>{" "}
                {studentData.course}
              </p>
              <p>
                <span className="font-semibold">Dept:</span>{" "}
                {studentData.department}
              </p>
              <p>
                <span className="font-semibold">Mobile No:</span>{" "}
                {studentData.contactNumber}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {studentData.email}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {studentData.address || "Not Available"}
              </p>
              <p>
                <span className="font-semibold">Books Issued:</span>{" "}
                {studentData.issuedBooksCount || 0}
              </p>
              <p>
                <span className="font-semibold">Books Returned:</span>{" "}
                {studentData.returnedBooksCount || 0}
              </p>
              <p>
                <span className="font-semibold">Card Status:</span>
                <span
                  className={`ml-1 text-${
                    studentData.status === "Active" ? "green" : "red"
                  }-500 font-medium`}
                >
                  {studentData.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Available Balance:</span> ₹
                {studentData.balance || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Book Issue Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Book Issue
          </h3>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-4 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-sm text-gray-600">
                  Book ID
                </th>
                <th className="py-3 px-4 border-b text-sm text-gray-600">
                  Book Name
                </th>
                <th className="py-3 px-4 border-b text-sm text-gray-600">
                  Issue Date
                </th>
                <th className="py-3 px-4 border-b text-sm text-gray-600">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {item.issueDate}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {item.dueDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              id="code"
              placeholder="Book ID"
              value={formData.code}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              id="name"
              placeholder="Book Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              id="issueDate"
              value={getTodayDate()}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full appearance-none"
            />
            <input
              type="text"
              id="dueDate"
              value={addTwoWeeks()}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full appearance-none"
            />
          </div>
          <button
            onClick={handleAddIssue}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 w-full mb-2"
          >
            Add Book
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 px-4 mb-2"
          >
            Issue
          </button>
        </div>

        {/* Return Book Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8 md:mt-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Return Book
          </h3>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-4 text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-sm text-gray-600">
                  Item Code
                </th>
                <th className="py-3 px-4 border-b text-sm text-gray-600">
                  Book Name
                </th>
                <th className="py-3 px-4 border-b text-sm text-gray-600">
                  Due Date
                </th>
                <th className="py-3 px-4 border-b text-sm text-gray-600">
                  Fine Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {returnedItems.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {item.bookName}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {item.dueDate}
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-700">
                    {item.fineAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              id="code"
              placeholder="Item Code"
              value={returnData.code}
              onChange={(e) =>
                setReturnData((prev) => ({
                  ...prev,
                  code: e.target.value,
                }))
              }
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              id="bookName"
              placeholder="Book Name"
              value={returnData.bookName}
              onChange={(e) =>
                setReturnData((prev) => ({
                  ...prev,
                  bookName: e.target.value,
                }))
              }
              className="border rounded-md p-2 w-full"
            />
            <input
              type="text"
              id="dueDate"
              placeholder="Due Date"
              value={returnData.dueDate}
              onChange={(e) =>
                setReturnData((prev) => ({
                  ...prev,
                  dueDate: e.target.value,
                }))
              }
              className="border rounded-md p-2 w-full appearance-none"
            />
            <input
              type="number"
              id="fineAmount"
              placeholder="Fine Amount"
              value={returnData.fineAmount}
              onChange={(e) =>
                setReturnData((prev) => ({
                  ...prev,
                  fineAmount: e.target.value,
                }))
              }
              className="border rounded-md p-2 w-full"
            />
          </div>
          <button
            onClick={handleAddReturn}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 w-full mb-2"
          >
            Add Book
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 px-4 mb-2">
            Return
          </button>
        </div>

        {/* Pay Late Fine Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 w-full">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Pay Late Fine
          </h3>

          <div className="mt-4 gap-3">
            <input
              type="number"
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="Enter amount to pay"
              value={finePaymentAmount}
              onChange={(e) => setFinePaymentAmount(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4">
              <h4 className="text-lg font-semibold">
                Total Amount: ₹{totalAmount}
              </h4>
              {!otpSent ? (
                <button
                  className="bg-green-500 text-white rounded-md px-4 py-2"
                  onClick={handleSendOtp}
                >
                  Pay With Balance
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <button
                    className="bg-blue-500 text-white rounded-md px-4 py-2"
                    onClick={handleVerifyOtp}
                  >
                    Verify & Pay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
