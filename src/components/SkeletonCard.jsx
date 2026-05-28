const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-40 sm:h-48 bg-gray-200"></div>
      <div className="p-3 md:p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;