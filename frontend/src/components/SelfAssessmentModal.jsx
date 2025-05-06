"use client";

import { useEffect, useState } from "react";

export default function SelfAssessmentModal({ isOpen, onClose }) {
  function getMedal(value) {
    if (value >= 4.5) return "/svg/Badge/Gold.svg";
    if (value >= 3.5) return "/svg/Badge/Silver.svg";
    if (value >= 2.5) return "/svg/Badge/Bronze.svg";
    return "";
  }

  const [currentStep, setCurrentStep] = useState(1);

  const [careerFields, setCareerFields] = useState([]);
  const [careerTypes, setCareerTypes] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [assessmentData, setAssessmentData] = useState({
    careerFieldId: "",
    careerTypeId: "",
    jobType: "",
    skills: [],
    justifications: [],
  });

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/careers/fields", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch career fields");

        const data = await res.json();
        setCareerFields(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleFieldChange = async (e) => {
    const fieldId = e.target.value;
    setAssessmentData((prev) => ({
      ...prev,
      careerFieldId: fieldId,
      careerTypeId: "",
      skills: [],
    }));
    setCareerTypes([]);

    if (!fieldId) return; // nothing chosen yet
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    try {
      const res = await fetch(`/api/careers/fields/${fieldId}/types`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch career types");

      const types = await res.json();
      setCareerTypes(Array.isArray(types) ? types : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTypeChange = async (e) => {
    const careerTypeId = e.target.value;
    setAssessmentData((prev) => ({ ...prev, careerTypeId, skills: [] }));
    if (!careerTypeId) return;

    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    try {
      setLoadingSkills(true);

      const res = await fetch(`/api/careers/skills/${careerTypeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch career skills");

      const skillsArr = await res.json();
      setAssessmentData((prev) => ({
        ...prev,
        skills: skillsArr.map((s) => ({
          id: s.skillid,
          name: s.skillname,
          description: s.skilldescription,
          current: 0,
        })),
      }));
      setCurrentStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleFinish = async () => {
    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId");
    if (!token || !profileId) return;

    const payload = {
      skills: assessmentData.skills.map((s) => ({
        skillId: s.id,
        skillLevel: s.current,
      })),
    };

    try {
      const res = await fetch(`/api/skills/profiles/${profileId}/skills`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update skills");
      console.log("Skills successfully updated in profile.");
      onClose();
    } catch (err) {
      console.error("Skill update error:", err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setAssessmentData({
        careerFieldId: "",
        careerTypeId: "",
        jobType: "",
        skills: [],
        justifications: [],
      });
      setCurrentStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-3xl h-[70vh] overflow-y-auto rounded-2xl p-10 relative shadow-2xl animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl transition-all duration-200 hover:scale-105"
        >
          <img src="/svg/X.svg" alt="Close" className="w-6 h-6" />
        </button>
        {currentStep === 1 && (
          <div className="flex flex-col items-center justify-between h-full">
            <div className="w-full max-w-[600px] text-center">
              <h1 className="text-[28px] font-bold mb-4 text-[#14192C]">
                What Career Field do you want to specialize in?
              </h1>
              <select
                value={assessmentData.careerFieldId}
                onChange={handleFieldChange}
                className="w-full border-2 border-[#0065EF] text-[#0065EF] py-2 px-4 rounded mb-10 text-[15px] font-bold focus:outline-none text-center"
              >
                <option value="" className="text-[15px] font-bold text-center">
                  I DON'T KNOW WHERE I WANT TO SPECIALIZE
                </option>
                {careerFields.map((f) => (
                  <option
                    key={f.id}
                    value={f.id}
                    className="text-[#0065EF] text-[15px] font-bold text-center"
                  >
                    {f.name}
                  </option>
                ))}
              </select>
              {careerTypes.length > 0 && (
                <div>
                  <h1 className="text-[28px] font-bold mb-6 text-[#14192C]">
                    Are you looking for a job or an internship?
                  </h1>
                  <select
                    value={assessmentData.careerTypeId}
                    onChange={handleTypeChange}
                    className="w-full border-2 border-[#0065EF] text-[#0065EF] py-2 px-4 rounded mb-10 text-[15px] font-bold focus:outline-none text-center"
                  >
                    <option
                      value=""
                      className="text-[15px] font-bold text-center"
                    >
                      Select Career Type
                    </option>
                    {careerTypes.map((t) => (
                      <option
                        key={t.id}
                        value={t.id}
                        className="text-[#0065EF] text-[15px] font-bold text-center"
                      >
                        {t.type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {loadingSkills && (
                <p className="mt-6 text-sm text-gray-500">Loading skills…</p>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2 – Skills self-assessment ───────────── */}
        {currentStep === 2 && (
          <div className="flex flex-col">
            <h2 className="text-[24px] text-[#14192C] font-bold mb-10">
              Rate Your Skills
            </h2>

            {assessmentData.skills.length === 0 ? (
              <p className="text-gray-500 text-center">No skills available.</p>
            ) : (
              <div className="flex flex-col gap-6 overflow-y-auto">
                {assessmentData.skills.map((skill, idx) => (
                  <div key={skill.id} className="flex items-center gap-4">
                    <div className="w-60 flex items-center gap-2 font-medium">
                      <div className="flex items-center">
                        {getMedal(skill.current) && (
                          <img
                            src={getMedal(skill.current)}
                            alt={`${skill.name} skill level medal`}
                            className="w-10 h-10 inline-block mr-2"
                          />
                        )}
                        <span className="text-[#14192C] text-[21px] font-normal">
                          {skill.name}
                        </span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={skill.current}
                      onChange={(e) => {
                        const updated = [...assessmentData.skills];
                        updated[idx].current = parseFloat(e.target.value);
                        setAssessmentData((prev) => ({
                          ...prev,
                          skills: updated,
                        }));
                      }}
                      className="flex-1 h-2 bg-gray-200 rounded-lg accent-blue-600"
                    />
                    <div className="w-20 text-center font-semibold">
                      {skill.current}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md transition-all duration-200 hover:scale-105"
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 – Justifications ───────────────────── */}
        {currentStep === 3 && (
          <div className="flex flex-col">
            <h2 className="text-[24px] text-[#14192C] font-bold mb-10">
              Add Skill Justifications
            </h2>

            {assessmentData.justifications.length === 0 && (
              <p className="text-gray-500 text-center">
                No justifications added yet.
              </p>
            )}

            <div className="space-y-6 mb-8">
              {assessmentData.justifications.map((j, idx) => (
                <div
                  key={idx}
                  className="border-2 border-blue-500 rounded-lg p-4 bg-white"
                >
                  {/* -- title/url/description */}
                  <input
                    type="text"
                    placeholder="Course Title"
                    value={j.title}
                    onChange={(e) => {
                      const upd = [...assessmentData.justifications];
                      upd[idx].title = e.target.value;
                      setAssessmentData((p) => ({ ...p, justifications: upd }));
                    }}
                    className="w-full border-b-2 border-blue-600 mb-2 font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Website URL"
                    value={j.url}
                    onChange={(e) => {
                      const upd = [...assessmentData.justifications];
                      upd[idx].url = e.target.value;
                      setAssessmentData((p) => ({ ...p, justifications: upd }));
                    }}
                    className="w-full border-b-2 border-blue-600 mb-2 text-blue-600 font-semibold"
                  />
                  <textarea
                    rows={2}
                    placeholder="What did you learn?"
                    value={j.description}
                    onChange={(e) => {
                      const upd = [...assessmentData.justifications];
                      upd[idx].description = e.target.value;
                      setAssessmentData((p) => ({ ...p, justifications: upd }));
                    }}
                    className="w-full border rounded-md p-2 text-sm"
                  />

                  {/* -- file upload */}
                  <label className="mt-4 flex flex-col items-center bg-gray-200 rounded-md py-6 cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const upd = [...assessmentData.justifications];
                        upd[idx].file = e.target.files[0];
                        setAssessmentData((p) => ({
                          ...p,
                          justifications: upd,
                        }));
                      }}
                    />
                    <span className="text-sm font-semibold">
                      Upload Diploma
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mb-10">
              <button
                onClick={() =>
                  setAssessmentData((p) => ({
                    ...p,
                    justifications: [
                      ...p.justifications,
                      { title: "", url: "", description: "", file: null },
                    ],
                  }))
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md transition-all duration-200 hover:scale-105"
              >
                ADD JUSTIFICATION
              </button>

              <button
                onClick={() =>
                  setAssessmentData((p) => ({ ...p, justifications: [] }))
                }
                className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md transition-all duration-200 hover:scale-105"
              >
                CLEAR ALL
              </button>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md transition-all duration-200 hover:scale-105"
              >
                RETURN
              </button>
              <button
                onClick={handleFinish}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md transition-all duration-200 hover:scale-105"
              >
                FINISH
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
