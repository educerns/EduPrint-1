import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Layout = () => {

   const location = useLocation();

  // List of routes where navigation should be hidden
  const hideNavRoutes = [
    "/privacy/policy",
    // add more if needed
  ];

  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
{!shouldHideNav && <Navigation />}      <main>
        <Outlet />
      </main>
     {!shouldHideNav && <Footer />}
    </div>
  );
};

export default Layout;