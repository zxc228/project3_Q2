export default function MedalSelector({ value, onChange }) {
    return (
      <select
        value={value}
        onChange={onChange}
        className="border border-gray-300 text-sm rounded-md px-1 py-[2px] focus:outline-blue-600"
      >
        <option value="">+</option>
        <option value="🥇">🥇</option>
        <option value="🥈">🥈</option>
        <option value="🥉">🥉</option>
      </select>
    );
  }
  