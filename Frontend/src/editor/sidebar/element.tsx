import React, { useEffect, useRef, useState } from "react";
import type * as FabricNamespace from "fabric";
import { shapeDefinitions } from "@/fabric/shapes/shape-defination";
import { useEditorStore } from "@/store/store";
import { addShapeToCanvas } from "@/fabric/fabric-utils";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Fi from "react-icons/fi";
import * as Md from "react-icons/md";
import * as Bs from "react-icons/bs";
import * as Fa from "react-icons/fa6";
// 🎨 react-icons — curated sets from different packs
import {
  FiStar, FiHeart, FiHome, FiMail, FiPhone, FiSearch,
  FiShare2, FiBookmark, FiCamera, FiMusic, FiSettings,
  FiDownload, FiUpload, FiEdit, FiTrash2, FiPlusCircle,
  FiMinusCircle, FiCopy, FiLink, FiLock, FiUnlock,
  FiEye, FiEyeOff, FiFilter, FiGrid, FiList,
  FiAlignLeft, FiAlignCenter, FiAlignRight,
  FiBold, FiItalic, FiUnderline,
  FiAlertCircle, FiCheckCircle, FiCheckSquare,
  FiXCircle, FiInfo,
  FiArrowRight, FiArrowLeft, FiArrowUp, FiArrowDown,
  FiImage, FiVideo
} from "react-icons/fi";
import {
  MdCheckCircle,
  MdThumbDown,
  MdMessage,
  MdShoppingCart,
  MdStore,
  MdSupportAgent
} from "react-icons/md";

import {
  MdSchool, MdWork, MdPerson, MdGroups, MdLocationOn,
  MdCalendarToday, MdAttachMoney, MdBarChart, MdPieChart,
  MdNotifications, MdVerified, MdThumbUp, MdCelebration,
} from "react-icons/md";

