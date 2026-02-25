import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoModal from "../components/ui/videoModal";
import VideoUploadModal from "../components/ui/Videouploadmodal";
import { groupedVideos } from "../data/promotion_videos";
import { FiDownload } from "react-icons/fi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import axios from "../services/api";
import { jwtDecode } from "jwt-decode";
import QuarterBurstLoaderStatic from "./ui/multiArcLoader";
import TrueFocus from "./ui/TrueFocus";
import PremiumMembershipModal from "../components/PremiumMembershipModal"; // adjust path
import {
  shouldBlockUpload,
  saveMembership,
  hasActiveMembership,
  MembershipType,
} from "../utils/Membershiputils";

export interface Video {
  id: number;
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  price: number;
  type: string;
}

const VideoGallery: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem("parsedate") || "{}");
  const isSuperAdmin = userData?.role === "superadmin";
  const navigate = useNavigate();

  // 🧮 Load counts
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(() => {
    return JSON.parse(localStorage.getItem("templateDownloadCounts") || "{}");
  });
  
  useEffect(() => {
    const storedCounts = JSON.parse(localStorage.getItem("templateDownloadCounts") || "{}");
    setDownloadCounts(storedCounts);
  }, []);

  const [email, setemail] = useState("");
  const [centerid, setcenterid] = useState("");
  
  // ⏱️ Simulate loading for 1-2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // 🧩 Combine all videos from all categories and sort in descending order (latest first)
  const allVideos = useMemo(
    () => groupedVideos.flatMap((group) => group.videos).sort((a, b) => b.id - a.id),
    []
  );

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      try {
        const decoded = jwtDecode(token);
        setemail(decoded.datastore.email);
        setcenterid(decoded.datastore.Centerid);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const openModal = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  // 📤 Handle Upload Success from Modal
const handleUploadSuccess = (videoUrl: string, videoTitle: string, showWatermark?: boolean) => {
    // Show success message
    Swal.fire({
      icon: "success",
      title: "Video Uploaded!",
      text: "Redirecting to editor...",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    // Navigate to video editor with the uploaded video
 setTimeout(() => {
    navigate("/video-editor", {
      state: {
        videoUrl,
        videoTitle,
        showWatermark: showWatermark ?? false, // ✅ pass to editor
      },
    });
  }, 1500);
  };

  // 📥 Shared Download Handler
  const handleDownload = async (url: string, title: string, id: number) => {
    if (!url) return;

    try {
      let type = "videos";
      const res = await axios.post("/api/statsdownload", { email, centerid, type });
      if (res.data.success) {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = `${title.replace(/\s+/g, "_")}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);

        // ✅ Increment count after successful download
        setDownloadCounts((prev) => ({
          ...prev,
          [id]: (prev[id] || 0) + 1,
        }));

        Swal.fire({
          icon: "success",
          title: "Download Started!",
          text: "Your video is being downloaded successfully.",
          timer: 2500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Download Failed!",
        text: "Unable to download the video. Please try again.",
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };
const handleUploadButtonClick = () => {
  if (shouldBlockUpload()) {
    // Free limit hit, no active membership → show membership modal directly
    setIsMembershipModalOpen(true);
  } else {
    setIsUploadModalOpen(true);
  }
};

const handleMembershipSelect = (planId: string) => {
  if (planId === "free") return;
  saveMembership(planId as MembershipType);
  setIsMembershipModalOpen(false);
  // Now open the upload modal since user just bought a plan
  setIsUploadModalOpen(true);
};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren" as const,
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-white">
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${isLoading ? 'blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {/* 🏷️ Header with Upload Button */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              {/* Left spacer (keeps center truly centered) */}
              <div className="w-1/4 hidden sm:block" />

              {/* Center Heading */}
              <div className="w-full sm:w-1/2 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4E86]">
                  Promotional Videos Gallery
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Explore categorized marketing and promotional videos
                </p>
              </div>

              {/* Right Upload Button */}
              <div className="w-1/4 flex justify-end">
                <button
                  onClick={handleUploadButtonClick}
                  className="cursor-pointer select-none"
                >
                  <div className="scale-90">
                    <TrueFocus
                      sentence="Upload Video"
                      manualMode={false}
                      blurAmount={6}
                      borderColor="#3d5fa3"
                      animationDuration={0.6}
                      pauseBetweenAnimations={1}
                    />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* 🎞️ Videos Grid */}
          {allVideos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No videos found.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
              >
                {allVideos.map((video, index) => (
                  <motion.div
                    key={video._id || `video-${index}`}
                    layout
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{
                      layout: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
                    }}
                    className="flex flex-col cursor-pointer"
                    onClick={() => openModal(video)}
                  >
                    {/* 🖼️ Video Thumbnail */}
                    <div className="w-full aspect-square overflow-hidden relative bg-gray-900">
                      {video.videoUrl ? (
                        <>
                          <video
                            src={video.videoUrl}
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                            onLoadedMetadata={(e) => {
                              e.currentTarget.currentTime = 0.1;
                            }}
                          />
                          {/* ▶️ Play Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                              <svg
                                className="w-8 h-8 text-[#2C4E86] ml-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 h-full text-gray-500">
                          <svg
                            className="w-16 h-16 mb-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                          <p className="text-xs">Video Preview</p>
                          <p className="text-xs text-gray-400 mt-1">Click to play</p>
                        </div>
                      )}
                    </div>

                    {/* 📘 Info below thumbnail */}
                    <div className="mt-3 flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-snug">
                          {video.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-3">
                        {/* Edit */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/video-editor", {
                              state: {
                                videoUrl: video.videoUrl,
                                videoTitle: video.title,
                              },
                            });
                          }}
                          className="p-1.5 rounded hover:bg-gray-100"
                          title="Edit Video"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>

                        {/* Download */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(video.videoUrl, video.title, video.id);
                          }}
                          className="p-1.5 rounded hover:bg-gray-100"
                          title="Download Video"
                        >
                          <FiDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* 🪟 Video Preview Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        video={selectedVideo}
      />

      {/* 📤 Video Upload Modal */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
         showWatermark={true}
      />

 {isMembershipModalOpen && (
   <PremiumMembershipModal
     onClose={() => setIsMembershipModalOpen(false)}
     onSelectPlan={handleMembershipSelect}
   />
 )}


      {/* 🔄 Loader Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
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

export default VideoGallery;