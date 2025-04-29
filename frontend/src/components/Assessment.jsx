"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Assessment() {
  const router = useRouter();   
  // ────────────────────────── state
  const [currentStep, setCurrentStep] = useState(1);

  const [careerFields, setCareerFields]   = useState([]);
  const [careerTypes,  setCareerTypes]    = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [assessmentData, setAssessmentData] = useState({
    careerFieldId : "",
    careerTypeId  : "",
    jobType       : "",
    skills        : [],   // [{ id,name,description,current,medal }]
    justifications: [],
  });

  // ────────────────────────── fetch career fields (один раз)
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      try {
        const res  = await fetch("/api/careers/fields", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch career fields");

        const data = await res.json();
        setCareerFields(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); }
    })();
  }, []);

  // ────────────────────────── handlers
  const handleFieldChange = async (e) => {
    const fieldId = e.target.value;
    setAssessmentData(prev => ({
      ...prev,
      careerFieldId : fieldId,
      careerTypeId  : "",
      skills        : [],
    }));
    setCareerTypes([]);

    if (!fieldId) return;                        // nothing chosen yet
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    try {
      const res = await fetch(`/api/careers/fields/${fieldId}/types`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch career types");

      const types = await res.json();
      setCareerTypes(Array.isArray(types) ? types : []);
    } catch (err) { console.error(err); }
  };

  const handleTypeChange = async (e) => {
    const careerTypeId = e.target.value;
    setAssessmentData(prev => ({ ...prev, careerTypeId, skills: [] }));
    if (!careerTypeId) return;

    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    try {
      setLoadingSkills(true);

      const res = await fetch(`/api/careers/skills/${careerTypeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch career skills");

      const skillsArr = await res.json()
      setAssessmentData(prev => ({
        ...prev,
        skills: skillsArr.map((s) => ({ 
          id          : s.skillid,
          name        : s.skillname,
          description : s.skilldescription,
          current     : 0,
          medal       : ""
        }))
      }));

      // → сразу переходим к экрану Job / Internship
      setCurrentStep(3);
    } catch (err) { console.error(err); }
    finally { setLoadingSkills(false); }
  };

  const handleFinish = () => {
    localStorage.setItem("upaFiAssessmentData", JSON.stringify(assessmentData));
    console.log("Saved Assessment:", assessmentData);
    router.push("/dashboard"); 
  };

  // ────────────────────────── UI
  return (
    <div className="min-h-screen flex flex-col bg-white px-6 py-10">

      {/* ── STEP 1 – Field & Type ─────────────────────── */}
      {currentStep === 1 && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-8 text-gray-800 text-center">
            What Career Field do you want to specialize in?
          </h1>

          {/* Career Field */}
          <select
            value={assessmentData.careerFieldId}
            onChange={handleFieldChange}
            className="w-[400px] mb-6 border-2 border-blue-600 rounded-md px-4 py-4 text-blue-600 font-semibold text-center"
          >
            <option value="">Select Career Field</option>
            {careerFields.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          {/* Career Type */}
          {careerTypes.length > 0 && (
            <select
              value={assessmentData.careerTypeId}
              onChange={handleTypeChange}
              className="w-[400px] border-2 border-blue-600 rounded-md px-4 py-4 text-blue-600 font-semibold text-center"
            >
              <option value="">Select Career Type</option>
              {careerTypes.map(t => (
                <option key={t.id} value={t.id}>{t.type}</option>
              ))}
            </select>
          )}

          {loadingSkills && <p className="mt-6 text-sm text-gray-500">Loading skills…</p>}
        </div>
      )}

      {/* ── STEP 2 – Job / Internship ────────────────── */}
      {currentStep === 2 && (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-10 text-gray-800 text-center">
            Are you looking for a job or an internship?
          </h1>

          <div className="flex gap-6 mb-16 flex-wrap justify-center">
            {["JOB","INTERNSHIP","I'M NOT LOOKING"].map(opt => (
              <button
                key={opt}
                onClick={() => setAssessmentData(p => ({ ...p, jobType: opt }))}
                className={`px-6 py-2 rounded-md border-2 font-semibold
                  ${assessmentData.jobType === opt
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-blue-600 text-blue-600"}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md"
            >
              RETURN
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 – Skills self-assessment ───────────── */}
      {currentStep === 3 && (
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            Rate Your Skills
          </h2>

          {assessmentData.skills.length === 0
            ? <p className="text-gray-500 text-center">No skills available.</p>
            : (
              <div className="flex flex-col gap-6 overflow-y-auto">
                {assessmentData.skills.map((skill, idx) => (
                  <div key={skill.id} className="flex items-center gap-4">
                    <div className="w-60 flex items-center gap-2 font-medium">
                      <select
                        value={skill.medal}
                        onChange={e => {
                          const upd=[...assessmentData.skills];
                          upd[idx].medal = e.target.value;
                          setAssessmentData(p => ({...p, skills: upd}));
                        }}
                        className="rounded-md text-sm px-1 py-[2px] focus:outline-blue-600"
                      >
                        <option value="">+</option>
                        <option value="🥇">🥇</option>
                        <option value="🥈">🥈</option>
                        <option value="🥉">🥉</option>
                      </select>
                      <span className="text-gray-800">{skill.name}</span>
                    </div>

                    <input
                      type="range" min="0" max="5" step="0.5"
                      value={skill.current}
                      onChange={e => {
                        const upd=[...assessmentData.skills];
                        upd[idx].current = parseFloat(e.target.value);
                        setAssessmentData(p => ({...p, skills: upd}));
                      }}
                      className="flex-1 h-2 bg-gray-200 rounded-lg accent-blue-600"
                    />
                    <div className="w-20 text-center font-semibold">{skill.current}</div>
                  </div>
                ))}
              </div>
            )}

          <div className="flex gap-4 mt-10">
        
            <button
              onClick={() => setCurrentStep(4)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4 – Justifications ───────────────────── */}
      {currentStep === 4 && (
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-black mb-6">
            Add Skill Justifications
          </h2>

          {assessmentData.justifications.length === 0 && (
            <p className="text-gray-500 text-center">No justifications added yet.</p>
          )}

          <div className="space-y-6 mb-8">
            {assessmentData.justifications.map((j, idx) => (
              <div key={idx} className="border-2 border-blue-500 rounded-lg p-4 bg-white">
                {/* -- title/url/description */}
                <input
                  type="text" placeholder="Course Title"
                  value={j.title}
                  onChange={e => {
                    const upd=[...assessmentData.justifications];
                    upd[idx].title = e.target.value;
                    setAssessmentData(p => ({...p, justifications: upd}));
                  }}
                  className="w-full border-b-2 border-blue-600 mb-2 font-semibold"
                />
                <input
                  type="text" placeholder="Website URL"
                  value={j.url}
                  onChange={e => {
                    const upd=[...assessmentData.justifications];
                    upd[idx].url = e.target.value;
                    setAssessmentData(p => ({...p, justifications: upd}));
                  }}
                  className="w-full border-b-2 border-blue-600 mb-2 text-blue-600 font-semibold"
                />
                <textarea
                  rows={2} placeholder="What did you learn?"
                  value={j.description}
                  onChange={e => {
                    const upd=[...assessmentData.justifications];
                    upd[idx].description = e.target.value;
                    setAssessmentData(p => ({...p, justifications: upd}));
                  }}
                  className="w-full border rounded-md p-2 text-sm"
                />

                {/* -- file upload */}
                <label className="mt-4 flex flex-col items-center bg-gray-200 rounded-md py-6 cursor-pointer">
                  <input
                    type="file" className="hidden"
                    onChange={e => {
                      const upd=[...assessmentData.justifications];
                      upd[idx].file = e.target.files[0];
                      setAssessmentData(p => ({...p, justifications: upd}));
                    }}
                  />
                  <span className="text-sm font-semibold">Upload Diploma</span>
                </label>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mb-10">
            <button
              onClick={() =>
                setAssessmentData(p => ({
                  ...p,
                  justifications: [...p.justifications, { title:"",url:"",description:"",file:null }]
                }))}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
            >
              ADD JUSTIFICATION
            </button>

            <button
              onClick={() => setAssessmentData(p => ({...p, justifications: []}))}
              className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md"
            >
              CLEAR ALL
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md"
            >
              RETURN
            </button>
            <button
              onClick={handleFinish}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
            >
              FINISH
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
