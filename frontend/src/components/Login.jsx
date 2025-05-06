"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import Explanation from "./Explanation";
import { toast } from "react-hot-toast";

export default function Login() {
  const router = useRouter();

  const [isOpenExplanation, setIsOpenExplanation] = useState(false);
  const [positionExplanation, setPositionExplanation] = useState({
    top: 0,
    left: 0,
  });

  const handleToggleExplanation = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPositionExplanation({
      top: rect.bottom + window.scrollY + 10,
      left: rect.left + window.scrollX - 500,
    });
    setIsOpenExplanation((prev) => !prev);
  };

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || data.error || "Login failed");
      } else {
        toast.success("Login successful");
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("token", data.token);
        const nameRaw = data.user.id;
        const profileId =
          "profile_" + nameRaw.trim().toLowerCase().replace(/\s+/g, "_");
        localStorage.setItem("profileId", profileId);
        console.log("data", data);
        if (data.user.role === "TEACHER") {
          router.push("/tutor-profile");
        } else {
          router.push("/dashboard");
        }
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-custom-utad-logo flex justify-center items-center">
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
        <div className="text-center mt-auto mb-10">
          <p className="text-custom-black font-montserrat font-black text-[36px]">
            Welcome to U-PaFi{" "}
            <button
              className="inline-block items-start"
              onClick={handleToggleExplanation}
              aria-label="Explanation"
            >
              <Image
                src={"/svg/_/Big.svg"}
                alt="Explanation"
                width={20}
                height={20}
              />
            </button>
          </p>
          <p className="text-custom-black font-montserrat font-semibold text-[22px] mt-1">
            please enter your details
          </p>
        </div>

        <Explanation isOpen={isOpenExplanation} position={positionExplanation}>
          <h1 className="text-custom-black font-montserrat font-extrabold text-[28px]">
            What is U-TAD Path Finder (U-PaFi)?
          </h1>
          <p className="text-custom-black font-normal font-montserrat text-[14px] mt-5">
            U-PaFi is a career guidance platform that helps U-TAD students
            identify the best career paths based on their grades and skills. We
            recommend personalized career tracks, show which skills to focus on,
            and generate reports to share with your tutor. Plan your
            professional future and improve your employability with U-PaFi!
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
            <div className="mt-10 relative">
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your U-Tad email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border-b-4 py-2 px-3 font-montserrat text-[22px] font-semibold focus:outline-none border-custom-utad-logo text-custom-utad-logo"
              />
              <p
                className={`text-red-500 text-[14px] font-bold mt-1 transition-opacity duration-300 ${
                  errors.email ? "opacity-100" : "opacity-0"
                }`}
              >
                *the email is incorrect*
              </p>
            </div>

            <div className="mt-10 relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={handleInputChange}
                className="w-full border-b-4 py-2 px-3 pr-10 font-montserrat text-[22px] font-semibold focus:outline-none border-custom-utad-logo text-custom-utad-logo"
              />
              <button
                type="button"
                onClick={handleShowPassword}
                className="absolute right-2 top-2 text-black text-3xl"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <p
                className={`text-red-500 text-[14px] font-bold mt-1 transition-opacity duration-300 ${
                  errors.password ? "opacity-100" : "opacity-0"
                }`}
              >
                *the password is incorrect*
              </p>
            </div>

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="w-[235px] h-[60px] py-[18px] px-[64px] bg-custom-utad-logo text-white font-montserrat font-bold text-[20px] rounded-md text-center flex justify-center items-center"
                aria-label="Log in"
              >
                LOG IN
              </button>
            </div>
          </form>
        </div>

        <div className="mt-auto pb-10 text-center">
          <p className="text-custom-dark-grey font-montserrat font-semibold text-[22px]">
            <Link href="/forgot-password">Forgot password?</Link>
          </p>
          <p className="text-custom-dark-grey font-montserrat font-semibold text-[22px]">
            <Link href="/register">
              Don’t have an account already?{" "}
              <span className="font-bold">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
