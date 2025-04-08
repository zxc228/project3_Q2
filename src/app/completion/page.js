"use client";

import { useRouter } from "next/navigation";

export default function CompletionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 relative">
      {/* Congratulations text */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-20">
        Congratulations!
        <br />
        You completed the self-assessment
      </h1>

      {/* Navigation buttons */}
      <div className="w-full max-w-xl flex justify-between items-center">
        <button
          onClick={() => router.push("/skill-justifications")}
          className="text-blue-600 font-bold text-sm uppercase"
        >
          GO BACK
        </button>

        <button
          onClick={() => {
            alert("Self-assessment submitted!");
            router.push("/dashboard");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-md text-sm uppercase"
        >
          SUBMIT SELF-ASSESSMENT
        </button>
      </div>
    </div>
  );
}
