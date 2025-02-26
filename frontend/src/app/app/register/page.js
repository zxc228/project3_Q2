"use client";

import React, { useState } from "react";

const RegistrationPage = () => {
  const [selectedRole, setSelectedRole] = useState("STUDENT");

  return (
    <div className="flex h-screen">
    <div className="w-1/2 bg-blue-600 flex items-center justify-center">
      <img
        src="https://scontent-mad1-1.xx.fbcdn.net/v/t39.30808-6/348457071_1440099213491800_7980231977094495645_n.png?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=kdlvvceGMCIQ7kNvgFYCcaN&_nc_oc=AdiBezAmMGaHyC3naDrdCGK8Qm2fMkQkeLK5Uwb6fM7UigeCjk-gnPTVvawU8kpJ27Y&_nc_zt=23&_nc_ht=scontent-mad1-1.xx&_nc_gid=Ao9nj7VE-RINHqW4uAQ7XHh&oh=00_AYDacmI2t4kv13kWSaTX21mGqYTMl2dysyLQMHb3s64KYQ&oe=67C29D44"
        alt="Logo"
        className="w-2/3 h-auto"
      />
    </div>

      {/* Right Section with the Form */}
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <button className="text-xl">&#8592;</button>
        <h1 className="text-4xl font-extrabold font-montserrat ml-60">Welcome to PCA</h1>
        <p className="text-gray-500 mb-8 ml-72">please enter your details</p>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 border ${
              selectedRole === "STUDENT" ? "bg-blue-50 text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setSelectedRole("STUDENT")}
          >
            STUDENT
          </button>
          <button
            className={`px-4 py-2 border ${
              selectedRole === "TEACHER" ? "bg-white-50 border-blue-500 text-blue-500" : "text-blue-500"
            }`}
            onClick={() => setSelectedRole("TEACHER")}
          >
            TEACHER
          </button>
        </div>

        <form className="flex flex-col gap-6">
          <div>
            <label className="block font-black font-montserrat">Name</label>
            <input
              type="text"
              className="w-full border-b-4 border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-black font-montserrat">Studies</label>
            <select className="w-full border-b-4 border-blue-500 outline-none py-2 text-blue-500">
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
              type="email"
              className="w-full border-b-4 border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-black font-montserrat">Passwords</label>
            <input
              type="password"
              className="w-full border-b-4 border-blue-500 outline-none"
            />
          </div>

          <button className="bg-blue-500 text-white py-3 rounded-md">
            CREATE ACCOUNT
          </button>
        </form>

        <p className="mt-4 text-blue-500">
          A confirmation code will be sent to your email
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
