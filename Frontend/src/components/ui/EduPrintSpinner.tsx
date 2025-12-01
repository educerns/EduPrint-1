import React from "react";

const InfinityLoader = () => {
  return (
    <div className="flex justify-center items-center w-full h-[150px]">
      <svg
        width="200"
        height="100"
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0057a1" />
            <stop offset="33%" stopColor="#00b9f1" />
            <stop offset="66%" stopColor="#ff8800" />
            <stop offset="100%" stopColor="#ff3333" />
          </linearGradient>
        </defs>

        {/* TRUE INFINITY SYMBOL */}
        <path
          d="
            M 20 50
            C 20 20, 80 20, 100 50
            C 120 80, 180 80, 180 50
            C 180 20, 120 20, 100 50
            C 80 80, 20 80, 20 50
          "
          fill="none"
          stroke="url(#grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="566" 
          strokeDashoffset="566"
        >
          {/* Draw stroke */}
          <animate
            attributeName="stroke-dashoffset"
            from="566"
            to="0"
            dur="1.2s"
            fill="freeze"
          />
          {/* Fade out after drawing */}
          <animate
            attributeName="stroke-opacity"
            values="0;0"
            dur="1.2s"
            begin="1.2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};

export default InfinityLoader;