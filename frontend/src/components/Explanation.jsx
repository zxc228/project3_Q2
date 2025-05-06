export default function Explanation({ isOpen, position, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute bg-white p-6 rounded-lg border-4 border-custom-utad-logo shadow-xl z-50"
      style={{
        top: position.top,
        left: position.left,
        width: "40rem",
      }}
    >
      {children}
    </div>
  );
}
