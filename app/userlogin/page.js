'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CategoryLogin() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId || !password) {
      alert("Please enter both User ID and Password.");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    try {
      const response = await fetch("/api/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password, category: id }),
      });

      const data = await response.json();

      if (data.success) {
        if (id === "library") {
          router.push("/library-search");
        } else if (id === "canteen") {
          router.push("/canteen-search");
        } else if (id === "stationary") {
          router.push("/stationary-search");
        }
      } else {
        alert(data.message || "Invalid login credentials.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <section className="bg-gray-100">
      <div className="flex flex-col items-center justify-center px-6 py-12 mx-auto min-h-screen">
        <div className="w-full bg-white rounded-lg shadow-lg sm:max-w-md p-8">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="user-id"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  User ID
                </label>
                <input
                  type="text"
                  name="user-id"
                  id="user-id"
                  placeholder="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 mt-3"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
