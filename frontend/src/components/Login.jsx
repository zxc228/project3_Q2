"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import Explanation from "./Explanation";

export default function Login() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\d?@(live\.)?u-tad\.com$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          priority={true}
          className="max-h-full object-contain w-full"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16">
        <div className="text-center mb-16 mt-auto">
          <p className="text-custom-black font-montserrat font-bold text-[46px]">
            Welcome to U-PaFi{" "}
            <button
              className="inline-block"
              onClick={openModal}
              aria-label="Explanation"
            >
              <Image
                src={"/explanation.png"}
                alt="Explanation"
                width={20}
                height={20}
              />
            </button>
          </p>
          <p className="text-custom-black font-montserrat font-bold text-[20px] mt-1">
            please enter your details
          </p>
        </div>

        <Explanation isOpen={isModalOpen} closeModal={closeModal}>
          <h1 className="text-custom-black font-montserrat text-[20px] text-center">
            What is U-TAD Path Finder (U-PaFi)?
          </h1>
          <p className="text-custom-black font-400 font-montserrat text-[14px] mt-5 text-center">
            Lorem ipsum dolor sit amet consectetur. Ut nec pretium feugiat
            aliquet egestas. Ac sed ultricies purus dui feugiat tincidunt orci.
            Sit dictumst lectus est lectus laoreet.
          </p>

          <div className="flex justify-center mt-4">
            <Image
              src="/explanation_image.png"
              alt="Explanation Image"
              width={400}
              height={100}
              className="object-contain"
            />
          </div>
        </Explanation>

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
                autoComplete="email"
                placeholder="Enter your U-Tad email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-b-4 py-2 px-3 font-montserrat text-[24px] focus:outline-none border-custom-utad-logo text-custom-utad-logo"
              />
              <p
                className={`text-red-500 text-[16px] mt-1 transition-opacity duration-300 ${
                  errors.email ? "opacity-100" : "opacity-0"
                }`}
              >
                *the email is incorrect*
              </p>
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
                autoComplete="current-password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={handleInputChange}
                className="w-full border-b-4 py-2 px-3 pr-10 font-montserrat text-[24px] focus:outline-none border-custom-utad-logo text-custom-utad-logo"
              />
              <button
                type="button"
                onClick={handleShowPassword}
                className="absolute right-2 top-10 text-black text-3xl"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <p
                className={`text-red-500 text-sm mt-1 transition-opacity duration-300 ${
                  errors.password ? "opacity-100" : "opacity-0"
                }`}
              >
                *the password is incorrect*
              </p>
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

        <div className="mt-auto pb-10 text-center">
          <p className="text-custom-dark-grey font-montserrat font-bold text-[24px]">
            <Link href="/app/forgot-password">forgot password?</Link>
          </p>
          <p className="text-custom-dark-grey font-montserrat font-bold text-[24px]">
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
