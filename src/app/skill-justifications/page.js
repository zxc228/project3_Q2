"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SkillJustificationsPage() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(0);
  const [submitted, setSubmitted] = useState([]);
  const [justifications, setJustifications] = useState([
    {
      title: "",
      url: "",
      description: "",
      file: null,
      expanded: true,
    },
  ]);

  const updateField = (index, field, value) => {
    const updated = [...justifications];
    updated[index][field] = value;
    setJustifications(updated);
  };

  const updateFile = (index, file) => {
    const updated = [...justifications];
    updated[index].file = file;
    setJustifications(updated);
  };

  const toggleExpand = (index) => {
    const updated = [...justifications];
    updated[index].expanded = !updated[index].expanded;
    setJustifications(updated);
  };

  const addJustification = () => {
    setJustifications([
      ...justifications,
      {
        title: "",
        url: "",
        description: "",
        file: null,
        expanded: true,
      },
    ]);
  };

  const clearAll = () => setJustifications([]);

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-black">
          Add skill justifications
        </h2>
        <div className="flex items-center gap-4 text-2xl">
          <button
            onClick={addJustification}
            className="text-blue-600 text-4xl hover:text-blue-800"
          >
            +
          </button>

          <button onClick={clearAll}>🗑</button>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Justification Cards */}
      <div className="space-y-6">
        {justifications.map((item, index) => (
          <div
            key={index}
            className="bg-white border-2 border-blue-500 rounded-lg p-4"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <input
                  type="radio"
                  name="selected"
                  checked={selectedCard === index}
                  onChange={() => setSelectedCard(index)}
                  className="mt-1"
                />

                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <img
                    src="/icon/image-placeholder.png"
                    alt="Image icon"
                    className="w-10 h-10 object-contain"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="NAME OF THE COURSE"
                    value={item.title}
                    onChange={(e) =>
                      updateField(index, "title", e.target.value)
                    }
                    className="w-full border-0 border-b-2 border-blue-600 text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
                  />

                  <input
                    type="text"
                    placeholder="WEBSITE"
                    value={item.url}
                    onChange={(e) => updateField(index, "url", e.target.value)}
                    className="w-full border-0 border-b-2 border-blue-600 text-sm text-blue-600 font-semibold placeholder-gray-400 focus:outline-none"
                  />

                  <textarea
                    placeholder="Briefly describe the course and what you learnt!"
                    value={item.description}
                    onChange={(e) =>
                      updateField(index, "description", e.target.value)
                    }
                    className="w-full p-2 text-sm resize-none focus:outline-none"
                    rows={2}
                  />
                </div>
              </div>

              {/* Collapse Toggle */}
              <button
                onClick={() => toggleExpand(index)}
                className="text-xl text-gray-600"
              >
                {item.expanded ? "🔽" : "▶️"}
              </button>
            </div>

            {/* Expandable Body */}
            {item.expanded && (
              <div className="mt-6 space-y-4">
                {/* Upload BELOW Description */}
                <label className="flex flex-col items-center justify-center bg-gray-200 text-gray-800 font-semibold rounded-md py-12 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => updateFile(index, e.target.files[0])}
                  />
                  <img
                    src="/icon/upload.png"
                    alt="Upload icon"
                    className="w-12 h-12 mb-2 object-contain"
                  />
                  <span className="uppercase tracking-wide text-sm">
                    Upload Diploma
                  </span>
                </label>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                    onClick={() => {
                      setSubmitted([
                        ...submitted,
                        {
                          title: item.title,
                          url: item.url,
                          description: item.description,
                          file: item.file,
                        },
                      ]);
                      const updated = [...justifications];
                      updated.splice(index, 1);
                      setJustifications(updated);
                    }}
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submitted Cards Section */}
      {submitted.length > 0 && (
        <div className="mt-10 space-y-6">
          {submitted.map((item, i) => (
            <div
              key={i}
              className="border-2 border-blue-600 rounded-lg p-4 flex items-start gap-4 bg-white"
            >
              {/* Image */}
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                {item.file ? (
                  <img
                    src={URL.createObjectURL(item.file)}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <img
                    src="/icon/image-placeholder.png"
                    alt="placeholder"
                    className="w-10 h-10 object-contain"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-sm uppercase text-gray-700">
                  {item.title}
                </h3>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-semibold underline"
                >
                  {item.url}
                </a>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>

              {/* Arrow icon */}
              <div className="text-xl text-blue-600 ml-auto mt-1">🔽</div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-10 flex justify-between">
        <button
          className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md"
          onClick={() => router.push("/skill-rating")}
        >
          RETURN
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
          onClick={() => router.push("/completion")}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
