export default function Explanation({ isOpen, children, hoverTimeout }) {
  if (!isOpen) return null;

  const handleMouseEnter = () => clearTimeout(hoverTimeout.current);

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      const closeEvent = new CustomEvent("closeExplanation");
      window.dispatchEvent(closeEvent);
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="bg-white p-8 rounded-lg w-[40rem] border-custom-utad-logo border-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
}
