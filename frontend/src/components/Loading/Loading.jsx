const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 opacity-40">
      {/* Vòng xoay */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-300 border-t-gray-900 animate-spin"></div>
      </div>

      {/* Text LOADING */}
      <p className="mt-4 text-gray-700 text-lg tracking-widest animate-pulse">
        LOADING...
      </p>
    </div>
  );
};

export default LoadingSpinner;