"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const DocumentPage = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/document");
        const data = await res.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

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

        // Store in database
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

  return (
    <div className="p-6 mt-16 max-w-5xl mx-auto min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Available Documents
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex flex-col justify-between items-start bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/pdf.png"
                alt="PDF icon"
                width={44}
                height={44}
                className="object-contain"
              />
              <span className="font-medium text-gray-800">{doc.name}</span>
            </div>
            <div className="flex gap-3">
              {doc.url ? (
                <>
                  <Link
                    href={doc.url}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    View
                  </Link>
                </>
              ) : (
                <span className="text-gray-400">No link available</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Upload a New Document
        </h3>
        <label className="inline-block px-6 py-2 rounded-lg bg-blue-600 text-white font-medium cursor-pointer hover:bg-blue-700 transition duration-200">
          Select File
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {file && (
          <p className="mt-2 text-gray-600">Selected File: {file.name}</p>
        )}
        <button
          onClick={handleUpload}
          className="ml-4 px-6 py-2 rounded-lg bg-green-600 text-white font-medium cursor-pointer hover:bg-green-700 transition duration-200"
          disabled={uploading || !file}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {message && <p className="mt-4 text-gray-800">{message}</p>}
      </div>
    </div>
  );
};

export default DocumentPage;
