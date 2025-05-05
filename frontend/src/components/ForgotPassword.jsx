"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState({ email: false, api: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ email: false, api: "" }); // Clear error on change
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+\d?@(live\.)?u-tad\.com$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      setError({ email: true, api: "" });
      return;
    }

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError({
          email: false,
          api: data.error || "Failed to send recovery email",
        });
      } else {
        alert("Recovery email sent successfully!");
        router.push("/login");
      }
    } catch (err) {
      console.error("Password recovery error:", err);
      setError({
        email: false,
        api: "Something went wrong. Please try again.",
      });
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
          priority
          className="max-h-full object-contain w-full"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-16">
        <div className="text-center mt-10 mb-24">
          <p className="text-custom-black font-montserrat font-black text-[36px]">
            Account recovery
          </p>
          <p className="text-custom-black font-montserrat font-bold text-[20px] mt-1">
            Insert your email to recover
            <br />
            your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[700px] mb-40">
          <div className="relative">
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your U-Tad email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full border-b-4 py-2 px-3 font-montserrat text-[24px] font-bold focus:outline-none ${
                error.email
                  ? "border-red-500 text-red-500"
                  : "border-custom-utad-logo text-custom-utad-logo"
              }`}
            />
            {error.email && (
              <p className="text-red-500 text-[16px] font-bold mt-1">
                *The email is incorrect*
              </p>
            )}
            {error.api && (
              <p className="text-red-500 text-[16px] font-semibold mt-1">
                {error.api}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="w-[373px] h-[60px] py-[18px] px-[64px] bg-custom-utad-logo text-white font-montserrat font-bold text-[21px] rounded-md text-center flex justify-center items-center"
              aria-label="Recover password"
            >
              RECOVER PASSWORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
