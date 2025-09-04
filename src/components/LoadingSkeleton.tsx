const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Logo Skeleton */}
        <div className="flex justify-center mb-3">
          <div className="w-24 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Progress Bar Skeleton */}
        <div className="mb-3 flex justify-center">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse w-full"></div>
          </div>
        </div>

        {/* Page Content Skeleton */}
        <div className="my-8">
          {/* Page Title Skeleton */}
          <div className="mb-8">
            <div className="mb-4">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-6">
            {/* Field 1 */}
            <div
              className="space-y-2 animate-pulse"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>

            {/* Field 2 */}
            <div
              className="space-y-2 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>

            {/* Field 3 */}
            <div
              className="space-y-2 animate-pulse"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="h-4 bg-gray-200 rounded w-2/5"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>

          {/* Navigation Skeleton */}
          <div className="flex justify-between items-center mt-8">
            <div
              className="h-12 bg-gray-200 rounded-full animate-pulse w-full"
              style={{ animationDelay: "0.6s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;