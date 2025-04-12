"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email) => {
    return /@(?:u-tad\.com|live\.u-tad\.com)$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('*the email is incorrect*');
      return;
    }
    
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to send recovery email");
      } else {
        alert("Recovery email sent successfully!");
        router.push("/login");
      }
    } catch (error) {
      console.error("Password recovery error:", error);
      setError("Failed to send recovery email");
    }
  };

  return (
    <div className="flex h-screen relative bg-white overflow-hidden">
      <div className="w-[720px] h-screen bg-blue-600 flex justify-center items-center">
        <Image
          src="/u-tad-logo.png"
          alt="U-Tad Logo"
          width={500}
          height={500}
          priority={true}
          className="max-w-[80%] object-contain"
        />
      </div>

      <div className="w-[720px] relative">
        <h1 className="absolute left-[187px] top-[219px] text-center text-[#14192C] text-[36px] font-montserrat font-[900] leading-[42px] break-words">
          Account recovery
        </h1>

        <p className="absolute w-[333px] left-[194px] top-[284px] text-center text-[#14192C] text-[20px] font-montserrat font-bold">
          Insert your email to recover your password
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <label 
              className={`absolute left-[79px] top-[495px] w-[83px] h-[34px] text-[#6F7276] text-[24px] font-montserrat font-bold transition-opacity duration-200 ${
                email ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="absolute left-[67px] top-[495px] w-[562px] bg-transparent border-none outline-none text-[24px] font-montserrat text-[#6F7276]"
              required
            />
            <div className="absolute left-[67px] top-[535px] w-[562px] h-[6px] bg-[#0065EF]" />
            {error && (
              <p className="absolute left-[75px] top-[547px] w-[590px] text-[#FF4929] text-[16px] font-montserrat font-bold leading-[22px]">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="absolute left-[167px] top-[608px] h-[60px] px-16 py-[18px] bg-[#0065EF] text-white font-montserrat font-bold text-[21px] rounded-lg uppercase leading-[21px] flex items-center justify-center"
          >
            Recover Password
          </button>
        </form>
      </div>
    </div>
  );
}
