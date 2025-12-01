import React, { useState,useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, Send } from 'lucide-react';
import { Variants } from "framer-motion";
import QuarterBurstLoaderStatic from './ui/multiArcLoader';

interface FormData {
  name: string;
  email: string;
  phone: string;
  comment: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    // ⏱️ Simulate loading for 1-2 seconds
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // 1.5 seconds
  
      return () => clearTimeout(timer);
    }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1] as any  // ✅ simplest safe cast
    }
  }
};

  return (
    <div className=" bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        {/* White Background When Loading */}
  {isLoading && (
    <div className="absolute inset-0 bg-white z-30"></div>
  )}
       <div className={`max-w-7xl mx-auto transition-all duration-300 ${isLoading ? 'blur-sm' : ''}`}>
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-600 text-lg">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Contact Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-4 lg:p-6"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h3>
            
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  name="comment"
                  placeholder="Tell us about your inquiry"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <motion.button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-900 to-blue-950 text-white px-6 py-3.5 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-blue-900 hover:to-blue-950 transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Send Message</span>
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-4">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-4 lg:p-6"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-2">
                <motion.div 
                  className="flex items-start space-x-4 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                    <a href="tel:+918855856055" className="text-gray-900 font-medium hover:text-blue-950 transition-colors">
                      +91 8855856055
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                    <a href="mailto:support@educerns.org" className="text-gray-900 font-medium hover:text-blue-950 transition-colors break-all">
                      support@educerns.org
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      472, Kasar Ali, Opp. Markandeshwar Mandir, Anjur, Bhiwandi, Thane, Maharashtra, India - 421302
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-4 lg:p-6"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Connect With Us</h3>
              
              <div className="flex space-x-4">
                {[
                  { Icon: Facebook, url: "https://www.facebook.com/share/1Fbk5dQVCw/?mibextid=wwXIfr", color: "from-blue-600 to-blue-700" },
                  { Icon: Linkedin, url: "https://www.linkedin.com/company/educerns/", color: "from-blue-700 to-blue-800" },
                  { Icon: Instagram, url: "https://www.instagram.com/invites/contact/?igsh=x5dq3h7dno2w&utm_content=yf1t310", color: "from-pink-600 to-purple-600" },
                ].map(({ Icon, url, color }, index) => (
                  <motion.a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gradient-to-br ${color} p-4 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 flex items-center justify-center`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Business Hours</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Saturday:</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      </div>

        <AnimatePresence>
  {isLoading && (
    <motion.div
      className="fixed left-0 right-0 bottom-0 top-16 bg-gray-50 flex items-center justify-center z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <QuarterBurstLoaderStatic />
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default Contact;