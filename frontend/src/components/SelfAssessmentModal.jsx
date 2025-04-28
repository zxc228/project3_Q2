"use client";

import React, { useState } from "react";
import skillsData from "../app/app/Research.json"; // Adjust path as needed

const SelfAssessmentModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [careerField, setCareerField] = useState("");
  const [jobType, setJobType] = useState(""); // 'JOB', 'INTERNSHIP', or 'NOT_LOOKING'
  const [userSkills, setUserSkills] = useState([]);
  const [submittedDiplomas, setSubmittedDiplomas] = useState([]);
  const [pendingDiplomaFile, setPendingDiplomaFile] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!isOpen) return null;

  const getSkillsFromJson = (careerField, type) => {
    if (
      skillsData.career_fields[careerField] &&
      skillsData.career_fields[careerField][type]
    ) {
      return Object.entries(skillsData.career_fields[careerField][type]).map(
        ([name, expected]) => ({ name, expected_level: expected, value: 0, file: null })
      );
    }
    return [];
  };

  const handleContinueToStep3 = () => {
    const pathMap = {
      JOB: "Job",
      INTERNSHIP: "Internship"
    };
  
    const path = pathMap[jobType];
    if (careerField && path) {
      const extracted = getSkillsFromJson(careerField, path);
      setUserSkills(extracted);
      setStep(3);
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[1012px] h-[522px] rounded-[14.24px] border-2 border-blue-500 shadow-xl relative p-10 flex flex-col justify-between">

        {/* Close Button */}
        <button
        onClick={() => setShowExitConfirm(true)}
        className="absolute top-4 right-6 text-blue-500 text-2xl font-bold"
        >✕</button>


        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto">
            <h2 className="text-center text-lg md:text-2xl font-semibold text-black mb-10">
              What Career Field do you want <br /> to specialize in?
            </h2>

            <select
              value={careerField}
              onChange={(e) => setCareerField(e.target.value)}
              className="w-full border border-blue-500 text-blue-500 py-2 px-4 rounded mb-10"
            >
              <option value="">Select a field</option>
              {Object.keys(skillsData.career_fields).map((field) => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>

            <div className="w-full flex justify-end">
              <button
                className="bg-blue-500 text-white py-2 px-6 rounded text-sm font-semibold"
                onClick={() => setStep(2)}
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}
        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col justify-between w-full h-full">
            <div className="text-center mt-10">
              <h2 className=" text-center p-12 text-lg md:text-2xl font-semibold text-black mb-10">
                Are you looking for a job or an internship?
              </h2>

              <div className="flex justify-center gap-4 mb-10">
                {["JOB", "INTERNSHIP", "I'M NOT LOOKING"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setJobType(type)}
                    className={`px-4 py-2 rounded border font-semibold ${
                      jobType === type
                        ? "bg-blue-600 text-white"
                        : "border-blue-600 text-blue-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between w-full px-2">
              <button
                onClick={() => setStep(1)}
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
              >
                RETURN
              </button>
              
              <button
                className="bg-blue-600 text-white py-2 px-6 rounded text-sm font-semibold"
                onClick={handleContinueToStep3}
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}
        {/* STEP 3 */}
        {step === 3 && (
          <div className="flex flex-col justify-between h-full w-full overflow-auto scrollbar-hide">
            <div>
              <h2 className="text-xl font-bold text-black mb-6">Field: {careerField}</h2>
              <div className="grid grid-cols-3 gap-x-6 text-sm font-semibold text-gray-600 mb-2">
                <span></span>
                <span>             </span>
                <span className="text-right text-black font-semibold">Current Level</span>
              </div>

              {userSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => document.getElementById(`file-${index}`).click()}
                    className="text-gray-300 hover:text-gray-700 text-xl w-6"
                    title="Upload certificate"
                  >
                    +
                  </button>
                  <span className="w-48 font-medium text-black">{skill.name}</span>
                  <div className="flex-1 relative bg-gray-300 h-5 rounded-full">
                    <div
                      className="absolute top-[-6px]"
                      style={{
                        left: `${(skill.value / 5) * 100}%`,
                        transform: "translate(10%, 50%)",
                      }}
                    >
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={skill.value}
                      onChange={(e) => {
                        const updated = [...userSkills];
                        updated[index].value = parseFloat(e.target.value);
                        setUserSkills(updated);
                      }}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className=" w-8 text-right text-black font-semibold">{skill.value}</span>
                  <input
                    type="file"
                    id={`file-${index}`}
                    onChange={(e) => {
                      const updated = [...userSkills];
                      updated[index].file = e.target.files[0];
                      setUserSkills(updated);
                    }}
                    className="hidden"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded font-semibold"
              >
                RETURN
              </button>

              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                onClick={() => setStep(4)}
              >
                NEXT
              </button>
            </div>
          </div>
        )}
{/* STEP 4 */}
{step === 4 && (
  <div className="flex flex-col gap-4 h-full w-full overflow-auto scrollbar-hide">
    <h2 className="text-center text-lg md:text-2xl font-semibold text-black mb-4">
      Add skill justifications
    </h2>

    {/* Justification Input Form (Single) */}
    <div className="border rounded-xl p-4 shadow bg-white relative">
      <div className="flex justify-between items-center">
        <span className="font-bold text-sm text-gray-800">NAME OF THE COURSE</span>
      </div>

      <input
        type="text"
        placeholder="Website"
        id="new-website"
        className="w-full border-b border-blue-500 py-1 mt-2 mb-4 outline-none text-sm"
      />
      <input
        type="text"
        placeholder="Briefly describe this course and what you learned"
        id="new-description"
        className="w-full border-b border-blue-500 py-1 mb-4 outline-none text-sm"
      />

      <div className="bg-gray-200 rounded-md h-32 flex items-center justify-center mb-4 cursor-pointer">
        <label htmlFor="new-upload" className="cursor-pointer text-center text-gray-600">
          ⬆️ <br />
          UPLOAD DIPLOMA
        </label>
        <input
  type="file"
  id="new-upload"
  className="hidden"
  onChange={(e) => {
    if (e.target.files.length > 0) {
      setPendingDiplomaFile(e.target.files[0]);
    }
  }}
/>

      </div>

      <button
        className="bg-blue-500 text-white px-4 py-1 rounded text-sm mx-auto block"
        onClick={() => {
          const fileInput = document.getElementById("new-upload");
          const website = document.getElementById("new-website").value;
          const description = document.getElementById("new-description").value;
          const file = fileInput.files[0];

          if (website && description && file) {
            setSubmittedDiplomas(prev => [...prev, { website, description, file }]);

            // Clear form
            document.getElementById("new-website").value = "";
            document.getElementById("new-description").value = "";
            fileInput.value = "";
            setPendingDiplomaFile(null); 
          }
        }}
      >
        SUBMIT
      </button>
      {pendingDiplomaFile && (
  <p className="text-xs text-gray-500 italic mt-2">
    Uploaded: {pendingDiplomaFile.name}
  </p>
)}

    </div>

    {/* Resume of Submitted Diplomas */}
    {submittedDiplomas.length > 0 && (
      <>
        <h3 className="text-md font-semibold text-gray-700 mt-6">Submitted Justifications</h3>
        {submittedDiplomas.map((item, index) => (
          <div key={index} className="border rounded-md p-4 bg-gray-50">
            <p className="font-bold text-blue-700 text-sm">{item.website}</p>
            <p className="text-sm text-gray-700 mb-2">{item.description}</p>
            <p className="text-xs text-gray-500 italic">Diploma: {item.file.name}</p>
          </div>
        ))}
      </>
    )}

    {/* Navigation Buttons */}
    <div className="flex justify-between pt-4">
      <button
        onClick={() => setStep(3)}
        className="border border-blue-500 text-blue-500 px-6 py-2 rounded font-semibold"
      >
        RETURN
      </button>

      <button
        className="bg-blue-500 text-white px-6 py-2 rounded font-semibold"
        onClick={() => setStep(5)}
      >
        CONTINUE
      </button>
    </div>
  </div>
)}

{step === 5 && (
  <div className="flex flex-col items-center justify-center h-full w-full text-center">
    <h2 className="text-xl md:text-2xl font-semibold text-black mb-4 p-16">
       Congratulations! <br /> You completed the self-assesment
    </h2>


    <div className="flex gap-4">
      <button
        onClick={() => setStep(4)}
        className="text-blue-600 text-sm font-semibold px-4"
      >
        GO BACK
      </button>

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold text-sm"
        onClick={() => {
          console.log("Submit self-assessment!");
          onClose();
        }}
      >
        SUBMIT SELF-ASSESSMENT
      </button>
    </div>
  </div>
)}
{showExitConfirm && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-[14px] border-2 border-blue-500 w-[90%] max-w-md p-8 relative text-center">
      <h2 className="text-xl font-bold text-black mb-2">Are you sure you want to exit?</h2>
      <p className="text-black mb-6">Your progress won’t be saved</p>

      <div className="flex justify-center gap-4">
        <button
          className="text-blue-600 font-semibold text-sm px-8"
          onClick={onClose}
        >
          EXIT
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold"
          onClick={() => setShowExitConfirm(false)}
        >
          CONTINUE THE ASSESSMENT
        </button>
      </div>

      <button
        onClick={() => setShowExitConfirm(false)}
        className="absolute top-3 right-4 text-blue-500 text-xl font-bold"
      >
        ✕
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default SelfAssessmentModal;