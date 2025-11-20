import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import comingSoonAnimation from "../assets/coming soon (pink).json"; // adjust path if needed
import InfinityLoader from "./ui/EduPrintSpinner";
import { motion, AnimatePresence } from "framer-motion";

const PaidPromotion = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
        // ⏱️ Simulate loading for 1-2 seconds
      useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1500); // 1.5 seconds
    
        return () => clearTimeout(timer);
      }, []);


  return (
    <div className="flex items-center justify-center h-screen bg-white">
        <div className={`max-w-7xl mx-auto transition-all duration-300 ${isLoading ? 'blur-sm' : ''}`}>
              <div className="text-center">
                <Lottie
                  animationData={comingSoonAnimation}
                  loop
                  className="w-100 h-100 mx-auto"
                />
                {/* <h1 className="text-3xl font-bold text-[#2C4E86] mt-4">
                  Coming Soon
                </h1> */}
              </div>
      </div>

             {/* 🔄 Loader Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" // Changed from bg-black/20
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <InfinityLoader/>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaidPromotion;
