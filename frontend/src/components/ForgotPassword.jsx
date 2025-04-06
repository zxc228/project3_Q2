
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
      <div className="flex min-h-screen">
        <div className="w-1/2 bg-blue-600 flex justify-center items-center">
          <Image src="/u-tad-logo.png" alt="U-tad logo" width={200} height={200} />
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center px-8">
          <h1 className="text-2xl font-bold mb-4">Account recovery</h1>
          <p className="text-center mb-2">
            We sent a confirmation to <br />
            <span className="font-semibold">{email}</span> <br />
            to verify it’s really you.
          </p>
          <button
            className="mt-4 text-blue-600 font-semibold hover:underline"
            onClick={() => setEmailSent(false)}
          >
            send again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-blue-600 flex justify-center items-center">
        <Image src="/u-tad-logo.png" alt="U-tad logo" width={200} height={200} />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center px-8">
        <h1 className="text-2xl font-bold mb-2">Account recovery</h1>
        <p className="text-center text-sm font-bold mb-4">
          Insert your email to recover your password
        </p>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
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
          {error && <p className="text-red-500 text-sm mt-1">*{error}*</p>}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 font-semibold rounded hover:bg-blue-700 transition"
          >
            RECOVER PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
}