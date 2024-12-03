"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "react-spinkit";
import Script from "next/script";
import Link from "next/link";

const StudentDashboard = ({ params }) => {
  const { rollNumber } = React.use(params);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedBalance, setUpdatedBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState(0);

  const handleAddBalance = async () => {
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();
      const paymentData = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "Student Smart Card",
        description: "Order Description",
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/payment-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                rollNumber: studentData.rollNumber,
                amount: amount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert("Payment Successful");
              updateBalance(amount);
            } else {
              alert("Payment Verification Failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: studentData?.name,
          email: studentData?.email,
          contact: studentData?.contactNumber,
        },
        notes: {
          address: studentData?.address,
        },
        theme: {
          color: "#F37254",
        },
      };

      const payment = new window.Razorpay(paymentData);
      payment.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Order creation failed");
    }
  };

  const updateBalance = async (amount) => {
    try {
      const newBalance = updatedBalance + amount;
      setUpdatedBalance(newBalance);

      const res = await fetch(`/api/student/${rollNumber}/updateBalance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: newBalance }),
      });
      if (!res.ok) throw new Error("Failed to update balance");

      console.log("Balance updated successfully.");

      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber,
          studentName: studentData.name,
          course: studentData.course,
          department: studentData.department,
          contactNumber: studentData.contactNumber,
          balance: amount,
        }),
      });

      console.log("Transaction saved successfully.");
      alert("Transaction completed successfully!");
    } catch (error) {
      console.error("Error updating balance or saving transaction:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMessage("");
    } else {
      setMessage("Only PDF files are allowed");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        const newDoc = { url: data.secure_url, name: file.name };

        await fetch("/api/document", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newDoc),
        });

        setDocuments((prevDocs) => [...prevDocs, newDoc]);
        setMessage("PDF uploaded successfully");
      } else {
        console.error("Upload failed: No secure URL returned.");
        setMessage("Upload failed: No secure URL returned.");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setMessage("Error uploading document");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!rollNumber) return;
      try {
        const response = await fetch(`/api/student/${rollNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setStudentData(data);
        setUpdatedBalance(data.balance);
        setTransactions(data.transactions || []);
        setDocuments(data.documents || []);
      } catch (error) {
        setError(error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rollNumber]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/document");
        if (!res.ok) {
          throw new Error("Failed to fetch documents");
        }
        const data = await res.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-10">
        <Spinner name="circle" color="blue" />
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 mt-10">Error: {error}</div>;

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => console.log("Razorpay SDK loaded")}
      />
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
                  {studentData?.rollNumber}
                </p>
                <p>
                  <span className="font-semibold">Course:</span>{" "}
                  {studentData?.course}
                </p>
                <p>
                  <span className="font-semibold">Dept:</span>{" "}
                  {studentData?.department}
                </p>
                <p>
                  <span className="font-semibold">Mobile No:</span>{" "}
                  {studentData?.contactNumber}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {studentData?.email}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {studentData?.address || "Not Available"}
                </p>
                <p>
                  <span className="font-semibold">Card Status:</span>
                  <span
                    className={`ml-1 text-${
                      studentData?.status === "Active" ? "green" : "red"
                    }-500 font-medium`}
                  >
                    {studentData?.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Available Balance:</span> ₹
                  {updatedBalance}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="p-2 border border-gray-300 rounded-md w-32"
                  />
                  <button
                    onClick={handleAddBalance}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-2 rounded-full w-32 shadow-lg hover:bg-gradient-to-br hover:from-blue-600 hover:to-teal-600 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Add Balance
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Last Transactions
              </h3>
              {loading ? (
                <p className="text-gray-600">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="text-gray-600">No transactions found.</p>
              ) : (
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                        Transaction ID
                      </th>
                      <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                        Place
                      </th>
                      <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                        Amount
                      </th>
                      <th className="py-3 px-4 border-b text-left text-sm text-gray-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 transition duration-200"
                      >
                        <td className="py-2 px-4 border-b text-gray-700">
                          {transaction.transactionId}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-700">
                          {transaction.place}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-700">
                          ₹{transaction.amount}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-700">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Document
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-1 rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300 gap-1"
                  >
                    <Image
                      src="/pdf.png"
                      alt="PDF icon"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span className="text-gray-700 font-medium mb-2">
                      {doc.name}
                    </span>
                    {doc.url ? (
                      <Link
                        href={doc.url}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 font-semibold ml-auto"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-400">No link available</span>
                    )}
                  </div>
                ))}
              </div>

              {/* File Upload Section */}
              <div className="mt-6">
                <label className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200">
                  Select File
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {file && (
                  <div className="mt-4">
                    <p className="text-gray-600">Selected File: {file.name}</p>
                    <button
                      onClick={handleUpload}
                      className="mt-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition duration-200"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                )}
              </div>

              {message && <p className="mt-4 text-gray-800">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
