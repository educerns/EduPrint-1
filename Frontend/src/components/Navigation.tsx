import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, LogOut, Package, CreditCard, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";
import OrderHistory from "./OrderHistory";       // ← transactions modal
import CreditHistory from "./CreditHistory";     // ← credit usage modal
import logo from "@/assets/eduprint1.png";
import { NavLink, useNavigate } from "react-router-dom";
import MembershipCoinBadge from "./ui/Membershipcoinbadge";

interface NavigationProps {
  onSearch?: (query: string) => void;
}

const Navigation = ({ onSearch }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isCreditHistoryOpen, setIsCreditHistoryOpen] = useState(false); // ← NEW
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, isAuthenticated } = useAuth();
  // const { user, logout, isAuthenticated,loggedin } = useAuth();

  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    isAuthenticated && { name: "Paid Article", path: "/paid-promotion" },
    isAuthenticated && { name: "Free Templates", path: "/templates" },
    isAuthenticated && { name: "Marketing Video's", path: "/free-videos" },
    { name: "Contact", path: "/contact" },
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState("#products");
  useEffect(() => {
    const handleHashChange = () => setActiveTab(window.location.hash || "#products");
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center justify-center pr-4">
              <a href="/" className="flex items-center focus:outline-none">
                <img src={logo} alt="Educerns Logo" className="w-38 h-10" />
              </a>
            </div>

            {/* Desktop Nav links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative font-medium transition-colors duration-200 ${
                      isActive ? "text-blue-900" : "text-gray-700 hover:text-blue-950"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      {isActive && <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-700 rounded" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="hidden md:flex items-center flex-1 max-w-md mx-8" />

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">

              {/* 🪙 Membership Coin Badge */}
              <MembershipCoinBadge />

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{user?.firstName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-white shadow-lg rounded-xl border border-gray-100 py-1">

                    <DropdownMenuItem onClick={() => console.log("Profile")}>
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      Profile
                    </DropdownMenuItem>

                    {/* Order History — membership purchases */}
                    <DropdownMenuItem onClick={() => setIsOrderHistoryOpen(true)}>
                      <Package className="h-4 w-4 mr-2 text-gray-400" />
                      Order History
                    </DropdownMenuItem>

                    {/* Credit History — video editing usage */}
                    <DropdownMenuItem onClick={() => setIsCreditHistoryOpen(true)}>
                      <TrendingDown className="h-4 w-4 mr-2 text-gray-400" />
                      Credit History
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden md:flex items-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Button>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile nav */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 ${isActive ? "text-blue-700" : "text-gray-700 hover:text-blue-700"}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => { setIsOrderHistoryOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-700 w-full text-left"
                  >
                    <Package className="h-4 w-4" /> Order History
                  </button>
                  <button
                    onClick={() => { setIsCreditHistoryOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-700 w-full text-left"
                  >
                    <TrendingDown className="h-4 w-4" /> Credit History
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Two separate modals */}
      <OrderHistory isOpen={isOrderHistoryOpen} onClose={() => setIsOrderHistoryOpen(false)} />
      <CreditHistory isOpen={isCreditHistoryOpen} onClose={() => setIsCreditHistoryOpen(false)} />
    </>
  );
};

export default Navigation;