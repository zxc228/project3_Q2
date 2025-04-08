"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CareerFieldSelection() {
  const router = useRouter();
  const [field, setField] = useState("");

  const handleContinue = () => {
    // For now, go to the next page (you can pass field later)
    router.push("/job-or-internship");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 relative bg-white">
      {/* Exit button */}
      <button
        className="absolute top-6 right-6 text-blue-600 text-2xl font-bold"
        onClick={() => router.push("/dashboard")}
      >
        ✕
      </button>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-semibold text-center mb-8 text-gray-800">
        What Career Field do you want to specialize in?
      </h1>

      {/* Dropdown */}
      <div className="w-[400px] relative text-center">
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full border-2 border-blue-600 text-blue-600 font-semibold rounded-md px-4 py-4 text-center items-center appearance-none focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="">Do not know</option>
          <option value="data">Data</option>
          <option value="web">Web Development</option>
          <option value="cybersecurity">Cybersecurity</option>
          <option value="ai">AI & Machine Learning</option>
          {/* Add more options as needed */}
        </select>
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md transition-all"
      >
        CONTINUE
      </button>
    </div>
  );
}
