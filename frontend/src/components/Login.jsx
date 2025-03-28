"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[a-zA-Z]+(\.[a-zA-Z0-9]+)?@(live\.)?u-tad\.com$/;

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors({
      ...errors,
      [name]: name === "email" ? !emailRegex.test(value) : value.length < 8,
    });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const newErrors = {
        email: !emailRegex.test(formData.email),
        password: formData.password.length < 8,
      };
    
      setErrors(newErrors);
    
      if (!newErrors.email && !newErrors.password) {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
    
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Login failed");
        } else {
          alert("Login successful");
          console.log("User Data:", data.user);
    
          router.push("/app/dashboard");
        }
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

      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16">
        <div className="text-center mb-16 mt-auto">
          <p className="text-black font-montserrat font-bold text-[46px]">
            Welcome to PCA
          </p>
          <p className="text-black font-montserrat font-bold text-[20px] mt-1">
            Please enter your details
          </p>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-black font-montserrat font-bold text-[24px]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border-b-4 py-2 font-montserrat text-[16px] ${
                  errors.email
                    ? "border-red-500 text-red-500"
                    : "border-custom-utad-logo text-custom-utad-logo"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  Invalid email format
                </p>
              )}
            </div>

            <div className="relative mb-6">
              <label
                htmlFor="password"
                className="block text-black font-montserrat font-bold text-[24px]"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full border-b-4 py-2 pr-10 font-montserrat text-[16px] ${
                  errors.password
                    ? "border-red-500 text-red-500"
                    : "border-custom-utad-logo text-custom-utad-logo"
                }`}
              />
              <button
                type="button"
                onClick={handleShowPassword}
                className="absolute right-2 top-10 text-black text-xl"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <div className="flex justify-center m-10">
              <button
                type="submit"
                className="w-[235px] h-[60px] py-[18px] px-[64px] bg-custom-utad-logo text-white font-montserrat font-bold text-[24px] rounded-md text-center flex justify-center items-center"
                aria-label="Log in"
              >
                LOG IN
              </button>
            </div>
          </form>
        </div>

        <div className="mt-auto pb-10">
          <p className="text-custom-utad-logo font-montserrat font-bold text-[24px]">
            <Link href="/app/register">
              don’t have an account already?{" "}
              <span className="font-[800]">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
