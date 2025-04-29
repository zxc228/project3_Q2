"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StudentProfile() {
  const [userData, setUserData] = useState({
    name: "Nombre Apellidos",
    location: "Location",
    degree: "Degree",
    year: "Year",
    link: "mylink.com",
  });

  // name: English, level: B2
  const [languages, setLanguages] = useState([]);

  const [aboutMe, setAboutMe] = useState("");

  const skills = [
    "Data Mining",
    "Python",
    "CSS",
    "Web Design",
    "Javascript",
    "Data Cleaning",
  ];

  const skillPairs = [];
  for (let i = 0; i < skills.length; i += 2) {
    skillPairs.push([skills[i], skills[i + 1]]);
  }

  // title: Data Analyst Intern, company: Tech Company, date: July 2023 – present,
  // description: Lorem ipsum dolor sit amet consectetur.
  const [experience, setExperience] = useState([]);

  let CVUploaded = false;

  const profileSteps = [
    { label: "Step 1", completed: false },
    { label: "Step 2", completed: false },
    { label: "Step 3", completed: false },
    { label: "Step 4", completed: false },
    { label: "Step 5", completed: false },
  ];

  const cvInputRef = useRef(null);
  const academicInputRef = useRef(null);

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

  const handleSaveChanges = () => {
    // Save changes logic here, calling the route, Ilya your work!
    console.log("Changes saved:", userData, languages, aboutMe, experience);
  };

  // Calling this method will ask for database data
  const retrieveUserData = async () => {};

  // Calculate the completion percentage based on completed steps, user should have modified default values
  if (
    userData.name !== "Name Surname" &&
    userData.location !== "Location" &&
    userData.degree !== "Degree" &&
    userData.year !== "Year" &&
    userData.link !== "mylink.com"
  ) {
    profileSteps[0].completed = true;
    if (experience.length > 0) {
      profileSteps[1].completed = true;
      if (languages.length > 0) {
        profileSteps[2].completed = true;
        if (CVUploaded) {
          profileSteps[3].completed = true;
          if (description !== "") {
            profileSteps[4].completed = true;
          }
        }
      }
    }
  }

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
              className="relative text-white font-bold text-[18px] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-full flex items-center gap-2"
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
              className="relative text-white font-bold text-[18px] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-full flex items-center gap-2"
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
        <button className="text-white font-bold text-[18px] text-left">
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
                className="text-[21px] font-600 text-custom-utad-logo focus:outline-none"
                value={userData.location}
                placeholder="Madrid, Spain"
                onChange={(e) =>
                  setUserData({ ...userData, location: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col">
            <button className="border-2 border-custom-utad-logo text-custom-utad-logo font-bold px-10 py-2 rounded-md text-[18px]">
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
            <p className="font-bold text-[21px]">Improve your profile</p>
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
                  <p className="text-[16px] font-500">{step.label}</p>
                </div>
              ))}
            </div>
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
            <button
              className="bg-[#E5E9EC] items-center flex flex-col text-custom-utad-logo text-[18px] font-600 rounded-md py-6"
              onClick={uploadCV}
            >
              <Image src="/upload.png" width={35} height={46} alt="Upload CV" />
              <p className="mt-5">UPLOAD CV</p>
            </button>
            <button
              className="bg-[#E5E9EC] items-center flex flex-col text-custom-utad-logo text-[18px] font-600 rounded-md py-6"
              onClick={uploadAcademicRecord}
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

        <div className="mt-10 flex flex-col">
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
        </button>
      </div>
    </div>
  );
}
