"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-blue-600 flex justify-center items-center">
        <Image src="/u-tad-logo.png" alt="U-Tad" width={700} height={600} />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16">
        <div className="text-center mb-6">
          <p className="text-black font-montserrat font-bold text-[46px]">
            Welcome to PCA
          </p>
          <p className="text-black font-montserrat font-bold text-[20px] mt-1">
            please enter your details
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-black font-montserrat font-bold text-[24px]"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-b-2 border-custom-utad-logo focus:outline-none py-2 font-montserrat text-[16px] text-custom-utad-logo"
              />
            </div>
            <div className="relative mb-6">
              <label
                htmlFor="password"
                className="block text-black font-montserrat font-bold text-[24px]"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border-b-2 border-custom-utad-logo focus:outline-none py-2 pr-10 font-montserrat text-[16px] text-custom-utad-logo"
              />
              <button
                type="button"
                onClick={handleShowPassword}
                className="absolute right-2 top-10 text-black text-xl"
              >
                →
              </button>
            </div>
            <button
              type="submit"
              className="w-[235px] h-[60px] py-[18px] px-[64px] bg-custom-utad-logo text-white font-montserrat font-bold text-[24px] rounded-md text-center flex justify-center items-center"
              aria-label="Log in"
            >
              LOG IN
            </button>
          </form>
        </div>
        <div className="mt-6">
          <p className="text-custom-utad-logo font-montserrat font-bold text-[24px]">
            <Link href="/register">
              don't have an account already?{" "}
              <span className="font-[800]">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
