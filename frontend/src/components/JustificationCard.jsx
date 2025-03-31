export default function JustificationCard({ item, index, updateField, updateFile, toggleExpand, onSubmit }) {
    return (
      <div className="bg-white border-2 border-blue-500 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <input
              type="radio"
              name="selected"
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
                onChange={(e) => updateField(index, 'title', e.target.value)}
                className="w-full border-0 border-b-2 border-blue-600 text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
              />
  
              <input
                type="text"
                placeholder="WEBSITE"
                value={item.url}
                onChange={(e) => updateField(index, 'url', e.target.value)}
                className="w-full border-0 border-b-2 border-blue-600 text-sm text-blue-600 font-semibold placeholder-gray-400 focus:outline-none"
              />
  
              <textarea
                placeholder="Briefly describe the course and what you learnt!"
                value={item.description}
                onChange={(e) => updateField(index, 'description', e.target.value)}
                className="w-full p-2 text-sm resize-none focus:outline-none"
                rows={2}
              />
            </div>
          </div>
  
          <button
            onClick={() => toggleExpand(index)}
            className="text-xl text-gray-600"
          >
            {item.expanded ? '🔽' : '▶️'}
          </button>
        </div>
  
        {item.expanded && (
          <div className="mt-6 space-y-4">
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
              <span className="uppercase tracking-wide text-sm">Upload Diploma</span>
            </label>
  
            <div className="text-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                onClick={() => onSubmit(index)}
              >
                SUBMIT
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }