import React from "react";

const InfinityLoader = () => {
  return (
    <div className="flex justify-center items-center w-full h-[150px]">
      <svg
        width="140"
        height="70"
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0057a1" />
            <stop offset="25%" stopColor="#00b9f1" />
            <stop offset="50%" stopColor="#ff8800" />
            <stop offset="100%" stopColor="#ff3333" />
          </linearGradient>
        </defs>

        {/* Infinity Shape Path */}
        <path
          id="infinityPath"
          d="
            M 50 50
            C 20 10, 0 90, 50 50
            C 100 10, 120 90, 150 50
            C 180 10, 200 90, 150 50
            C 100 10, 80 90, 50 50
          "
          fill="none"
          stroke="url(#infinityGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="260"
          strokeDashoffset="260"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="260;0;260"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Slight rotation for premium feel */}
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 50"
          to="360 100 50"
          dur="6s"
          repeatCount="indefinite"
        />
      </svg>
    </div>
  );
};

export default InfinityLoader;
