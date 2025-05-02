"use client";
import { useState, React } from "react";

import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [selectedTrack, setSelectedTrack] = useState("DATA ANALYST");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("progress");

  const router = useRouter();

  const handleClick = () => {
    router.push("/assessment");
  };

  const careerTracks = [
    "I DON'T KNOW WHERE I WANT TO",
    "DATA",
    "WEB DEVELOPMENT",
    "CYBERSECURITY",
    "AI & MACHINE LEARNING",
  ];
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

  const aiCoachMessage = "With the help of AI Career Coach you will receive:\n- Generate a CV summary\n- Suggest best Career Paths\n- Suggest vital recommended skills to develop";

  const getPlatformImage = (url) => {
    if (!url) return "/default.png";
    const lower = url.toLowerCase();
    return "/default.png";
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100 text-blue-600">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-5 flex flex-col min-h-screen">
        <div className="text-lg font-bold mb-5">U-Tad</div>
        <nav className="flex-grow">
          <ul>
          <li 
              className="mb-2 cursor-pointer hover:underline"
              onClick={() => router.push("/student-profile")}
            >
              Profile
            </li>
            <li className="mb-2 cursor-pointer font-bold">Dashboard</li>  
          </ul>
        </nav>
        <button className="mt-auto border border-white px-4 py-2">
          Sign out
        </button>
      </aside> 

      {/* Main content */}
      <main className="flex-1 p-6 relative">

        {/* AI Career Coach Section */}
        <section className="bg-gray-200 p-6 shadow rounded mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-sm text-gray-900 font-semibold text-lg mb-2">AI Career Coach</h1>
              <p className="text-sm text-gray-600 whitespace-pre-line">{aiCoachMessage}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Make sure to have the latest version<br />of your CV in the Profile page</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                GENERATE CAREER ADVICE
              </button>
              <p className="text-sm text-red-500 mt-2">*Upload your CV in the Profile and try again*</p>
            </div>
          </div>
        </section>

        {/* Career Track and Skills */}
        <section className="bg-white p-6 shadow rounded mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg">Career Track:</h2>
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="border rounded px-2 py-1 text-blue-600 font-semibold"
              >
                {careerTracks.map((track) => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
            </div>
            <button className="border px-4 py-2 rounded text-sm font-semibold">Generate PDF</button>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            A data analyst collects, processes, and analyzes data to help organizations make informed decisions. They use tools and techniques to identify trends, patterns, and insights in data.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            If you enjoy working with numbers, problem-solving, and making sense of data, this field could be a great fit!
          </p>

          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold mb-1">Skills</h3>
            <div className="w-48 text-sm font-semibold text-gray-700 text-left">Current level | Desired</div>
          </div>

          <ul className="space-y-3">
            {skills.map((skill, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="w-48 font-medium text-sm text-blue-700">{skill.name}</span>

                <div className="relative bg-gray-200 h-3 flex-1 rounded">
                  <div
                    className="absolute top-[0px] w-3 h-3 bg-blue-700 rounded-full z-10"
                    style={{ left: `${(skill.current / 5) * 100}%`, transform: 'translateX(-50%)' }}
                  ></div>
                  <div
                    className="absolute top-[0px] w-3 h-3 bg-gray-300 rounded-full z-0"
                    style={{ left: `${(skill.desired / 5) * 100}%`, transform: 'translateX(-50%)' }}
                  ></div>
                </div>

                <div className="w-20 text-sm font-semibold text-gray-700 text-right">
                  {skill.current}
                </div>
                <div className="w-10 text-sm font-semibold text-gray-700 text-right">
                  |
                </div>
                <div className="w-20 text-sm font-semibold text-gray-700 text-center">
                  {skill.desired}
                </div>
              </li>
            ))}
          </ul>

          <p className="text-xs text-gray-500 mt-3">Improve a skill to level 3 to obtain a badge!</p>
        </section>


        {/* Self Assessment placeholder */}
        <section className="bg-white p-6 shadow rounded mb-6">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Self-Assessment</h2>
            <button onClick={handleClick} className="border px-4 py-2 rounded">Complete Self-Assessment</button>

          </div>
          <div className="mt-4">
            <div className="bg-gray-200 p-4 rounded mb-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">Self-Assessment Results</p>
                <p className="text-sm text-gray-600">
                  Date completed: 31/03/2025
                </p>
              </div>
              <div className="flex gap-2">
                <button>
                  <span className="material-icons">👁️</span>
                </button>
                <button>
                  <span className="material-icons">⬇️</span>
                </button>
              </div>
            </div>
            <div className="bg-gray-200 p-4 rounded mb-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">Self-Assessment Results</p>
                <p className="text-sm text-gray-600">
                  Date completed: 28/03/2025
                </p>
              </div>
              <div className="flex gap-2">
                <button>
                  <span className="material-icons">👁️</span>
                </button>
                <button>
                  <span className="material-icons">⬇️</span>
                </button>
              </div>
            </div>
            <button className="mx-auto block border px-4 py-2 rounded bg-white">
              See More
            </button>
          </div>
        </section>

        {/* Personal Progress Section */}
        <section
          className={`bg-white p-6 shadow rounded transition-all ${
            isExpanded ? "fixed inset-0 z-50 overflow-y-auto" : "mb-6"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col items-center gap-2 w-full">
              <h2 className="font-semibold">
                {activeTab === "progress" ? "Personal Progress" : "Progress Review"}
              </h2>
              <div
                className="relative w-40 h-8 bg-gray-300 rounded-full cursor-pointer"
                onClick={() => setActiveTab(activeTab === 'progress' ? 'review' : 'progress')}
              >
                <div
                  className={`absolute top-0 left-0 w-8 h-8 bg-blue-600 rounded-full shadow transform transition-transform duration-300 ${
                    activeTab === 'review' ? 'translate-x-32' : ''
                  }`}
                ></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newCourse = {
                    id: Date.now(),
                    name: "",
                    url: "",
                    description: "",
                    diploma: null,
                    date: new Date().toISOString().slice(0, 10),
                    expanded: true
                  };
                  setCourses([...courses, newCourse]);
                }}
                className="text-2xl text-blue-600"
              >
                ➕
              </button>
              <button
                onClick={() => {
                  const filtered = courses.slice(0, -1);
                  setCourses(filtered);
                }}
                className="text-2xl text-blue-600"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-2xl text-blue-600"
              >
                ⛶
              </button>
            </div>
          </div>

          {activeTab === "progress" ? (
            <div className="space-y-4">
              {courses.map((course, i) => (
                <div key={course.id} className="border p-4 rounded">
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={getPlatformImage(course.url)}
                      alt="platform"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={course.name || ""}
                        onChange={(e) => {
                          const updated = [...courses];
                          updated[i].name = e.target.value;
                          setCourses(updated);
                        }}
                        placeholder="Course Name"
                        className="font-semibold w-full outline-none"
                      />
                      <input
                        type="text"
                        value={course.url || ""}
                        onChange={(e) => {
                          const updated = [...courses];
                          updated[i].url = e.target.value;
                          setCourses(updated);
                        }}
                        placeholder="Link to course platform"
                        className="text-sm text-gray-600 w-full outline-none"
                      />
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
                  {course.expanded && (
                    <>
                      <textarea
                        value={course.description || ""}
                        onChange={(e) => {
                          const updated = [...courses];
                          updated[i].description = e.target.value;
                          setCourses(updated);
                        }}
                        placeholder="Briefly describe the course and what you learnt"
                        className="w-full p-2 border rounded mb-2"
                      ></textarea>
                      <label className="bg-gray-200 h-32 flex items-center justify-center rounded mb-2 cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const updated = [...courses];
                            updated[i].diploma = e.target.files[0];
                            setCourses(updated);
                          }}
                        />
                        <span className="text-sm">UPLOAD DIPLOMA</span>
                      </label>
                      <button className="w-full bg-gray-400 text-white py-2 rounded">
                        SEND PROGRESS
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course, i) => (
                <div key={course.id} className="border p-4 rounded">
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={getPlatformImage(course.url)}
                      alt="platform"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{course.name}</p>
                      <p className="text-sm text-gray-600">{course.url}</p>
                      <p className="text-sm text-gray-600">{course.date}</p>
                    </div>
                    {course.diploma && ( 
                      <a
                        href={URL.createObjectURL(course.diploma)}
                        download={`${course.name || 'diploma'}.pdf`}
                        className="text-xl"
                      > 
                      </a>
                    )}
                  </div>
                  
                  <button
                    className="w-full bg-black text-white py-2 rounded"
                    onClick={() => alert(course.description || "No description provided.")}
                  >
                    STATUS OF REVIEW
                  </button>
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
