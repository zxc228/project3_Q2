"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Email verified successfully!");
        setTimeout(() => router.push("/"), 2000);
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
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
          priority
          className="max-h-full object-contain w-full"
        />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center px-12">
        <div className="justify-self-start w-full pl-10 mt-5">
          <Link href="/">
            <Image
              src="/svg/Return.svg"
              alt="Logo"
              width={27}
              height={25}
              priority
            />
          </Link>
        </div>
        <div className="text-center mt-10 w-full max-w-md">
          <h1 className="text-[36px] font-black font-montserrat mb-6">
            Verify your Email
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-lg font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 px-4 py-2 rounded-md font-montserrat text-[16px] border-custom-utad-logo focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block mb-2 text-lg font-semibold text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="w-full border-2 px-4 py-2 rounded-md font-montserrat text-[16px] border-custom-utad-logo focus:outline-none"
                placeholder="Enter 6-digit code"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="bg-custom-utad-logo text-white font-bold text-lg py-2 px-8 rounded-md hover:bg-blue-700 transition"
              >
                {submitting ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
