import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react";
import QuarterBurstLoaderStatic from "@/components/ui/multiArcLoader";

const HomePage = () => {
  const navigate = useNavigate();
      const [isLoading, setIsLoading] = useState<boolean>(true);
   // ⏱️ Simulate loading for 1-2 seconds
      useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1500); // 1.5 seconds
    
        return () => clearTimeout(timer);
      }, []);
  return (
    <div className="min-h-screen bg-cover  flex flex-col items-center justify-center text-center bg-hero">
      {/* <h1 className="text-4xl font-bold mb-6 ">Welcome to EduPrint</h1> */}
      {/* <p className="text-6xl absolute bottom-40 left-1/2 transform -translate-x-1/2">
  Browse Our Latest Products
</p> */}

      <div className="flex justify-center gap-4 mt-6">
        {/* <button 
          className="bg-none text-black border-2 border-black px-8 py-3 rounded-sm  transition-colors duration-200 absolute bottom-20 left-1/2 transform -translate-x-1/2"
          onClick={() => navigate("/products")}
        >
          Shop All
        </button> */}
        {/* <button 
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
          onClick={() => navigate("/templates")}
        >
          Free Templates
        </button> */}
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed left-0 right-0 bottom-0 top-16 bg-black/30 flex items-center justify-center z-40"
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

export default HomePage;