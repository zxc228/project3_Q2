"use client";
import React from "react";
import { useState } from "react";

import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [selectedTrack, setSelectedTrack] = useState("DATA ANALYST");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("progress");

  const router = useRouter(); 

  const handleClick = () => {
    router.push('/app/main-self-assesment');
  };

  const careerTracks = ["I DON'T KNOW WHERE I WANT TO", "DATA", "WEB DEVELOPMENT", "CYBERSECURITY", "AI & MACHINE LEARNING"];
  const skills = [
    { name: "Data Mining", current: 5, desired: 5 },
    { name: "Data Visualization", current: 4, desired: 5 },
    { name: "Data Cleaning", current: 3.5, desired: 2 },
    { name: "Python", current: 3, desired: 3 },
    { name: "SQL", current: 3.5, desired: 4 },
    { name: "Big Data Processing Framework", current: 2, desired: 2 },
    { name: "Tableau", current: 3, desired: 3.5 },
    { name: "Machine Learning", current: 3, desired: 5 },
    { name: "Matlab", current: 2, desired: 3 },
  ];

  const [courses, setCourses] = useState([
    { id: 1, expanded: true },
    { id: 2, expanded: true },
  ]);
  
  

  return (
    <div className="flex min-h-screen bg-gray-100 text-blue-600">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-5 flex flex-col min-h-screen">
        <div className="text-lg font-bold mb-5">U-Tad</div>
        <nav className="flex-grow">
          <ul>
            <li className="mb-2 cursor-pointer">Profile</li>
            <li className="mb-2 cursor-pointer font-bold">Dashboard</li>
            <li className="mb-2 cursor-pointer">Career Roadmap</li>
          </ul>
        </nav>
        <button className="mt-auto border border-white px-4 py-2">Sign out</button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 relative">
         {/* Self Assessment placeholder */}
         <section className="bg-white p-6 shadow rounded mb-6">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Self-Assessment</h2>
            <button className="border px-4 py-2 rounded" onClick={handleClick}>Complete Self-Assessment</button>
          </div>
          <div className='mt-4'>
            <div className='bg-gray-200 p-4 rounded mb-2 flex justify-between items-center'>
              <div>
                <p className='font-semibold'>Self-Assessment Results</p>
                <p className='text-sm text-gray-600'>Date completed: 31/03/2025</p>
              </div>
              <div className='flex gap-2'>
                <button><span className='material-icons'>👁️</span></button>
                <button><span className='material-icons'>⬇️</span></button>
              </div>
            </div>
            <div className='bg-gray-200 p-4 rounded mb-4 flex justify-between items-center'>
              <div>
                <p className='font-semibold'>Self-Assessment Results</p>
                <p className='text-sm text-gray-600'>Date completed: 28/03/2025</p>
              </div>
              <div className='flex gap-2'>
                <button><span className='material-icons'>👁️</span></button>
                <button><span className='material-icons'>⬇️</span></button>
              </div>
            </div>
            <button className='mx-auto block border px-4 py-2 rounded bg-white'>See More</button>
          </div>
        </section>

        {/* Career Track and Skills */}
        <section className="bg-white p-6 shadow rounded mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              Career Track:
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {careerTracks.map((track) => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
            </h2>
            <button className="border px-4 py-2 rounded">Generate PDF</button>
          </div>
          <p className="text-sm text-gray-600 mb-4">You have an 80% for this career</p>
          <div>
            <h3 className="font-semibold mb-2">Skills</h3>
            <ul className="space-y-3">
              {skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="w-48">{skill.name}</span>
                  <div className="relative bg-gray-300 h-2 flex-1 rounded">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${(skill.current / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 mb-4">{skill.current} | {skill.desired}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        

        {/* Personal Progress Section */}
        <section className={`bg-white p-6 shadow rounded transition-all ${isExpanded ? "fixed inset-0 z-50 overflow-y-auto" : "mb-6"}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">{activeTab === "progress" ? "Personal Progress" : "Progress Review"}</h2>
              <div className="ml-4 bg-gray-200 rounded-full w-24 h-6 flex items-center">
                <div
                  onClick={() => setActiveTab("progress")}
                  className={`w-1/2 h-full flex justify-center items-center cursor-pointer rounded-full ${activeTab === "progress" ? "bg-black text-white" : ""}`}
                >
                  ●
                </div>
                <div
                  onClick={() => setActiveTab("review")}
                  className={`w-1/2 h-full flex justify-center items-center cursor-pointer rounded-full ${activeTab === "review" ? "bg-black text-white" : ""}`}
                >
                  ●
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsExpanded(!isExpanded==true)} className="text-2xl">⛶</button>
              <button className="text-2xl">➕</button>
              <button className="text-2xl">🗑️</button>
            </div>
          </div>

          {activeTab === "progress" ? (
            <div className="space-y-4">
              {/* First Course with Upload */}
              <div className="border p-4 rounded">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-semibold">NAME OF THE COURSE</p>
                    <p className="text-sm text-gray-600">LINK TO COURSE PLATFORM</p>
                  </div>
                  <button className="text-xl">▾</button>
                </div>
                <div className="bg-gray-200 h-32 flex items-center justify-center rounded mb-2">
                  <span className="text-sm">UPLOAD DIPLOMA</span>
                </div>
                <button className="w-full bg-gray-400 text-white py-2 rounded">SEND PROGRESS</button>
              </div>
              {/* Other Courses */}
              {courses.map((course, i) => (
                <div key={course.id} className="border p-4 rounded">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-semibold">NAME OF THE COURSE</p>
                      <p className="text-sm text-gray-600">LINK TO COURSE PLATFORM</p>
                    </div>
                    <button
                      className="text-xl"
                      onClick={() => {
                        const updated = [...courses];
                        updated[i].expanded = !updated[i].expanded;
                        setCourses(updated);
                      }}
                    >
                      {course.expanded ? "▴" : "▾"}
                    </button>
                  </div>
                  {course.expanded && i === 0 && (
                    <>
                      <div className="bg-gray-200 h-32 flex items-center justify-center rounded mb-2">
                        <span className="text-sm">UPLOAD DIPLOMA</span>
                      </div>
                      <button className="w-full bg-gray-400 text-white py-2 rounded">SEND PROGRESS</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((_, i) => (
                <div key={i} className="border p-4 rounded">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-semibold">NAME OF THE COURSE</p>
                      <p className="text-sm text-gray-600">LINK TO COURSE PLATFORM</p>
                      <p className="text-sm text-gray-600">DATE OF SUBMISSION</p>
                    </div>
                    <button className="text-xl">⬇️</button>
                  </div>
                  <button className="w-full bg-black text-white py-2 rounded">STATUS OF REVIEW</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
