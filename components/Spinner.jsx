const Spinner = ({ width = 48, height = 48 }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* <div className="w-12 h-12 rounded-full border-4 border-purple-200"></div> */}
        <div
          className={`absolute top-0 left-0   rounded-full
         border-2 border-purple-1 border-t-transparent animate-spin`}
          style={{ width: `${width}px`, height: `${height}px` }}
        ></div>
      </div>
    </div>
  );
};

export default Spinner;
