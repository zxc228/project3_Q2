"use client";

import React, { useState } from "react";
import Image from "next/image"
import { useRouter } from 'next/navigation';

const RegistrationPage = () => {
  const [selectedRole, setSelectedRole] = useState("STUDENT");
    const [formData, setFormData] = useState({
      id: "",
      email: "",
      password: "",
      role: selectedRole, // from the current state of the buttons
      studies: "B.S. COMPUTER SCIENCE",
    });
    
    // Add handling for form field changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    // Form submission handler
    const router = useRouter();

    const handleSubmit = async (e) => {
      e.preventDefault();

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("Data being sent:", formData);
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Registration failed");
      } else {
        alert("Registration successful");

        // 👇 redirect after successful registration
        router.push("/app/login");
      }
    };
    

  return (
    <div className="flex h-screen">
    <div className="w-1/2 bg-blue-600 flex justify-center items-center">
        <Image
          src="/u-tad-logo.png"
          alt="U-Tad Logo"
          width={700}
          height={600}
          className="max-h-full object-contain"
        />
      </div>
      

      {/* Right Section with the Form */}
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <button className="text-xl">&#8592;</button>
        <h1 className="text-4xl font-extrabold font-montserrat ml-60">Welcome to PCA</h1>
        <p className="text-gray-500 mb-8 ml-72 font-montserrat">Please enter your details</p>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 border ${
              selectedRole === "STUDENT" ? "bg-blue-50 font-montserrat text-custom-utad-logo" : "text-gray-500"
            }`}
            onClick={() => setSelectedRole("STUDENT")}
          >
            STUDENT
          </button>
          <button
            className={`px-4 py-2 border ${
              selectedRole === "TEACHER" ? "bg-white-50 font-montserrat border-custom-utad-logo text-custom-utad-logo" : "text-custom-utad-logo"
            }`}
            onClick={() => setSelectedRole("TEACHER")}
          >
            TEACHER
          </button>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-black font-montserrat">Name</label>
            <input
              name="id"
              type="text"
              onChange={handleChange}
              className="w-full border-b-4 border-custom-utad-logo outline-none"
            />
          </div>

          <div>
            <label className="block font-black font-montserrat">Studies</label>
            <select
              name="studies"
              value={formData.studies}
              onChange={handleChange}
              className="w-full border-b-4 border-custom-utad-logo outline-none py-2 text-custom-utad-logo"
            >
              <option>B.S. COMPUTER SCIENCE</option>
              <option>B.S. DOUBLE DEGREE IN COMPUTATIONAL MATHEMATICS AND COMPUTER SCIENCE</option>
              <option>B.S. DOUBLE DEGREE IN COMPUTATIONAL PHYSICS AND COMPUTER SCIENCE</option>
              <option>B.A. IN GAME DESIGN</option>
              <option>B.F.A. IN DIGITAL DESIGN</option>
              <option>B.A. IN VISUAL EFFECTS</option>
              <option>B.F.A. IN ANIMATION</option>
              <option>M.S. IN GAME DEVELOPMENT</option>
            </select>
          </div>

          <div>
            <label className="block font-black font-montserrat">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="w-full border-b-4 border-custom-utad-logo outline-none"
            />
          </div>

          <div>
            <label className="block font-black font-montserrat">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="w-full border-b-4 border-custom-utad-logo outline-none"
            />
          </div>

          <button type="submit" className="bg-custom-utad-logo font-montserrat text-white py-3 rounded-md">
            CREATE ACCOUNT
          </button>
        </form>


        <p className="mt-4 font-montserrat text-custom-utad-logo">
          A confirmation code will be sent to your email
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;