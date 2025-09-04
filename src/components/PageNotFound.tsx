import { useRouter } from "next/navigation";

interface PageNotFoundProps {
  pageCode: string;
}

const PageNotFound: React.FC<PageNotFoundProps> = ({ pageCode }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The requested page "{pageCode}" does not exist.
        </p>
        <button
          onClick={() => router.push("/intake-form/step_1")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
        >
          Go to First Step
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;