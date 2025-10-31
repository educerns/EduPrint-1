import React from "react";
import Lottie from "lottie-react";
import comingSoonAnimation from "../assets/coming soon (pink).json"; // adjust path if needed

const PaidPromotion = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
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
  );
};

export default PaidPromotion;
