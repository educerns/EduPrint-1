import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const AccessDenied = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn(
      "ACCESS DENIED: User tried to open restricted route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center text-white px-6">
        
        <h1 className="text-6xl font-extrabold tracking-widest mb-4">
          ACCESS DENIED
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          You don’t have permission to view this page.
        </p>

        <div className="mb-8">
          <div className="h-0.5 w-40 bg-gray-700 mx-auto"></div>
        </div>

        <Link
          to="/"
          className="px-6 py-2 border border-gray-500 rounded-lg text-gray-200 hover:bg-white hover:text-black transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
