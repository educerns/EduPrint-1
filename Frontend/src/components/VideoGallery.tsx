import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoModal from "../components/ui/videoModal";
import VideoUploadModal from "../components/ui/Videouploadmodal";
import { FiDownload } from "react-icons/fi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import axios from "../services/api";
import { jwtDecode } from "jwt-decode";
import QuarterBurstLoaderStatic from "./ui/multiArcLoader";
import TrueFocus from "./ui/TrueFocus";

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  price: number;
  type: string;
  createdAt?: string;
}

const VideoGallery: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("All");

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [videos, setVideos] = useState<Video[]>([]);

  const [email, setemail] = useState("");
  const [centerid, setcenterid] = useState("");
  const navigate = useNavigate();

  // Decode Token for User Details
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      try {
        const decoded: any = jwtDecode(token);
        setemail(decoded.datastore.email);
        setcenterid(decoded.datastore.Centerid);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  // 📡 Fetch Dynamic Videos from Backend
  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      setIsLoading(true);
      setVideos([]); // ✨ Instantly clear old videos to prevent ghosting
      setError(false);

      // ✨ Scroll to top on every fetch trigger (tab change or page change)
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const apiParams = {
          type: filter,
          page: currentPage,
          limit: 12,
        };

        const res = await axios.get("/eduprint/getvideos", { params: apiParams });

        if (isMounted) {
          if (res.data?.success) {
            setVideos(res.data.data || []);
            setTotalPages(res.data.totalPages || 1);
          } else {
            setVideos([]);
            setError(true);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load videos:", err);
          setError(true);
          setVideos([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, [filter, currentPage]);

  const openModal = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const handleUploadSuccess = (videoUrl: string, videoTitle: string) => {
    Swal.fire({
      icon: "success",
      title: "Video Uploaded!",
      text: "Redirecting to editor...",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    setTimeout(() => {
      navigate("/video-editor", {
        state: { videoUrl, videoTitle },
      });
    }, 1500);
  };

  // 📥 Dynamic Download Handler with Backend Tracking
  const handleDownload = async (url: string, title: string, mediaId: string) => {
    if (!url) return;

    try {
      const res = await axios.post("/api/statsdownload", {
        email: email,
        centerid: centerid,
        type: "videos",
        mediaId: mediaId
      });

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

        Swal.fire({
          icon: "success",
          title: "Download Started!",
          text: "Your video is being downloaded successfully.",
          timer: 2500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      }
    } catch (err) {
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

  // 🔥 Helper to generate page numbers for custom pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-white relative">
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${isLoading ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <div className="w-1/4 hidden sm:block" />
              <div className="w-full sm:w-1/2 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4E86]">
                  Promotional Videos Gallery
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Explore categorized marketing and promotional videos
                </p>
              </div>

              <div className="w-1/4 flex justify-end">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
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

          {/* Category Tabs */}
          <div className="flex gap-3 mb-8">
            {["All", "Demo", "Registration", "Promotion", "Festival"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab);
                  setCurrentPage(1); // ✨ Reset page directly here to prevent double fetch
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${filter === tab
                    ? "bg-[#2C4E86] text-white border-[#2C4E86]"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg">
              <p>Failed to load videos. Please check your connection and try again.</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && videos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No videos found.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + filter}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
              >
                {videos.map((video, index) => (
                  <motion.div
                    key={video._id || `video-${index}`}
                    layout
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col cursor-pointer"
                    onClick={() => openModal(video)}
                  >
                    <div className="w-full aspect-square overflow-hidden relative bg-gray-900 rounded-lg">
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
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                              <svg className="w-8 h-8 text-[#2C4E86] ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 h-full text-gray-500">
                          <p className="text-xs">Video Preview</p>
                        </div>
                      )}
                    </div>

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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/video-editor", {
                              state: { videoUrl: video.videoUrl, videoTitle: video.title },
                            });
                          }}
                          className="p-1.5 rounded hover:bg-gray-100"
                          title="Edit Video"
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(video.videoUrl, video.title, video._id);
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

          {/* 🔥 Clean Custom Pagination directly in the file */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 mb-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition ${currentPage === page
                        ? "bg-[#2C4E86] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <VideoModal isOpen={isModalOpen} onClose={closeModal} video={selectedVideo} />
      <VideoUploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUploadSuccess={handleUploadSuccess} />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-50 min-h-[50vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <QuarterBurstLoaderStatic />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default VideoGallery;