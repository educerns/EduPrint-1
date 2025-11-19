
import { useState } from "react";
import { useEffect} from "react";
import { Search, ShoppingCart, User, Menu, X, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";
import OrderHistory from "./OrderHistory";
import logo from "@/assets/eduprint1.png"; // Adjust the path as necessary
import { Link, NavLink, useNavigate } from "react-router-dom";

interface NavigationProps {
  onSearch?: (query: string) => void;
}

const Navigation = ({ onSearch }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();

const navItems = [
    { name: "Home", path: "/", isFunky: true },
    { name: "Paid Article", path: "/paid-promotion" },
    { name: "Free Templates", path: "/templates", isFunky: true },
    { name: "Free Video's", path: "/free-videos", isFunky: true },
    // { name: "My Video's", path: "/my-videos", isFunky: true },
    { name: "Contact", path: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const [activeTab, setActiveTab] = useState("#products");

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(window.location.hash || "#products");
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // call once on mount

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);


  return (
    <>
    {/* <div className="flex items-center justify-center border border-gray-200 bg-gray-50 ">
      <p> Welcome to our Store</p>
    </div> */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center justify-center pr-4 focus:outline-none">
        <a href="/" className="flex items-center focus:outline-none">
          <img src={logo} alt="Educerns Logo" className="w-38 h-10 focus:outline-none" />
        </a>
      </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                relative font-medium transition-colors duration-200
                ${isActive ? "text-blue-900" : "text-gray-700 hover:text-blue-950"}
              `}
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  {isActive && (
                    <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-700 rounded"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              {/* <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </form> */}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button> */}
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>{user?.firstName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    <DropdownMenuItem onClick={() => console.log('Profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsOrderHistoryOpen(true)}>
                      <Package className="h-4 w-4 mr-2" />
                      Order History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // <Button
                //   variant="ghost"
                //   size="sm"
                //   onClick={() => setIsAuthOpen(true)}
                //   className="hidden md:flex items-center space-x-2"
                // >
                //   <User className="h-5 w-5" />
                //   <span>Login</span>
                // </Button>

                ""
              )}

              {/* Mobile menu button */}
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

          {/* Mobile Navigation */}
  {isMobileMenuOpen && (
    <div className="md:hidden border-t border-gray-200 bg-white p-4 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={({ isActive }) =>
            `block py-2 ${
              isActive ? "text-blue-700" : "text-gray-700 hover:text-blue-700"
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  )}
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <OrderHistory isOpen={isOrderHistoryOpen} onClose={() => setIsOrderHistoryOpen(false)} />
    </>
  );
};

export default Navigation;
