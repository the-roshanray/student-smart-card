"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const StationaryPage = ({ params }) => {
  const { rollNumber } = React.use(params);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    code: "",
    name: "",
    quantity: 0,
    amount: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!rollNumber) return;
      try {
        const response = await fetch(`/api/student/${rollNumber}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStudentData(data);
        setUpdatedBalance(data.balance);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rollNumber]);

  useEffect(() => {
    const amount = items.reduce((acc, item) => acc + item.amount, 0);
    setTotalAmount(amount);
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "amount" ? Number(value) : value,
    }));
  };

  const handleAddItem = () => {
    if (
      newItem.code &&
      newItem.name &&
      newItem.quantity > 0 &&
      newItem.amount > 0
    ) {
      setItems((prev) => [...prev, newItem]);
      setNewItem({ code: "", name: "", quantity: 0, amount: 0 });
    } else {
      alert("Please fill in all fields with valid values.");
    }
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

  const handleCheckout = async () => {
    if (updatedBalance >= totalAmount) {
      const newBalance = updatedBalance - totalAmount;
      setUpdatedBalance(newBalance);

      try {
        await fetch(`/api/student/${rollNumber}/updateBalance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ balance: newBalance }),
        });

        await fetch("/api/stationary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rollNumber,
            studentName: studentData.name,
            course: studentData.course,
            department: studentData.department,
            items,
            totalAmount,
          }),
        });

        alert("Transaction completed successfully!");
        setItems([]);
        setOtpSent(false);
        setOtp("");
      } catch (error) {
        alert("Error completing transaction.");
      }
    } else {
      alert("Insufficient balance to proceed with checkout.");
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById("bill").innerHTML;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Bill</h2>
          <div>${printContents}</div>
        </body>
      </html>`);
    newWindow.document.close();
    newWindow.print();
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600 mt-10">Error: {error}</div>;

  return (
    <div className="bg-gray-100 flex flex-col items-center py-10 mt-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-screen-2xl">
          <div className="flex flex-col items-center">
            <Image
              src={studentData?.profilePictureUrl || "/Roshan.jpg"}
              alt="User Profile"
              className="w-28 h-28 rounded-full mb-4"
              width={112}
              height={112}
              priority
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              {studentData?.name || "User"}
            </h2>
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
                {updatedBalance}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Stationary Cart
            </h3>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-4">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                    Item Code
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                    Product Name
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                    Quantity
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                    Amount (₹)
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
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-700">
                      ₹ {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="code" className="sr-only">
                  Item Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  placeholder="Item Code"
                  value={newItem.code}
                  onChange={handleChange}
                  className="border rounded-md w-full p-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="name" className="sr-only">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={handleChange}
                  className="border rounded-md w-full p-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="quantity" className="sr-only">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="quantity"
                  value={newItem.quantity}
                  onChange={handleChange}
                  className="border rounded-md w-full p-2"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="amount" className="sr-only">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Amount"
                  value={newItem.amount}
                  onChange={handleChange}
                  className="border rounded-md w-full p-2"
                />
              </div>
            </div>
            <button
              onClick={handleAddItem}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4 mb-2"
            >
              Add Product
            </button>
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold">
                Total Amount: ₹{totalAmount}
              </h4>
              {!otpSent ? (
                <button
                  className="bg-green-500 text-white rounded-md px-4 py-2"
                  onClick={handleSendOtp}
                >
                  Send OTP for Checkout
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border rounded-md p-2"
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
            {otpError && <p className="text-red-500">{otpError}</p>}
          </div>
          <div id="bill" className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Bill</h3>
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                    Item Code
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                    Product Name
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                    Quantity
                  </th>
                  <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                    Amount (₹)
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
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-700">
                      {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4 className="text-lg font-semibold mt-4">
              Total Amount: ₹{totalAmount}
            </h4>
            <button
              className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2"
              onClick={handlePrint}
            >
              Print Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationaryPage;
