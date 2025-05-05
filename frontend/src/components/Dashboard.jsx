"use client";
import { useState, React, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Explanation from "./Explanation";

const Dashboard = () => {
  const [selectedTrack, setSelectedTrack] = useState("DATA ANALYST");

  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedFitness, setSelectedFitness] = useState("");

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef(null);

  const loadDescription = async (careerTypeId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No auth token found");
      setSelectedDescription("No description available.");
      return;
    }

    try {
      const res = await fetch(
        `/api/careers/types/${careerTypeId}/description`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setSelectedDescription(data.description || "No description available.");
    } catch (err) {
      console.error("Failed to fetch description", err);
      setSelectedDescription("No description available.");
    }
  };

  const handleGeneratePDF = async () => {
    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId");
    const track = recommendations.find((r) => r.careerTypeId === selectedTrack);

    if (!token || !track || !profileId) {
      toast.error("Missing token, selected track, or profile ID");
      return;
    }

    try {
      const response = await fetch("/api/careers/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topRecommendations: [track],
          profileId: profileId,
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${track.careerFieldName}_${track.careerType}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF.");
    }
  };

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);

  const handleClick = () => {
    router.push("/assessment");
  };

  const [careerTracks, setCareerTracks] = useState([]);
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId");

    if (!token) {
      router.push("/");
      return;
    }
    console.log("profileId", profileId);
    fetch(`/api/careers/profiles/${profileId}/recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const top = data.topRecommendations;

        setRecommendations(top);

        const trackNames = top.map((r) => ({
          label: `${r.careerFieldName} (${r.careerType})`,
          id: r.careerTypeId,
        }));
        setCareerTracks(trackNames);
        setSelectedTrack(trackNames[0].id);

        loadDescription(trackNames[0].id);

        const firstFitness = Math.round((top[0].fitnessScore / 5) * 100);
        setSelectedFitness(`${firstFitness}%`);
        const initial = top.find((r) => r.careerFieldName === trackNames[0]);
        if (initial) {
          const s = initial.skillAssessments.map((skill) => ({
            name: skill.skillName,
            current: skill.currentLevel,
            desired: skill.currentLevel + (skill.gap || 0),
          }));
          setSkills(s);
        }
      })
      .catch(console.error);
  }, []);

  const aiCoachLines = [
    "Generate a CV summary",
    "Suggest best Career Paths",
    "Suggest vital recommended skills to develop",
  ];

  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("Choose CV file");

  const handleSenenFeature = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (
      !fileInputRef.current ||
      !fileInputRef.current.files[0] ||
      !userId ||
      !token
    ) {
      toast.error("Missing file, userId or token");
      return;
    }

    // Get email from backend first
    const emailRes = await fetch("/api/profiles/user/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    const emailData = await emailRes.json();
    if (!emailRes.ok || !emailData.email) {
      toast.error("Failed to fetch email");
      return;
    }

    const formData = new FormData();
    formData.append("cv", fileInputRef.current.files[0]);
    formData.append("email", emailData.email);

    try {
      const response = await fetch("http://138.68.126.118:3000/api/cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Upload failed: ${errorText}`);
      } else {
        toast.success(
          "CV uploaded successfully! Check your email for results in a while."
        );
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  const handleHoverStart = () => {
    clearTimeout(hoverTimeout.current);
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 3000);
  };

  return (
    <div className="flex h-screen font-montserrat">
      <aside className="bg-custom-utad-logo w-[345px] fixed h-full flex flex-col justify-between py-10 px-6">
        <div>
          <Image src="/u-tad-nobg.png" width={160} height={50} alt="Logo" />
          <nav className="mt-20 space-y-6 flex flex-col">
            <Link
              className="relative text-white font-bold text-[18px] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-full flex items-center gap-2"
              href={"/student-profile"}
            >
              <Image
                src={"/svg/Profile.svg"}
                width={25}
                height={25}
                alt="Profile Link"
              />
              <span>Profile</span>
            </Link>
            <Link
              className="relative text-white font-bold text-[18px] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-full flex items-center gap-2"
              href={"/dashboard"}
            >
              <Image
                src={"/svg/Dashboard.svg"}
                width={25}
                height={25}
                alt="Dashboard Link"
              />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          className="relative text-white font-bold text-[18px] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-full flex items-center gap-2"
        >
          <Image
            src={"/svg/SignOut.svg"}
            width={25}
            height={25}
            alt="Sign Out"
          />
          Sign out
        </button>
      </aside>

      <main className="ml-[345px] w-full px-10 py-10">

        <section className="bg-white p-6 rounded-lg mb-6 border-2 border-custom-utad-logo">
          <div className="flex justify-between items-center">
            <h2 className="text-[28px] font-extrabold text-[#14192C]">
              Self-Assessment
            </h2>
            <button
              onClick={handleClick}
              className="w-[400px] h-[60px] py-[18px] px-[64px] bg-custom-utad-logo text-white font-montserrat font-bold text-[14px] rounded-md text-center flex justify-center items-center"
            >
              COMPLETE SELF-ASSESMENT
            </button>
            {/* 
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
            </div> */}
            {/* <button className="mx-auto block border px-4 py-2 rounded bg-white">
              See More
            </button> */}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg mb-6 border-2 border-custom-utad-logo mt-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[28px] font-extrabold">Career Track:</h2>
              <select
                value={selectedTrack}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedTrack(selectedId);
                  loadDescription(selectedId);

                  const found = recommendations.find(
                    (r) => r.careerTypeId === selectedId
                  );
                  if (found) {
                    const newSkills = found.skillAssessments.map((skill) => ({
                      name: skill.skillName,
                      current: skill.currentLevel,
                      desired: skill.currentLevel + (skill.gap || 0),
                    }));
                    setSkills(newSkills);
                    setSelectedFitness(
                      `${Math.round((found.fitnessScore / 5) * 100)}%`
                    );
                  }
                }}
                className="text-blue-600 font-black text-[28px]"
              >
                {careerTracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGeneratePDF}
              className="border px-4 py-2 rounded text-[16px] font-semibold"
            >
              Generate PDF
            </button>
          </div>

          <p className="text-[16px] font-normal text-[#383B42] mb-2">
            {selectedDescription}
          </p>
          <p className="text-[16px] font-normal text-[#383B42] mb-4">
            You are {selectedFitness} fit for this position.
          </p>

          <button
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            aria-label="Explanation"
          >
            <Image
              src={"/svg/_/Big.svg"}
              alt="Explanation"
              width={20}
              height={20}
            />
          </button>
          <Explanation isOpen={isHovered} hoverTimeout={hoverTimeout}>
            <h1 className="text-custom-black font-montserrat font-extrabold text-[28px]">
              What do these values represent?
            </h1>
            <p className="text-custom-black font-normal font-montserrat text-[14px] mt-5">
              <strong>Current level:</strong> Your current skill level in this
              area.
              <br />
              <strong>Desired level:</strong> The level you should aim for to be
              competitive in this field.
              <br />
              <strong>Fitness level:</strong> Shows how fit you are for this position. 
              Calculated based on the skills that are not yet on or above the desired level.
            </p>
          </Explanation>

          <div className="flex justify-between mb-1">
            <p className="font-bold text-[24px] mb-2">Skills</p>
            <div className="flex items-center text-[16px] font-bold text-[#14192C]">
              Current level | Desired
            </div>
          </div>

          <ul className="space-y-3">
            {skills.map((skill, i) => (
              <li key={i} className="flex items-center gap-4">
                <span className="w-48 font-normal text-[21px] text-[#14192C]">
                  {skill.name}
                </span>

                <div className="relative bg-gray-200 h-3 flex-1 rounded">
                  <div
                    className="absolute top-[0px] w-3 h-3 bg-blue-700 rounded-full z-10"
                    style={{
                      left: `${(skill.current / 5) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                  <div
                    className="absolute top-[0px] w-3 h-3 bg-gray-400 rounded-full z-0"
                    style={{
                      left: `${(skill.desired / 5) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                </div>

                <div className="w-20 text-[21px] font-normal text-[#14192C] text-right">
                  {skill.current}
                </div>
                <div className="w-10 text-[21px] font-normal text-[#14192C] text-right">
                  |
                </div>
                <div className="w-20 text-[21px] font-normal text-[#14192C] text-center">
                  {skill.desired}
                </div>
              </li>
            ))}
          </ul>

          {/* <p className="text-xs text-gray-500 mt-3">Improve a skill to level 3 to obtain a badge!</p> */}
        </section>

        <section className="bg-[#E5E9EC] p-5 rounded-lg mt-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-[28px] text-[#14192C] font-extrabold">
                AI Career Coach
              </h1>
              <p className="text-[16px] text-[#14192C] font-normal mt-7">
                With the help of our extra feature, AI Career Coach, you will receive:
              </p>
              <ul className="list-disc pl-6 text-[16px] text-[#14192C] font-normal">
                {aiCoachLines.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="text-center mr-40 w-1/5">
              <p className="text-[14px] text-[#14192C] font-normal">
                Input your CV here
              </p>
              <div className="flex flex-col">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setSelectedFileName(e.target.files[0].name);
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-[14px] font-normal text-blue-600 underline"
                >
                  {selectedFileName}
                </button>
                <button
                  onClick={handleSenenFeature}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-[14px] font-bold hover:bg-blue-700 transition"
                >
                  GENERATE CAREER ADVICE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/*<section className="bg-white p-6 rounded-lg mb-6 border-2 border-custom-utad-logo mt-10">
          <div className="flex justify-between items-center">
            <h2 className="text-[28px] font-extrabold text-[#14192C]">
              Academic Record Assessment
            </h2>
            <button className="w-[400px] h-[60px] py-[18px] px-[64px] bg-custom-utad-logo text-white font-montserrat font-bold text-[14px] rounded-md text-center flex justify-center items-center">
              COMPLETE ACADEMIC RECORD ASSESSMENT
            </button>
          </div>
        </section>*/}

        {/* Personal Progress Section
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
        </section> */}
        {/* Placeholder for upcoming features */}
        <section className="bg-gray-100 p-6 shadow rounded border border-dashed border-gray-400 mt-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-500 mb-2">
              Further development in progress...
            </h2>
            <p className="text-gray-500">
              This section will include Personal Progress tracking, course
              uploads, and status reviews. Stay tuned!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
