"use client";
import { useState } from 'react';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email) => {
    return /@(?:u-tad\.com|live\.u-tad\.com)$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('The email is incorrect');
      return;
    }

    setError('');
    setEmailSent(true);
  };

  if (emailSent) {
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
        <div className="w-1/2 relative">
          <h1 className="absolute w-full text-center text-[36px] leading-[42px] font-black font-[Montserrat] text-[#14192C] top-[120px]">
            Account recovery
          </h1>
          <div className="text-[#14192C] font-[Montserrat] pl-[107px] absolute top-1/2 -translate-y-1/2">
            <p className="text-[20px] leading-[24px]">
              We sent a confirmation to
            </p>
            <p className="text-[20px] leading-[24px] font-semibold my-1">
              {email}
            </p>
            <p className="text-[20px] leading-[24px]">
              to verify it's really you.
            </p>
            <button
              className="text-[#0066FF] text-[20px] leading-[24px] font-[Montserrat] mt-6 hover:underline"
              onClick={() => setEmailSent(false)}
            >
              send again
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="w-1/2 relative">
        <div className="absolute w-full top-[120px] flex flex-col items-center">
          <h1 className="text-[36px] leading-[42px] font-black font-[Montserrat] text-[#14192C] text-center">
            Account recovery
          </h1>
          <p className="font-[Montserrat] font-bold text-[20px] leading-[24px] text-center text-[#14192C] mt-4 w-[333px]">
            Insert your email to<br />recover your password
          </p>
        </div>

        <div className="absolute w-full top-1/2 flex justify-center">
          <form className="w-full max-w-md px-8" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-3 py-2 border-b-2 outline-none placeholder-gray-400 ${
                  error ? 'border-red-500' : 'border-blue-600'
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && (
                <p className="absolute text-red-500 text-sm mt-1">*{error}*</p>
              )}
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-blue-600 text-white py-3 font-semibold rounded hover:bg-blue-700 transition"
            >
              RECOVER PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
