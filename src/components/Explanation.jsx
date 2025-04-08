export default function Explanation({ isOpen, closeModal, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-md w-[30rem]">
        <div className="mb-4">{children}</div>
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mx-auto block mt-4"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