import {
  BsRocketTakeoff, BsTrophy, BsLightbulb, BsGlobe,
  BsClock, BsShieldCheck, BsFlag, BsGift,
} from "react-icons/bs";
import { FaBehance, FaDiscord, FaDribbble, FaFacebook, FaFacebookF, FaGithub, FaInstagram, FaLinkedin, FaMedium, FaPinterest, FaReddit, FaSkype, FaSnapchat, FaTelegram, FaTiktok, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";

// 🗂️ Icon registry — { label, component }
const iconRegistry = [
  // ================= Feather (UI / Editing)
  { label: "Star", Icon: FiStar },
  { label: "Heart", Icon: FiHeart },
  { label: "Home", Icon: FiHome },
  { label: "Mail", Icon: FiMail },
  { label: "Phone", Icon: FiPhone },
  { label: "Search", Icon: FiSearch },
  { label: "Share", Icon: FiShare2 },
  { label: "Bookmark", Icon: FiBookmark },
  { label: "Camera", Icon: FiCamera },
  { label: "Image", Icon: FiImage },
  { label: "Video", Icon: FiVideo },
  { label: "Music", Icon: FiMusic },
  { label: "Settings", Icon: FiSettings },
  { label: "Download", Icon: FiDownload },
  { label: "Upload", Icon: FiUpload },
  { label: "Edit", Icon: FiEdit },
  { label: "Delete", Icon: FiTrash2 },
  { label: "Add", Icon: FiPlusCircle },
  { label: "Minus", Icon: FiMinusCircle },
  { label: "Copy", Icon: FiCopy },
  { label: "Link", Icon: FiLink },
  { label: "Lock", Icon: FiLock },
  { label: "Unlock", Icon: FiUnlock },
  { label: "Eye", Icon: FiEye },
  { label: "Eye Off", Icon: FiEyeOff },
  { label: "Filter", Icon: FiFilter },
  { label: "Grid", Icon: FiGrid },
  { label: "List", Icon: FiList },
  { label: "Align Left", Icon: FiAlignLeft },
  { label: "Align Center", Icon: FiAlignCenter },
  { label: "Align Right", Icon: FiAlignRight },
  { label: "Bold", Icon: FiBold },
  { label: "Italic", Icon: FiItalic },
  { label: "Underline", Icon: FiUnderline },
  { label: "Alert", Icon: FiAlertCircle },
  { label: "Info", Icon: FiInfo },

  // ===== Check Marks / Validation
  { label: "Check", Icon: FiCheckCircle },
  { label: "Check Square", Icon: FiCheckSquare },
  { label: "Success", Icon: MdCheckCircle },
  { label: "Verified", Icon: MdVerified },
  { label: "Shield Check", Icon: BsShieldCheck },
  { label: "Badge Check", Icon: Bs.BsPatchCheck },

  // ================= Material (Business / Sections)
  { label: "School", Icon: MdSchool },
  { label: "Work", Icon: MdWork },
  { label: "Person", Icon: MdPerson },
  { label: "Groups", Icon: MdGroups },
  { label: "Location", Icon: MdLocationOn },
  { label: "Calendar", Icon: MdCalendarToday },
  { label: "Money", Icon: MdAttachMoney },
  { label: "Bar Chart", Icon: MdBarChart },
  { label: "Pie Chart", Icon: MdPieChart },
  { label: "Notifications", Icon: MdNotifications },
  { label: "Thumb Up", Icon: MdThumbUp },
  { label: "Thumb Down", Icon: MdThumbDown },
  { label: "Message", Icon: MdMessage },
  { label: "Shopping Cart", Icon: MdShoppingCart },
  { label: "Store", Icon: MdStore },
  { label: "Support", Icon: MdSupportAgent },

  // ================= Bootstrap (CTA / Highlight)
  { label: "Rocket", Icon: BsRocketTakeoff },
  { label: "Trophy", Icon: BsTrophy },
  { label: "Idea", Icon: BsLightbulb },
  { label: "Globe", Icon: BsGlobe },
  { label: "Clock", Icon: BsClock },
  { label: "Flag", Icon: BsFlag },
  { label: "Gift", Icon: BsGift },
  { label: "Award", Icon: Bs.BsAward },
  { label: "Star Fill", Icon: Bs.BsStarFill },
  { label: "Fire", Icon: Bs.BsFire },

  // ================= Social Media (ALL Major Platforms)

  { label: "Facebook", Icon: FaFacebook },
  { label: "Facebook Fill", Icon: FaFacebookF },
  { label: "Instagram", Icon: FaInstagram },
  { label: "Twitter", Icon: FaTwitter },
  { label: "X (Twitter)", Icon: Fa.FaXTwitter },
  { label: "LinkedIn", Icon: FaLinkedin },
  { label: "YouTube", Icon: FaYoutube },
  { label: "WhatsApp", Icon: FaWhatsapp },
  { label: "Telegram", Icon: FaTelegram },
  { label: "Snapchat", Icon: FaSnapchat },
  { label: "Pinterest", Icon: FaPinterest },
  { label: "Reddit", Icon: FaReddit },
  { label: "Discord", Icon: FaDiscord },
  { label: "GitHub", Icon: FaGithub },
  { label: "Dribbble", Icon: FaDribbble },
  { label: "Behance", Icon: FaBehance },
  { label: "Skype", Icon: FaSkype },
  { label: "Medium", Icon: FaMedium },
  { label: "Tiktok", Icon: FaTiktok },
  { label: "Threads", Icon: Fa.FaThreads },
];

function ElementsPanel() {
  const { canvas } = useEditorStore();
  const miniCanvasRef = useRef<Record<string, FabricNamespace.StaticCanvas>>({});
  const canvasElementRef = useRef<Record<string, HTMLCanvasElement | null>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<"shapes" | "icons" | "emojis">("shapes");
  const [iconSearch, setIconSearch] = useState("");

  const shapeTypes = Object.keys(shapeDefinitions);

  // Filter icons by search
  const filteredIcons = iconRegistry.filter((i) =>
    i.label.toLowerCase().includes(iconSearch.toLowerCase())
  );

  // ── Shape mini-canvas init ──────────────────────────────────────────────
  useEffect(() => {
    if (isInitialized || activeTab !== "shapes") return;

    const timer = setTimeout(async () => {
      try {
        const fabricModule: any = await import("fabric");
        const fabric: typeof FabricNamespace =
          fabricModule.fabric || fabricModule.default || fabricModule;

        for (const shapeType of shapeTypes) {
          const canvasElement = canvasElementRef.current[shapeType];
          if (!canvasElement) continue;
          const canvasId = `mini-canvas-${shapeType}-${Date.now()}`;
          canvasElement.id = canvasId;
          const definition = shapeDefinitions[shapeType];
          const miniCanvas = new fabric.StaticCanvas(canvasId, {
            width: 100,
            height: 100,
            // backgroundColor:  "#f3f4f6",
            renderOnAddRemove: true,
          });
          miniCanvasRef.current[shapeType] = miniCanvas;
          definition.thumbnail(fabric, miniCanvas);
          miniCanvas.renderAll();
        }
        setIsInitialized(true);
      } catch (err) {
        console.error("Error initializing mini canvases:", err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isInitialized, shapeTypes, activeTab]);

  useEffect(() => {
    return () => {
      Object.values(miniCanvasRef.current).forEach((miniCanvas) => {
        try { miniCanvas?.dispose?.(); } catch (e) {}
      });
      miniCanvasRef.current = {};
      setIsInitialized(false);
    };
  }, []);

  // ✅ Reset when leaving shapes tab so it re-renders on return
useEffect(() => {
  if (activeTab !== "shapes") {
    // Dispose old mini canvases
    Object.values(miniCanvasRef.current).forEach((miniCanvas) => {
      try { miniCanvas?.dispose?.(); } catch (e) {}
    });
    miniCanvasRef.current = {};
    setIsInitialized(false);
  }
}, [activeTab]);

  const setCanvasRef = (element: HTMLCanvasElement | null, shapeType: string) => {
    if (element) canvasElementRef.current[shapeType] = element;
  };

  const handleShapeClick = (type: string) => {
    addShapeToCanvas(canvas, type);
  };

  // ── Add EMOJI to Fabric canvas ──────────────────────────────────────────
const handleEmojiClick = async (emojiData: EmojiClickData) => {
  if (!canvas) return;

  // ✅ Fabric 6: import IText directly as named export
  const { IText } = await import("fabric");

  const emojiText = new IText(emojiData.emoji, {
    left: canvas.getWidth() / 2 - 30,
    top: canvas.getHeight() / 2 - 30,
    fontSize: 60,
    selectable: true,
    hasControls: true,
    editable: false,
  });

  canvas.add(emojiText);
  canvas.setActiveObject(emojiText);
  canvas.renderAll();
};

  // ── Add ICON (SVG string from react-icons) to Fabric canvas ─────────────
const handleIconClick = async (Icon: React.ComponentType<any>) => {
  if (!canvas) return;
  const fabricModule: any = await import("fabric");
  const fabric = fabricModule.fabric || fabricModule.default || fabricModule;

  // Render icon to temp DOM
  const tempDiv = document.createElement("div");
  tempDiv.style.cssText = "position:absolute;visibility:hidden;top:-9999px;left:-9999px;";
  document.body.appendChild(tempDiv);

  const { createRoot } = await import("react-dom/client");
  const root = createRoot(tempDiv);

  await new Promise<void>((resolve) => {
    root.render(<Icon size={80} color="#1e1e1e" />);
    setTimeout(resolve, 80);
  });

  const svgEl = tempDiv.querySelector("svg");
  if (!svgEl) {
    root.unmount();
    document.body.removeChild(tempDiv);
    return;
  }

  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgString = svgEl.outerHTML;
  root.unmount();
  document.body.removeChild(tempDiv);

  try {
    // ✅ Fabric 6: loadSVGFromString returns a Promise, NOT a callback
    const { objects, options } = await fabric.loadSVGFromString(svgString);
    
    if (!objects || objects.length === 0) return;

const group = new fabric.Group(objects.filter(Boolean), {
  left: canvas.getWidth() / 2 - 40,
  top: canvas.getHeight() / 2 - 40,
  scaleX: 1.5,
  scaleY: 1.5,
  selectable: true,
  hasControls: true,
  // ✅ Custom tag so Properties panel can detect it
  data: { type: "icon" },
});

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  } catch (err) {
    console.error("SVG load error:", err);
  }
};

  // ── Tabs config ──────────────────────────────────────────────────────────
  const tabs = [
    { key: "shapes", label: "Shapes" },
    { key: "icons",  label: "Icons"  },
    { key: "emojis", label: "Emojis" },
  ] as const;

  return (
    <div className="h-full flex flex-col bg-white">

      {/* 🔘 Tab Bar */}
      <div className="flex border-b border-gray-200">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === key
                ? "border-b-2 border-[#2C4E86] text-[#2C4E86]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 📦 Tab Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── SHAPES ── */}
        {activeTab === "shapes" && (
          <div className="p-3 grid grid-cols-3 gap-4">
            {shapeTypes.map((shapeType) => (
              <div
                key={shapeType}
                onClick={() => handleShapeClick(shapeType)}
                className="cursor-pointer flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <canvas
                  width={100}
                  height={100}
                  ref={(el) => setCanvasRef(el, shapeType)}
                />
                <p className="text-xs mt-2 text-gray-700 font-medium text-center">
                  {shapeDefinitions[shapeType].label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── ICONS ── */}
        {activeTab === "icons" && (
          <div className="p-3 space-y-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search icons..."
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C4E86]"
            />

            {/* Grid */}
            <div className="grid grid-cols-3 gap-2">
              {filteredIcons.map(({ label, Icon }) => (
                <button
                  key={label}
                  onClick={() => handleIconClick(Icon)}
                  title={label}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-blue-50 hover:text-[#2C4E86] text-gray-600 active:scale-95 transition-all group"
                >
                  <Icon size={28} />
                  <span className="text-[10px] text-gray-500 group-hover:text-[#2C4E86] leading-tight text-center">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {filteredIcons.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">
                No icons found for "{iconSearch}"
              </p>
            )}
          </div>
        )}

        {/* ── EMOJIS ── */}
        {activeTab === "emojis" && (
          <div className="w-full">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
              height={420}
              searchPlaceholder="Search emojis..."
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default ElementsPanel;