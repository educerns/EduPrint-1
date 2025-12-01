import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react";
import QuarterBurstLoaderStatic from "@/components/ui/multiArcLoader";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <div 
      className={`min-h-screen bg-cover flex flex-col items-center justify-center text-center bg-hero transition-all duration-300
      ${isLoading ? "blur-sm" : "blur-0"}`}
    >
      <div className="max-w-7xl mx-auto transition-all duration-300">
        <div className="flex justify-center gap-4 mt-6"></div>
      </div>

    </div>
     <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuarterBurstLoaderStatic />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;
