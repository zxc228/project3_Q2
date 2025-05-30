"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Explanation from "@/components/Explanation";

export default function TutorProfile() {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [students, setStudents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [careerTracks, setCareerTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedFitness, setSelectedFitness] = useState("");
  const [skills, setSkills] = useState([]);

  const [isOpenExplanation, setIsOpenExplanation] = useState(false);
  const [positionExplanation, setPositionExplanation] = useState({
    top: 0,
    left: 0,
  });

  const handleToggleExplanation = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPositionExplanation({
      top: rect.bottom + window.scrollY - 600,
      left: rect.left + window.scrollX - 2400,
    });
    setIsOpenExplanation((prev) => !prev);
  };

  const loadDescription = async (careerTypeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `/api/careers/types/${careerTypeId}/description`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setSelectedDescription(data.description || "No description available.");
    } catch (err) {
      console.error("Failed to fetch description", err);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/tutors/all-students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(response.data);
        if (response.data.length > 0) {
          setSelectedStudent(response.data[0].profileId);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!selectedStudent) return;

      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `/api/careers/profiles/${selectedStudent}/recommendations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setRecommendations(data.topRecommendations || []);

        const trackNames = data.topRecommendations.map((r) => ({
          label: `${r.careerFieldName} (${r.careerType})`,
          id: r.careerTypeId,
        }));
        setCareerTracks(trackNames);

        if (trackNames.length > 0) {
          setSelectedTrack(trackNames[0].id);
          loadDescription(trackNames[0].id);

          const initial = data.topRecommendations[0];
          const firstFitness = Math.round((initial.fitnessScore / 5) * 100);
          setSelectedFitness(`${firstFitness}%`);

          const s = initial.skillAssessments.map((skill) => ({
            name: skill.skillName,
            current: skill.currentLevel,
            desired: skill.currentLevel + (skill.gap || 0),
          }));
          setSkills(s);
        }
      } catch (err) {
        console.error("Error loading recommendations", err);
      }
    };

    fetchRecommendations();
  }, [selectedStudent]);

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

      <div className="ml-[345px] w-full px-10 py-10">
        <section className="mb-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-[32px] font-bold">Career Recommendations</h1>
              <div className="mt-4">
                <label className="block text-[24px] font-bold mb-2">
                  Select Student:
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="focus:outline-none rounded px-3 py-2 text-[16px] font-bold text-custom-utad-logo"
                >
                  {students.map((student) => (
                    <option
                      key={student.profileId}
                      value={student.profileId}
                      className="text-[16px] font-bold text-custom-utad-logo"
                    >
                      {student.userId} — {student.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {recommendations.length > 0 && (
          <section className="bg-white p-6 border-2 border-custom-utad-logo rounded-lg mb-6">
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
                      setSelectedFitness(
                        `${Math.round((found.fitnessScore / 5) * 100)}%`
                      );
                      setSkills(
                        found.skillAssessments.map((skill) => ({
                          name: skill.skillName,
                          current: skill.currentLevel,
                          desired: skill.currentLevel + (skill.gap || 0),
                        }))
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
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  const student = students.find(
                    (s) => s.profileId === selectedStudent
                  );
                  const top = recommendations.find(
                    (r) => r.careerTypeId === selectedTrack
                  );

                  if (!token || !top || !student) {
                    alert("Missing required data for PDF generation");
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
                        topRecommendations: [top],
                        profileId: student.profileId,
                      }),
                    });

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${student.userId}_career_report.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("PDF generation failed:", err);
                    alert("Failed to generate PDF.");
                  }
                }}
                className="border px-4 py-2 rounded text-[16px] font-semibold"
              >
                Generate PDF
              </button>
            </div>

            <p className="text-[16px] font-normal text-[#383B42] mb-2">
              {selectedDescription}
            </p>
            <p className="text-[16px] font-normal text-[#383B42] mb-4">
              He/She are <strong>{selectedFitness}</strong> fit for this
              position.
            </p>
            <div className="flex justify-between mb-1">
              <p className="font-bold text-[24px] mb-2">Skills</p>
              <div className="flex items-center text-[16px] font-bold text-[#14192C]">
                Current level | Desired
                <div className="relative ml-2">
                  <button
                    onClick={handleToggleExplanation}
                    aria-label="Explanation"
                  >
                    <Image
                      src={"/svg/_/Big.svg"}
                      alt="Explanation"
                      width={20}
                      height={20}
                    />
                  </button>
                  <Explanation
                    isOpen={isOpenExplanation}
                    position={positionExplanation}
                  >
                    <h1 className="text-custom-black font-montserrat font-extrabold text-[28px]">
                      What do these values represent?
                    </h1>
                    <p className="text-custom-black font-normal font-montserrat text-[14px] mt-5">
                      <strong>Current level:</strong> Your current skill level
                      in this area.
                      <br />
                      <strong>Desired level:</strong> The level you should aim
                      for to be competitive in this field.
                      <br />
                      <strong>Fitness level:</strong> A percentage indicating
                      how well your skills match the requirements of the
                      position.
                    </p>
                  </Explanation>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              {skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div
                    className="w-72 font-normal text-[21px] text-[#14192C] flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    title={skill.name}
                  >
                    {/* Conditional SVG image icons */}
                    {skill.current === 5 && (
                      <img
                        src="/svg/Badge/Gold.svg"
                        alt="Expert"
                        className="w-10 h-10"
                      />
                    )}
                    {skill.current > 4 && skill.current < 5 && (
                      <img
                        src="/svg/Badge/Silver.svg"
                        alt="Advanced"
                        className="w-10 h-10"
                      />
                    )}
                    {skill.current >= 3 && skill.current <= 4 && (
                      <img
                        src="/svg/Badge/Bronze.svg"
                        alt="Intermediate"
                        className="w-10 h-10"
                      />
                    )}
                    <span className="truncate">{skill.name}</span>
                  </div>
                  <div className="relative bg-gray-200 h-3 flex-1 rounded">
                    <div
                      className="absolute top-[0px] w-3 h-3 bg-blue-700 rounded-full z-10"
                      style={{
                        left: `${(skill.current / 5) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    ></div>
                    <div
                      className="absolute top-[0px] w-3 h-3 bg-gray-300 rounded-full z-0"
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
                  <div className="w-20 text-[21px] font-normal text-[#14192C] text-right">
                    {skill.desired}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
