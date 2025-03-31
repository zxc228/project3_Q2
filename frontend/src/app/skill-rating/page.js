"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const skillList = [
  { name: "Data Mining", current: 5, medal: "" },
  { name: "Data Visualization", current: 4, medal: "" },
  { name: "Data Cleaning", current: 3.5, medal: "" },
  { name: "Python", current: 3, medal: "" },
  { name: "SQL", current: 3.5, medal: "" },
  { name: "Big Data Processing Framework", current: 2, medal: "" },
  { name: "Tableau", current: 3, medal: "" },
  { name: "Machine Learning", current: 3, medal: "" },
  { name: "Matlab", current: 2, medal: "" },
];

export default function SkillRatingPage() {
  const router = useRouter();
  const [localSkills, setLocalSkills] = useState(skillList);

  const handleSliderChange = (index, value) => {
    const updated = [...localSkills];
    updated[index].current = parseFloat(value);
    setLocalSkills(updated);
  };

  const handleMedalChange = (index, medal) => {
    const updated = [...localSkills];
    updated[index].medal = medal;
    setLocalSkills(updated);
  };

  const handleContinue = () => {
    router.push("/skill-justifications");
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative bg-white">
      <button
        className="absolute top-6 right-6 text-blue-600 text-2xl font-bold"
        onClick={() => router.push("/dashboard")}
      >
        ✕
      </button>

      <h2 className="text-xl sm:text-2xl font-semibold mb-8 text-gray-800">
        Field: <span className="text-blue-600">Data</span>
      </h2>

      <div className="flex justify-end text-sm font-semibold text-gray-700 pr-18 mb-2 gap-2">
        <span>Current level</span>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto x-full">
        {localSkills.map((skill, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-60 font-medium flex items-center gap-2">
              <select
                value={skill.medal}
                onChange={(e) => handleMedalChange(index, e.target.value)}
                className=" text-sm rounded-md px-1 py-[2px] focus:outline-blue-600"
              >
                <option value="">+</option>
                <option value="🥇">🥇</option>
                <option value="🥈">🥈</option>
                <option value="🥉">🥉</option>
              </select>
              <span>{skill.name}</span>
            </div>

            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={skill.current}
              onChange={(e) => handleSliderChange(index, e.target.value)}
              className="flex-1 h-2 appearance-none rounded-lg bg-gray-200 accent-blue-600"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                  (skill.current / 5) * 100
                }%, #e5e7eb ${(skill.current / 5) * 100}%, #e5e7eb 100%)`,
              }}
            />

            <div className="w-20 text-center font-semibold text-gray-800">
              {skill.current}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
        <button
          className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md"
          onClick={() => router.push("/job-or-internship")}
        >
          RETURN
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
          onClick={handleContinue}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
