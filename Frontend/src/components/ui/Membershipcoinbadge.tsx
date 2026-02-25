import React, { useEffect, useState } from "react";
import { getMembership, Membership } from "../../utils/Membershiputils"; // adjust path
import { TbCoinRupee } from "react-icons/tb";

const MembershipCoinBadge: React.FC = () => {
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    setMembership(getMembership());
    const onStorage = () => setMembership(getMembership());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!membership || membership.credits <= 0) return null;

  const isPremium = membership.type === "premium";

  // Silver = Premium plan | Gold = Standard plan
  const config = isPremium
    ? {
        wrapperClass:
          "",
        iconColor: "#94a3b8",
        iconShadow: "0 0 8px #94a3b8aa",
        planLabel: "Premium",
        planClass: "text-slate-400",
        creditsClass: "text-slate-700",
        dividerClass: "bg-slate-300",
        badgeClass: "bg-slate-500 text-white",
      }
    : {
        wrapperClass:
          "",
        iconColor: "#d97706",
        iconShadow: "",
        planLabel: "Standard",
        planClass: "text-amber-500",
        creditsClass: "text-amber-900",
        dividerClass: "bg-amber-300",
        badgeClass: "bg-amber-500 text-white",
      };

  return (
    <div
      title={`${config.planLabel} — ${membership.credits} credits remaining`}
      className={`
        flex items-center gap-2 pl-2 pr-3 py-1.5
        rounded-xl cursor-default select-none
        transition-all duration-200 hover:scale-[1.02]
        ${config.wrapperClass}
      `}
    >
      {/* Coin Icon */}
      <TbCoinRupee
        size={24}
        className="shrink-0"
        style={{
          color: config.iconColor,
        //   filter: `drop-shadow(${config.iconShadow})`,
        }}
      />

      {/* Divider */}
      <div className={`w-px h-6 ${config.dividerClass} opacity-60`} />

      {/* Text block */}
      <div className="flex flex-col leading-none gap-0.5">
        {/* Plan name */}
        {/* <span className={`text-[10px] font-semibold uppercase tracking-wide ${config.planClass}`}>
          {config.planLabel}
        </span> */}
        {/* Credits */}
        <div className="flex items-baseline gap-0.5">
          <span className={`text-[15px] font-extrabold tracking-tight ${config.creditsClass}`}>
            {membership.credits}
          </span>
          <span className={`text-[12px] font-medium text-gray-400 leading-none ${config.creditsClass}`}>credits</span>
        </div>
      </div>
    </div>
  );
};

export default MembershipCoinBadge;