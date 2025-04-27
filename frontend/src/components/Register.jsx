"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';


export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    selectedRole: null,
    name: "",
    studies: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const handleRoleSelection = (role) => {
    setFormData((prev) => ({ ...prev, selectedRole: role }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const studentEmailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\d?@live\.u-tad\.com$/;
  const professorEmailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\d?@u-tad\.com$/;
  const passwordRegex = /^[a-zA-Z0-9]{7,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.selectedRole) {
      toast.error("Please select a role (Student or Teacher)");
      return;
    }

    const emailError =
      formData.selectedRole === "student"
        ? !studentEmailRegex.test(formData.email)
        : !professorEmailRegex.test(formData.email);

    const newErrors = {
      email: emailError,
      password: !passwordRegex.test(formData.password),
      confirmPassword: formData.password !== formData.confirmPassword,
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      const payload = {
        id: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.selectedRole?.toUpperCase(),
        studies: formData.studies,
      };

    const res = await fetch("/api/auth/register",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
      } else {
        toast.success("Registration successful");
        router.push("/");
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
          priority={true}
          className="max-h-full object-contain w-full"
        />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center pb-5">
        <div className="justify-self-start w-full pl-10">
          <Link href="/" className="text-black text-5xl">
            &#8592;
          </Link>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-[32px] font-900 font-montserrat">
            Create new profile
          </h1>
        </div>
        <div className="w-full px-32 overflow-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-10">
              <button
                className={`text-[16px] text-custom-utad-logo font-montserrat font-700 border-[2px] border-custom-utad-logo py-2 px-4 rounded block ${
                  formData.selectedRole === "student"
                    ? "bg-custom-utad-logo text-white"
                    : ""
                }`}
                type="button"
                onClick={() => handleRoleSelection("student")}
              >
                Student
              </button>
              <button
                className={`text-[16px] text-custom-utad-logo font-montserrat font-700 border-[2px] border-custom-utad-logo py-2 px-4 rounded block ${
                  formData.selectedRole === "teacher"
                    ? "bg-custom-utad-logo text-white"
                    : ""
                }`}
                type="button"
                onClick={() => handleRoleSelection("teacher")}
              >
                Teacher
              </button>
            </div>
            <div className="relative mt-5">
              <input
                id="name"
                name="name"
                autoComplete="current-password"
                value={formData.name}
                placeholder="Enter your name"
                onChange={handleInputChange}
                className="w-full border-b-4 py-2 px-3 font-montserrat text-[24px] focus:outline-none border-custom-utad-logo text-custom-utad-logo"
              />
              <label
                htmlFor="studies"
                className="block text-black font-montserrat text-[24px] mt-10"
              >
                Studies
              </label>
              <select
                name="studies"
                value={formData.studies}
                onChange={handleInputChange}
                disabled={formData.selectedRole === "teacher"}
                className={`w-full border-2 px-3 py-2 mt-5 font-montserrat text-[16px] 
    focus:outline-none rounded-md border-custom-utad-logo text-black
    ${
      formData.selectedRole === "teacher"
        ? "bg-gray-200 cursor-not-allowed"
        : ""
    }`}
              >
                <option value="">Select your studies</option>
                <option value="deg_data">
                  B.S. COMPUTER SCIENCE - DATA ENGINEERING
                </option>
                <option value="deg_cyber">
                  B.S. COMPUTER SCIENCE - CYBERSECURITY
                </option>
              </select>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your U-Tad email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full mt-10 border-b-4 py-2 px-3 font-montserrat text-[24px] focus:outline-none border-custom-utad-logo text-custom-utad-logo"
              ></input>
              <p
                className={`text-red-500 text-[16px] mt-1 transition-opacity duration-300 ${
                  errors.email ? "opacity-100" : "opacity-0"
                }`}
              >
                *use an email given by university*
              </p>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={handleInputChange}
                className="w-full mt-5 border-b-4 py-2 px-3 font-montserrat text-[24px] focus:outline-none border-custom-utad-logo text-custom-utad-logo"
              />
              <p
                className={`text-red-500 text-[16px] mt-1 transition-opacity duration-300 ${
                  errors.password ? "opacity-100" : "opacity-0"
                }`}
              >
                *must be 7 characters long and not include any special
                characters*
              </p>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                autoComplete="current-password"
                value={formData.confirmPassword}
                placeholder="Confirm your password"
                onChange={handleInputChange}
                className="w-full mt-5 border-b-4 py-2 px-3 font-montserrat text-[24px] focus:outline-none border-custom-utad-logo text-custom-utad-logo"
              />
              <p
                className={`text-red-500 text-[16px] mt-1 transition-opacity duration-300 ${
                  errors.confirmPassword ? "opacity-100" : "opacity-0"
                }`}
              >
                *the passwords do not match*
              </p>

              <div className="text-center">
                <button
                  type="submit"
                  className="w-1/2 bg-custom-utad-logo text-white font-montserrat font-bold text-[21px] py-2 mt-10 rounded-lg"
                >
                  CREATE ACCOUNT
                </button>
              </div>
            </div>
          </form>

          <div className="text-center mt-10">
            <p className="text-[22px]">
              A confirmation code will be sent to your email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
