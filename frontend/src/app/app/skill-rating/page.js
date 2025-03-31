'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelfAssessment } from '@/context/SelfAssessmentContext';

const skillList= [
  { name: "Data Mining", current: 5},
  { name: "Data Visualization", current: 4},
  { name: "Data Cleaning", current: 3.5},
  { name: "Python", current: 3},
  { name: "SQL", current: 3.5},
  { name: "Big Data Processing Framework", current: 2},
  { name: "Tableau", current: 3},
  { name: "Machine Learning", current: 3},
  { name: "Matlab", current: 2},
  ];

  
export default function SkillRatingPage() {
  const router = useRouter();
  const { skills, setSkills } = useSelfAssessment();
  const [localSkills, setLocalSkills] = useState([]);

  useEffect(() => {
    if (skills.length > 0) {
      setLocalSkills(skills);
    } else {
      setLocalSkills(
        skillList.map((s) => ({
          name: s.name,
          desired: s.desired,
          current: s.current,
          medal: '',
        }))
      );
      
    }
  }, []);

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
    setSkills(localSkills);
    router.push('/skill-justifications');
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 relative bg-white">
      {/* Exit Button */}
      <button
        className="absolute top-6 right-6 text-blue-600 text-2xl font-bold"
        onClick={() => alert('Exit clicked')}
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-8 text-gray-800">
        Field: <span className="text-blue-600">Data</span>
      </h2>

      {/* Header */}
      <div className="flex justify-end text-sm font-semibold text-gray-700 pr-18 mb-2 gap-2">
        <span>Current level</span>
      </div>

      {/* Skills Section */}
      <div className="flex flex-col gap-6 overflow-y-auto">
        {localSkills.map((skill, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Skill name + Medal */}
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


            {/* Slider */}
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={skill.current}
              onChange={(e) => handleSliderChange(index, e.target.value)}
              className="w-260 h-2 appearance-none rounded-lg bg-gray-200 accent-blue-600"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                  (skill.current / 5) * 100
                }%, #e5e7eb ${(skill.current / 5) * 100}%, #e5e7eb 100%)`,
              }}
            />

            {/* Level Indicator */}
            <div className="w-20 text-center font-semibold text-gray-800">
              {skill.current}  {skill.desired}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
        <button
          className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md"
          onClick={() => router.push('/job-or-internship')}
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
