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

  let CVUploaded = false;

  const cvInputRef = useRef(null);

  const uploadCV = () => {
    cvInputRef.current?.click();
  };

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    // Handle the CV upload logic here
  };

  const handleSaveChanges = () => {
    // Save changes logic here, calling the route, Ilya your work!
    console.log("Changes saved:", userData, languages, aboutMe);
  };

  // Calling this method will ask for database data
  const retrieveUserData = async () => {};

  return (
    <div className="flex h-screen font-montserrat">
      <aside className="bg-custom-utad-logo w-[345px] fixed h-full flex flex-col justify-between py-10 px-6">
        <div>
          <Image src="/u-tad-nobg.png" width={160} height={50} alt="Logo" />
          <nav className="mt-20 space-y-6 flex flex-col">
            <Link
              className="relative text-white font-bold text-[18px] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              href={"/student-profile"}
            >
              Profile
            </Link>
            <Link
              className="relative text-white font-bold text-[18px] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              href={"/dashboard"}
            >
              Dashboard
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
            placeholder="Teaching Degree"
            onChange={(e) =>
              setUserData({ ...userData, degree: e.target.value })
            }
          />
          <input
            className="focus:outline-none"
            value={userData.year}
            placeholder="Years of experience"
            onChange={(e) => setUserData({ ...userData, year: e.target.value })}
          />
          <input
            className="focus:outline-none"
            value={userData.link}
            placeholder="mylink.com"
            onChange={(e) => setUserData({ ...userData, link: e.target.value })}
          />
        </section>
        
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
            <button
              className="bg-[#E5E9EC] items-center flex flex-col text-custom-utad-logo text-[18px] font-600 rounded-md py-6"
              onClick={uploadCV}
            >
              <Image src="/upload.png" width={35} height={46} alt="Upload CV" />
              <p className="mt-5">UPLOAD CV</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
