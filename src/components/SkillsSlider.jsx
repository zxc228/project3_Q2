// components/SkillSlider.jsx

export default function SkillSlider({ skill, index, onSlide, onMedal }) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-60 font-medium flex items-center gap-2">
          <select
            value={skill.medal}
            onChange={(e) => onMedal(index, e.target.value)}
            className="border border-gray-300 text-sm rounded-md px-1 py-[2px] focus:outline-blue-600"
          >
            <option value="">+</option>
            <option value="🥇">🥇</option>
            <option value="🥈">🥈</option>
            <option value="🥉">🥉</option>
          </select>
          <span>{skill.name}</span>
        </div>
  
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={skill.current}
          onChange={(e) => onSlide(index, e.target.value)}
          className="w-52 h-2 appearance-none rounded-lg bg-gray-200 accent-blue-600"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
              (skill.current / 5) * 100
            }%, #e5e7eb ${(skill.current / 5) * 100}%, #e5e7eb 100%)`,
          }}
        />
  
        <div className="w-20 text-center font-semibold text-gray-800">
          {skill.current} | {skill.desired}
        </div>
      </div>
    );
  }
  