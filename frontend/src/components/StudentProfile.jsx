"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Explanation from "./Explanation";
import jsPDF from "jspdf";

export default function StudentProfile() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);


  const comingSoon = () =>
  toast("Sorry, this feature is not available yet.", {
    position: "top-center",
  });

  const changesSaved = () =>
  toast.success("Changes saved!", {
    position: "top-center",
  });

  function getMedal(value) {
    if (value >= 4.5) return "/svg/Badge/medal-1.png";
    if (value >= 3.5) return "/svg/Badge/medal-2.png";
    if (value >= 2.5) return "/svg/Badge/medal-3.png";
    return "";
  }

  const [userData, setUserData] = useState({
    name: "Name Surnames",
    location: "Location",
    degree: "Degree you are studying",
    year: "Year of graduation",
    link: "mylink.com",
  });

  const [languages, setLanguages] = useState([]);
  const [aboutMe, setAboutMe] = useState("");
  const [experience, setExperience] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [token, setToken] = useState(null);

  const [profileSteps, setProfileSteps] = useState([
    { label: "Step 1", completed: false }, // Name and education
    { label: "Step 2", completed: false }, // About me
    { label: "Step 3", completed: false }, // Languages
    { label: "Step 4", completed: false }, // Upload CV
    { label: "Step 5", completed: false }, // Academic record
  ]);

  const handleHoverStart = () => {
    clearTimeout(hoverTimeout.current);
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false);
    }, 3000);
  };

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef(null);

  const cvInputRef = useRef(null);
  const academicInputRef = useRef(null);

  let CVUploaded = false;
  let AcademicRecordUploaded = false;

  const [isOpenExplanation, setIsOpenExplanation] = useState(false);
  const [positionExplanation, setPositionExplanation] = useState({
    top: 0,
    left: 0,
  });

  const handleToggleExplanation = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPositionExplanation({
      top: rect.bottom + window.scrollY - 400,
      left: rect.left + window.scrollX - 600,
    });
    setIsOpenExplanation((prev) => !prev);
  };

  const uploadCV = () => {
    cvInputRef.current?.click();
  };

  const uploadAcademicRecord = () => {
    academicInputRef.current?.click();
  };

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    // Handle the CV upload logic here
  };

  const handleAcademicChange = (e) => {
    const file = e.target.files[0];
    // Handle the academic record upload logic here
  };

  useEffect(() => {
    const storedProfileId = localStorage.getItem("profileId");
    const storedToken = localStorage.getItem("token");

    setProfileId(storedProfileId);
    setToken(storedToken);
  }, []);

  // Function to fetch profile data
  const retrieveUserData = async () => {
    try {
      const response = await fetch(`/api/profiles/profile/${profileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching profile data: ${response.statusText}`);
      }

      const data = await response.json();
      const profileData = data.profile.profile_data;

      setUserData(profileData.userData || {});
      setLanguages(profileData.languages || []);
      setAboutMe(profileData.aboutMe || "");
      setExperience(profileData.experience || []);
    } catch (error) {
      console.error(error);
    }
  };

  const [skills, setSkills] = useState([]);

  const retrieveSkills = async () => {
    try {
      const response = await fetch(`/api/skills/profiles/${profileId}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Response:", response);
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      // console.log("Skills API data:", data);
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (profileId && token) {
      retrieveUserData();
      retrieveSkills();
    }
  }, [profileId, token]);


  // Function to generate PDF
  const handleShareProfile = async () => {
    const doc = new jsPDF();

    let y = 15;

    // Section: Student Info
    doc.setFontSize(18);
    doc.setFont("montserrat", "bold");
    doc.text("Student Info", 10, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont("montserrat", "normal");
    doc.text(`Name: ${userData.name}`, 12, y);
    y += 7;
    doc.text(`Location: ${userData.location}`, 12, y);
    y += 7;
    doc.text(`Degree: ${userData.degree}`, 12, y);
    y += 7;
    doc.text(`Graduation Year: ${userData.year}`, 12, y);
    y += 15; // Extra margin

    // Section: About Me (blue box, rounded corners)
    doc.setFontSize(16);
    doc.setFont("montserrat", "bold");
    doc.text("About Me", 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("montserrat", "normal");
    // Calculate text lines and dynamic height
    const aboutMeLines = doc.splitTextToSize(aboutMe || "-", 180);
    const aboutMeHeight = aboutMeLines.length * 7 + 6; // 7 is line height, 6 is padding

    doc.setDrawColor(37, 99, 235); // Tailwind blue-600
    doc.roundedRect(10, y, 190, aboutMeHeight, 4, 4, "S");
    doc.text(aboutMeLines, 14, y + 7);

    y += aboutMeHeight + 14; // Move y for next section

    // Section: Languages
    doc.setFontSize(16);
    doc.setFont("montserrat", "bold");
    doc.text("Languages", 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("montserrat", "normal");
    if (languages.length === 0) {
      doc.text("- None", 12, y);
      y += 8;
    } else {
      languages.forEach((lang) => {
        doc.text(`- ${lang.name || ""} (${lang.level || ""})`, 12, y);
        y += 7;
      });
    }
    y += 10; // Extra margin

    // Section: Skills (badge, name, level columns)
    doc.setFontSize(16);
    doc.setFont("montserrat", "bold");
    doc.text("Skills", 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("montserrat", "normal");

    if (skills.length === 0) {
      doc.text("- None", 12, y);
    } else {
      // Loading badge paths
      const badgePaths = [
        "/svg/Badge/medal-1.png",
        "/svg/Badge/medal-2.png",
        "/svg/Badge/medal-3.png",
      ];

      const fetchBadgeBase64 = async (path) => {
        const res = await fetch(path);
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      };

      // Load all badge images
      const badgeImagesMap = {};
      for (const path of badgePaths) {
        badgeImagesMap[path] = await fetchBadgeBase64(path);
      }

      // Table headers
      doc.setFont("montserrat", "bold");
      doc.text("Badge", 20, y);
      doc.text("Skill", 50, y);
      doc.text("Level", 170, y);
      doc.setFont("montserrat", "normal");
      y += 6;

      skills.forEach((skill) => {
        const badgePath = getMedal(Number(skill.skilllevel || 0));
        if (badgePath) {
          doc.addImage(badgeImagesMap[badgePath], "PNG", 15, y - 4, 8, 8);
        }
        doc.text(`${skill.skillname || skill.name || ""}`, 50, y + 2);
        doc.text(`${skill.skilllevel || 0}`, 170, y + 2);
        y += 12;
      });
    }

    doc.save("student-profile.pdf");
  };

  // Function to save profile changes
  const handleSaveChanges = async () => {
    const profileData = {
      userData,
      languages,
      aboutMe,
      experience,
    };

    try {
      const response = await fetch(
        `/api/profiles/profile/${profileId}/profile-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating profile data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Profile updated successfully:", data);
      changesSaved();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (profileId && token) {
      retrieveUserData();
    }
  }, [profileId, token]);

  useEffect(() => {
    const conditions = [
      userData.name !== "Name Surnames" &&
        userData.location !== "Location" &&
        userData.degree !== "Degree you are studying" &&
        userData.year !== "Year of graduation" &&
        userData.link !== "mylink.com",

      aboutMe.trim() !== "",

      languages.length > 0,

      CVUploaded,

      AcademicRecordUploaded,
    ];
    const completedCount = conditions.filter(Boolean).length;

    const updatedSteps = profileSteps.map((step, index) => ({
      ...step,
      completed: index < completedCount,
    }));

    setProfileSteps(updatedSteps);
  }, [userData, aboutMe, languages, CVUploaded, AcademicRecordUploaded]);

  // Completion stats
  const completedCount = profileSteps.filter((s) => s.completed).length;
  const completionPercentage = Math.round(
    (completedCount / profileSteps.length) * 100
  );

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

      <div className="ml-[345px] w-full px-10 py-10">
        <section className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-gray-200 p-4 rounded-lg">
              <Image
                src="/default-icon.png"
                width={80}
                height={80}
                alt="Avatar"
              />
            </div>
            <div className="flex flex-col">
              <input
                className="text-[32px] font-bold w-[600px] focus:outline-none"
                value={userData.name}
                placeholder="Name Surnames"
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
              <input
                className="text-[21px] font-semibold text-custom-utad-logo focus:outline-none"
                value={userData.location}
                placeholder="Madrid, Spain"
                onChange={(e) =>
                  setUserData({ ...userData, location: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col">
            <button className="border-2 border-custom-utad-logo text-custom-utad-logo font-bold px-10 py-2 rounded-md text-[18px] mt-5"
            onClick={handleShareProfile}>
              SHARE PROFILE
            </button>
            <button
              className="border-2 border-custom-utad-logo text-custom-utad-logo font-bold px-10 py-2 rounded-md text-[18px] mt-5"
              onClick={handleSaveChanges}
            >
              SAVE CHANGES
            </button>
          </div>
        </section>

        <section className="space-y-1 text-custom-gray text-[21px] font-bold mb-10 flex flex-col">
          <input
            className="focus:outline-none"
            value={userData.degree}
            placeholder="B.S. Computer Science"
            onChange={(e) =>
              setUserData({ ...userData, degree: e.target.value })
            }
          />
          <input
            className="focus:outline-none"
            value={userData.year}
            placeholder="2025 (Year 4)"
            onChange={(e) => setUserData({ ...userData, year: e.target.value })}
          />
          <input
            className="focus:outline-none"
            value={userData.link}
            placeholder="mylink.com"
            onChange={(e) => setUserData({ ...userData, link: e.target.value })}
          />
        </section>

        <div className="mb-10 p-6 border rounded-md border-custom-utad-logo">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <p className="font-bold text-[21px]">Improve your profile</p>
              <div className="relative inline-block">
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
                    Steps needed to improve your profile
                  </h1>
                  <p className="text-custom-black font-normal font-montserrat text-[14px] mt-5">
                    <strong>Step 1:</strong> Fill your name and education
                    <br />
                    <strong>Step 2:</strong> Fill your about me section
                    <br />
                    <strong>Step 3:</strong> Fill your languages spoken
                    <br />
                    <strong>Step 4:</strong> Upload your CV
                    <br />
                    <strong>Step 5:</strong> Upload your academic record
                  </p>
                </Explanation>
              </div>
            </div>
            <p className="font-bold text-[21px]">
              Completed {completionPercentage}%
            </p>
          </div>

          <div className="w-full flex flex-col items-center">
            <div className="flex items-center w-full justify-between relative">
              {profileSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="relative z-10 flex flex-col items-center w-10">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        step.completed ? "bg-custom-utad-logo" : "bg-gray-300"
                      }`}
                    />
                  </div>
                  {index < profileSteps.length - 1 && (
                    <div className="flex-grow h-1 bg-black mx-1 relative top-1/2 transform -translate-y-1/2">
                      <div
                        className={`w-full h-full ${
                          profileSteps[index + 1].completed
                            ? "bg-custom-utad-logo"
                            : "bg-custom-gray"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between w-full mt-2">
              {profileSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <p className="text-[16px] font-normal text-[#14192C]">
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
              Steps needed to improve your profile
            </h1>
            <p className="text-custom-black font-normal font-montserrat text-[14px] mt-5">
              <strong>Step 1:</strong> Fill your name and education
              <br />
              <strong>Step 2:</strong> Fill your about me section
              <br />
              <strong>Step 3:</strong> Fill your languages spoken
              <br />
              <strong>Step 4:</strong> Upload your CV
              <br />
              <strong>Step 5:</strong> Upload your academic record
            </p>
          </Explanation>
        </div>

        <div className="mt-10 w-full border rounded-md p-4 border-custom-utad-logo">
          <p className="font-bold mb-4 text-[21px] text-custom-gray">
            About me...
          </p>
          <div className="text-[18px] font-400">
            <textarea
              className="w-full focus:outline-none resize-none"
              rows={5}
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Write something about yourself..."
            />
          </div>
        </div>

        <div className="mt-10 flex gap-6">
          <div className="w-1/4 border rounded-md p-4 border-custom-utad-logo">
            <p className="font-bold mb-4 text-[28px]">I speak...</p>
            {languages.map((lang, index) => (
              <div key={index} className="mb-4">
                <input
                  className="font-bold text-[24px] w-full border-b border-gray-300 focus:outline-none mb-1"
                  placeholder="Language"
                  value={lang.name}
                  onChange={(e) => {
                    const updated = [...languages];
                    updated[index].name = e.target.value;
                    setLanguages(updated);
                  }}
                />
                <input
                  className="text-[16px] font-bold text-custom-gray w-full border-b border-gray-300 focus:outline-none"
                  placeholder="Level (e.g. B2)"
                  value={lang.level}
                  onChange={(e) => {
                    const updated = [...languages];
                    updated[index].level = e.target.value;
                    setLanguages(updated);
                  }}
                />
                <button
                  className="text-red-500 mt-1 text-sm font-bold"
                  onClick={() => {
                    const updated = languages.filter((_, i) => i !== index);
                    setLanguages(updated);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              className="mt-2 text-custom-utad-logo font-bold text-[18px]"
              onClick={() =>
                setLanguages([...languages, { name: "", level: "" }])
              }
            >
              + Add language
            </button>
          </div>

          <div className="border border-custom-utad-logo rounded-md p-4 w-3/4 flex flex-col gap-4">
           
            <input
              type="file"
              ref={cvInputRef}
              onChange={handleCVChange}
              className="hidden"
            />
            <input
              type="file"
              ref={academicInputRef}
              onChange={handleAcademicChange}
              className="hidden"
            />

            {/* UPLOAD CV */}
            <button
              onClick={comingSoon}
              title="Coming soon"
              className="bg-[#E5E9EC] items-center flex flex-col text-custom-utad-logo
                        text-[18px] font-600 rounded-md py-6 opacity-50 cursor-not-allowed"
            >
              <Image src="/upload.png" width={35} height={46} alt="Upload CV" />
              <p className="mt-5">UPLOAD CV</p>
            </button>

            {/* UPLOAD ACADEMIC RECORD */}
            <button
              onClick={comingSoon}
              title="Coming soon"
              className="bg-[#E5E9EC] items-center flex flex-col text-custom-utad-logo
                        text-[18px] font-600 rounded-md py-6 opacity-50 cursor-not-allowed"
            >
              <Image
                src="/upload.png"
                width={35}
                height={46}
                alt="Upload Academic Record"
              />
              <p className="mt-5">UPLOAD ACADEMIC RECORD</p>
            </button>
          </div>
        </div>

        {/* <div className="mt-10 flex flex-col">
          <div className="w-full border rounded-md p-4 border-custom-utad-logo">
            <p className="font-bold mb-4 text-[28px]">Skills</p>
            <div className="flex flex-col gap-4">
              {skillPairs.map((pair, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <Image
                    src={`svg/Badge/medal-${(idx % 3) + 1}.svg`}
                    width={70}
                    height={70}
                    alt="Skill badge"
                  />
                  <div className="flex flex-col gap-2 w-full">
                    {pair.map((skill, subIdx) => (
                      <p
                        key={subIdx}
                        className="text-[15px] bg-[#E5E9EC] py-[12px] px-[40px] rounded-md w-full text-center"
                      >
                        {skill}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full border rounded-md p-4 mt-10 border-custom-utad-logo">
            <p className="font-bold mb-4 text-[28px]">Experience & education</p>
            {experience.map((job, index) => (
              <div key={index} className="mb-6">
                <input
                  className="text-[24px] font-bold w-full mb-1 border-b border-gray-300 focus:outline-none"
                  placeholder="Job Title"
                  value={job.title}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[index].title = e.target.value;
                    setExperience(updated);
                  }}
                />
                <input
                  className="text-[18px] font-bold text-custom-gray w-full mb-1 border-b border-gray-300 focus:outline-none"
                  placeholder="Company"
                  value={job.company}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[index].company = e.target.value;
                    setExperience(updated);
                  }}
                />
                <input
                  className="text-[14px] text-custom-gray font-400 w-full mb-1 border-b border-gray-300 focus:outline-none"
                  placeholder="Date (e.g. July 2023 – present)"
                  value={job.date}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[index].date = e.target.value;
                    setExperience(updated);
                  }}
                />
                <textarea
                  className="text-[18px] font-400 w-full border border-gray-300 p-2 rounded-md focus:outline-none resize-none"
                  rows={4}
                  placeholder="Description"
                  value={job.description}
                  onChange={(e) => {
                    const updated = [...experience];
                    updated[index].description = e.target.value;
                    setExperience(updated);
                  }}
                />
                <button
                  className="text-red-500 mt-2 text-sm font-bold"
                  onClick={() => {
                    const updated = experience.filter((_, i) => i !== index);
                    setExperience(updated);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              className="mt-4 text-custom-utad-logo font-bold text-[18px]"
              onClick={() =>
                setExperience([
                  ...experience,
                  { title: "", company: "", date: "", description: "" },
                ])
              }
            >
              + Add experience
            </button>
          </div>
        </div>
        <button className="bg-custom-utad-logo text-[#E5E9EC] font-bold px-10 py-4 rounded-md text-[28px] mt-10 w-full mb-10">
          Improve your profile
        </button> */}
        <div className="mt-10 w-full border rounded-md p-6 border-dashed border-gray-400 text-center">
          <p className="text-[22px] font-bold text-gray-500 mb-2">
            Additional profile sections coming soon
          </p>
          <p className="text-gray-500 text-[16px]">
            Skills, experience, and more will be available in upcoming updates.
          </p>
        </div>
      </div>
    </div>
  );
}
