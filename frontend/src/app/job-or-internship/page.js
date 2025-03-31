'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JobOrInternshipPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('INTERNSHIP');

  const handleContinue = () => {
    router.push('/skill-rating');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative bg-white">

      {/* Exit button */}
      <button
        className="absolute top-6 right-6 text-blue-600 text-2xl font-bold"
        onClick={() => router.push('/dashboard')}
      >
        ✕
      </button>

      {/* Question */}
      <h1 className="text-xl sm:text-2xl font-semibold text-center mb-10 text-gray-800">
        Are you looking for a job or an internship?
      </h1>

      {/* Option buttons */}
      <div className="flex gap-6 mb-16 flex-wrap justify-center">
        {['JOB', 'INTERNSHIP', "I'M NOT LOOKING"].map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`px-6 py-2 rounded-md border-2 font-semibold 
              ${selected === option
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-blue-600 text-blue-600'}`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Bottom navigation */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
        <button
          className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md"
          onClick={() => router.push('/')}
        >
          RETURN
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
          onClick={handleContinue}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
