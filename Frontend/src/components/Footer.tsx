import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import darklogo from "../assets/darkbglogo.png"; // Adjust the path as necessary
import { Link } from "react-router-dom"; 

const Footer = () => {
  const [toggledCategories, setToggledCategories] = useState({});

  const toggleCategory = (category) => {
    setToggledCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const footerLinks = {
    "Products": [
      "Stationery",
      "Office Supplies",
      "Promotional Items",
      "Business Cards",
      "Custom Design"
    ],
    "Services": [
      "Free Templates",
      "Custom Design",
      "Bulk Orders",
      "Corporate Solutions",
      "Design Consultation"
    ],
    "Support": [
      "Help Center",
      "Order Tracking",
      "Returns & Exchanges",
      "Shipping Info",
      "Contact Us"
    ],
    "Company": [
      "About Eduprint",
      "Educern Organization",
      "Careers",
      "Press",
      "Privacy Policy"
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4 lg:mb-6">
              <img src={darklogo} alt="Eduprint Logo" className="h-6 lg:h-12 mb-2" />
              <p className="text-gray-400 mb-3 lg:mb-4 text-sm lg:text-base">
                Professional business stationery and promotional materials for the modern workplace. 
                Part of the Educern Organization.
              </p>
            </div>
            
            <div className="space-y-2 lg:space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="break-all">support@educerns.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span>+91 8855856055</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs lg:text-sm">472, Kasar Ali, Opp. Markandeshwar Mandir, Anjur, Bhiwandi, Thane, Maharashtra, India - 421302</span>
              </div>
            </div>

            <div className="flex space-x-3 lg:space-x-4 mt-4 lg:mt-6">
  {[
    { Icon: Facebook, url: "https://www.facebook.com/share/1Fbk5dQVCw/?mibextid=wwXIfr" },
    { Icon: Linkedin, url: "https://www.linkedin.com/company/educerns/" },
    { Icon: Instagram, url: "https://www.instagram.com/invites/contact/?igsh=x5dq3h7dno2w&utm_content=yf1t310" },
  ].map(({ Icon, url }, index) => (
    <a
      key={index}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
    >
      <Icon className="h-4 w-4" />
    </a>
  ))}
</div>

          </div>

          {/* Footer Links - Mobile: Toggleable, Desktop: 4 columns */}
          <div className="lg:col-span-4">
            {/* Mobile View - Toggleable */}
            <div className="block lg:hidden space-y-4">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category} className="border-b border-gray-800 pb-4">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="font-semibold text-white text-sm">{category}</h4>
                    {toggledCategories[category] ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  
                  {toggledCategories[category] && (
                    <ul className="mt-3 space-y-1.5 pl-4">
                      {links.map((link) => (
                        <li key={link}>
                          <a href="/" className="text-gray-400 hover:text-white transition-colors text-xs block">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View - Grid */}
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="font-semibold text-white mb-4 text-base">{category}</h4>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link}>
                        <a href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-6 lg:my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs lg:text-sm text-gray-400 space-y-3 md:space-y-0">
          <div className="text-center md:text-left">
            © 2025 Eduprint by Educerns Technologies. All rights reserved.
          </div>
          <div className="flex flex-row space-x-2 sm:space-x-2 lg:space-x-6 text-center">
           <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            {/* <Link to="/returns" className="hover:text-white transition-colors">Return Refund</Link> */}
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;