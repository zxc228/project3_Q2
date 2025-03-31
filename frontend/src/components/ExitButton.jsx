export default function ExitButton({ onClick }) {
    return (
      <button
        className="absolute top-6 right-6 text-blue-600 text-2xl font-bold"
        onClick={onClick}
      >
        ✕
      </button>
    );
  }