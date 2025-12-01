import React from "react";

const QuarterBurstLoaderStatic = () => {
  const arcs = [
    { d: "M0 2 A82 116 0 0 0 -80 -80", color: "#ee4341", delay: "0s" },
    { d: "M1 0 A86 90 0 0 0 -35 -85", color: "#f6881d", delay: "0.15s" },
    { d: "M0 0 A82 82 0 0 0 -20 -94", color: "#25b9e9", delay: "0.3s" },
    { d: "M0 0 A88 88 0 0 0 -5 -99", color: "#0a58a4", delay: "0.45s" },
    { d: "M1 0 A86 90 0 0 0 25 -85", color: "#15873d", delay: "0.6s" },
  ];

  return (
    <div className="flex justify-center items-center w-full h-[180px] ">
      <svg width="220" height="220" viewBox="0 0 220 220">
        <g transform="translate(110,110) rotate(-35)">
          {arcs.map((arc, i) => (
           <path
  key={i}
  d={arc.d}
  stroke={arc.color}
  strokeWidth={4}
  strokeLinecap="round"
  fill="none"
  strokeDasharray="300"
  strokeDashoffset="300"
>
  {/* Stroke Draw Loop */}
  <animate
    attributeName="stroke-dashoffset"
    values="300;0;300"
    dur="1.2s"
    repeatCount="indefinite"
    keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"
    calcMode="spline"
  />

  {/* Fade Breathing (still staggered) */}
  <animate
    attributeName="opacity"
    values="0;1;0"
    dur="1.8s"
    repeatCount="indefinite"
    begin={arc.delay}
    keySplines="0.25 0.1 0.25 1"
    calcMode="spline"
  />
</path>

          ))}
        </g>
      </svg>
    </div>
  );
};

export default QuarterBurstLoaderStatic;
