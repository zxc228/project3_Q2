export default function NavigationButtons({ onBack, onNext }) {
    return (
      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
        <button
          className="border-2 border-blue-600 text-blue-600 font-bold px-6 py-2 rounded-md"
          onClick={onBack}
        >
          RETURN
        </button>
  
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
          onClick={onNext}
        >
          NEXT
        </button>
      </div>
    );
  }