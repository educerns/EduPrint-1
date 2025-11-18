import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Download,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  X,
  Bold,
  Italic,
  Underline,
  Edit2,
  Move,
  ArrowRight
} from 'lucide-react';
import ExportButton from './ui/exportButton';


interface Video {
  id: number;
  title: string;
  videoUrl: string;
}


interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  underline: boolean;
  color: string;
  backgroundColor: string;
  position: { x: number; y: number };
  opacity: number;
  letterSpacing?: number;
  lineHeight?: number;
  animation: string;
  animationDuration: number;
}


const fontFamilies = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", "Courier New", "Tahoma", "Impact", "Comic Sans MS",];



const presetColors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
];

const positionPresets = [
  { name: 'Top Left', x: 15, y: 15 },
  { name: 'Top Center', x: 50, y: 15 },
  { name: 'Top Right', x: 85, y: 15 },
  { name: 'Middle Left', x: 15, y: 50 },
  { name: 'Center', x: 50, y: 50 },
  { name: 'Middle Right', x: 85, y: 50 },
  { name: 'Bottom Left', x: 15, y: 85 },
  { name: 'Bottom Center', x: 50, y: 85 },
  { name: 'Bottom Right', x: 85, y: 85 },
];




const VideoEditor: React.FC = () => {
const location = useLocation();
const navigate = useNavigate();

// ✅ Get video data from route state OR sessionStorage (for deployment persistence)
const getVideoData = () => {
  const stateData = location.state;
  if (stateData?.videoUrl) {
    // Save to sessionStorage for page reloads
    sessionStorage.setItem('currentVideoUrl', stateData.videoUrl);
    sessionStorage.setItem('currentVideoTitle', stateData.videoTitle || 'Untitled Video');
    return stateData;
  }
  
  // Fallback to sessionStorage
  const savedUrl = sessionStorage.getItem('currentVideoUrl');
  const savedTitle = sessionStorage.getItem('currentVideoTitle');
  if (savedUrl) {
    return { videoUrl: savedUrl, videoTitle: savedTitle };
  }
  
  return { videoUrl: '', videoTitle: 'Untitled Video' };
};

const { videoUrl, videoTitle } = getVideoData();

const [currentVideo, setCurrentVideo] = useState({
  videoUrl: videoUrl || "",
  title: videoTitle || "Untitled Video",
});

const videoRef = useRef<HTMLVideoElement>(null);
const [videoError, setVideoError] = useState<string | null>(null);

useEffect(() => {
  if (!videoUrl) {
    console.error("No video URL provided");
    setVideoError("No video selected. Redirecting...");
    setTimeout(() => navigate("/"), 2000);
  }
}, [videoUrl, navigate]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState<number>(0);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [exportProgress, setExportProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
const audioContextRef = useRef<AudioContext | null>(null);



  const [newText, setNewText] = useState({
    text: 'Your Text Here',
    fontSize: 32,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    underline: false,
    color: '#ffffff',
    backgroundColor: 'transparent',
    position: { x: 50, y: 50 },
    opacity: 100,
    letterSpacing: 0,
    animation: 'none' as 'none' | 'fade-in' | 'fade-out' | 'fade-in-out' | 'slide-left' | 'slide-right' | 'zoom-in' | 'floating',
    animationDuration: 0.5
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !video || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Utility: set canvas pixel size to match visible CSS size (and account for DPR)
    const setCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      const cssWidth = Math.max(1, rect.width);
      const cssHeight = Math.max(1, rect.height);
      const dpr = window.devicePixelRatio || 1;

      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      // pixel size
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);

      // scale drawing ctx so 1 unit = 1 CSS pixel
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // call once on load and on resize
    const onLoaded = () => {
      setCanvasSize();
    };
    video.addEventListener("loadedmetadata", onLoaded);
    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();

    // We'll use rAF continuously while component mounted.
    // For timeline animations we use video.currentTime (so they tie to timeline).
    // For continuous animations (floating / ticker) we also use now = performance.now()/1000
    let rafId = 0;

    const renderFrame = () => {
      // compute time references
      const videoTime = Math.max(0, video.currentTime || 0);
      const wallTime = performance.now() / 1000; // seconds

      // clear and draw video scaled to canvas visible area
      const cssW = parseFloat(canvas.style.width || `${canvas.width}px`);
      const cssH = parseFloat(canvas.style.height || `${canvas.height}px`);

      // clear full canvas (CSS pixels)
      ctx.clearRect(0, 0, cssW, cssH);

      // draw the current video frame to fill the visible area while respecting aspect ratio
      // We'll fit video into the container (same logic you used earlier)
      const videoAspect = (video.videoWidth || cssW) / (video.videoHeight || cssH);
      const containerAspect = cssW / cssH;
      let drawW = cssW, drawH = cssH, offsetX = 0, offsetY = 0;
      if (videoAspect > containerAspect) {
        // video is wider -> fit width
        drawW = cssW;
        drawH = cssW / videoAspect;
        offsetY = (cssH - drawH) / 2;
      } else {
        // video taller -> fit height
        drawH = cssH;
        drawW = cssH * videoAspect;
        offsetX = (cssW - drawW) / 2;
      }

      // drawImage using CSS-space coordinates (ctx is scaled so 1 unit = 1 CSS px)
      try {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, offsetX, offsetY, drawW, drawH);
      } catch (err) {
        // drawImage can throw if video not ready; ignore
      }


// Replace the textOverlays.forEach section in renderFrame with this:

textOverlays.forEach((overlay) => {
  const now = videoTime;
  if (now < overlay.startTime || now > overlay.endTime) {
    return;
  }

  ctx.save();

  // Define video area boundaries
  const videoAreaStartX = offsetX;
  const videoAreaStartY = offsetY;
  const videoAreaEndX = offsetX + drawW;
  const videoAreaEndY = offsetY + drawH;

  // 🔒 Create clipping region to prevent text from going outside video
  ctx.beginPath();
  ctx.rect(videoAreaStartX, videoAreaStartY, drawW, drawH);
  ctx.clip();

  // Calculate text position within video area
  const textX = videoAreaStartX + (overlay.position.x / 100) * drawW;
  const textY = videoAreaStartY + (overlay.position.y / 100) * drawH;

  // Set font
  const fontStyle = overlay.fontStyle === "italic" ? "italic" : "normal";
  const fontWeight = overlay.fontWeight || "normal";
  ctx.font = `${fontStyle} ${fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // compute progress of overlay timeline 0..1
  const totalDur = Math.max(0.001, overlay.endTime - overlay.startTime);
  const progress = (now - overlay.startTime) / totalDur;

  // base opacity
  let opacity = (overlay.opacity ?? 100) / 100;

  // animation modifiers
  let dx = 0, dy = 0, scale = 1;

  const animDur = Math.min(totalDur, Math.max(0.001, overlay.animationDuration || 0.5));
  const animFraction = animDur / totalDur;

  switch (overlay.animation) {
    case "fade-in":
      {
        const local = Math.min(1, progress / animFraction);
        opacity *= local;
      }
      break;
    case "fade-out":
      {
        const local = Math.min(1, (1 - progress) / animFraction);
        opacity *= local;
      }
      break;
    case "fade-in-out":
      {
        if (progress < 0.5) {
          const local = Math.min(1, (progress * 2) / animFraction);
          opacity *= local;
        } else {
          const local = Math.min(1, ((1 - progress) * 2) / animFraction);
          opacity *= local;
        }
      }
      break;
    case "slide-left":
      dx = (1 - progress) * (drawW * 0.25);
      break;
    case "slide-right":
      dx = -(1 - progress) * (drawW * 0.25);
      break;
    case "zoom-in":
      scale = 0.8 + 0.2 * Math.min(1, progress / animFraction);
      break;
    case "floating":
      dy = Math.sin(now * 2 * Math.PI) * 10;
      break;
    case "ticker": {
      const speed = 100;
      const textWidth = ctx.measureText(overlay.text).width;
      const timeOffset = (now * speed) % (textWidth * 2);

      // Ticker moves horizontally within video bounds
      for (let offset = -textWidth * 2; offset < drawW + textWidth * 2; offset += textWidth * 2) {
        const xPos = videoAreaStartX + drawW - (timeOffset + offset);
        
        // Only draw if within horizontal bounds
        if (xPos + textWidth / 2 > videoAreaStartX && xPos - textWidth / 2 < videoAreaEndX) {
          ctx.fillStyle = overlay.color;
          ctx.globalAlpha = opacity;
          ctx.fillText(overlay.text, xPos, videoAreaStartY + drawH * 0.9);
        }
      }

      ctx.restore();
      return;
    }
    default:
      break;
  }

  ctx.globalAlpha = opacity;

  // apply transforms (translate to position; scale/translate by dx/dy)
  ctx.translate(textX + dx, textY + dy);
  ctx.scale(scale, scale);

  // text layout
  const lines = overlay.text.split("\n");
  const lineHeight = overlay.lineHeight || overlay.fontSize * 1.2;
  const letterSpacing = overlay.letterSpacing || 0;
  const totalHeight = lines.length * lineHeight;
  const startY = -totalHeight / 2 + lineHeight / 2;

  // draw each line
  lines.forEach((line, i) => {
    const metrics = ctx.measureText(line);
    const lineY = startY + i * lineHeight;

    if (overlay.backgroundColor && overlay.backgroundColor !== "transparent") {
      const padding = 8;
      const bgW = metrics.width + padding * 2 + Math.abs(letterSpacing) * line.length;
      ctx.fillStyle = overlay.backgroundColor;
      ctx.fillRect(-bgW / 2, lineY - overlay.fontSize / 2 - padding, bgW, overlay.fontSize + padding * 2);
    }

    if (overlay.underline) {
      ctx.strokeStyle = overlay.color;
      ctx.lineWidth = Math.max(1, overlay.fontSize * 0.06);
      ctx.beginPath();
      ctx.moveTo(-metrics.width / 2, lineY + overlay.fontSize / 2 + 2);
      ctx.lineTo(metrics.width / 2, lineY + overlay.fontSize / 2 + 2);
      ctx.stroke();
    }

    ctx.fillStyle = overlay.color;
    if (letterSpacing !== 0) {
      let currentX = -metrics.width / 2;
      for (const ch of line) {
        ctx.fillText(ch, currentX + ctx.measureText(ch).width / 2, lineY);
        currentX += ctx.measureText(ch).width + letterSpacing;
      }
    } else {
      ctx.fillText(line, 0, lineY);
    }
  });

  ctx.restore();
});

      rafId = requestAnimationFrame(renderFrame);
    };

    // start the loop
    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", onLoaded);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [textOverlays]); 

  useEffect(() => {
  return () => {
    audioSourceRef.current?.disconnect();
  };
}, []);





  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedOverlay || !canvasRef.current) return;

    const overlay = textOverlays.find(o => o.id === selectedOverlay);
    if (!overlay || overlay.animation === 'floating') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setDragOffset({
      x: x - overlay.position.x,
      y: y - overlay.position.y
    });
    setIsDragging(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedOverlay || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.x));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.y));

    updateOverlay(selectedOverlay, { position: { x, y } });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

const togglePlayPause = async () => {
  const video = videoRef.current;
  if (!video) return;

  // Initialize audio context if needed
  if (!audioContextRef.current) {
    audioContextRef.current = new AudioContext();
  }

  // Resume audio context if suspended
  if (audioContextRef.current.state === "suspended") {
    await audioContextRef.current.resume();
  }

  // Create audio source only once
  if (!audioSourceRef.current) {
    audioSourceRef.current = audioContextRef.current.createMediaElementSource(video);
    // Connect to destination for playback
    audioSourceRef.current.connect(audioContextRef.current.destination);
  }

  if (isPlaying) {
    video.pause();
    setIsPlaying(false);
  } else {
    try {
      await video.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Video play failed:", err);
      setIsPlaying(false);
    }
  }
};

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const addTextOverlay = () => {
    const overlay: TextOverlay = {
      id: Date.now().toString(),
      text: newText.text,
      startTime: currentTime,
      endTime: Math.min(currentTime + 3, duration),
      fontSize: newText.fontSize,
      fontFamily: newText.fontFamily,
      fontWeight: newText.fontWeight,
      fontStyle: newText.fontStyle,
      underline: newText.underline,
      color: newText.color,
      backgroundColor: newText.backgroundColor,
      position: newText.position,
      opacity: newText.opacity,
      letterSpacing: newText.letterSpacing,
      animation: newText.animation,
      animationDuration: newText.animationDuration
    };

    setTextOverlays([...textOverlays, overlay]);
    setShowTextPanel(false);
    setSelectedOverlay(overlay.id);
    setPanelCollapsed(false);
  };

  const removeOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter(o => o.id !== id));
    if (selectedOverlay === id) {
      setSelectedOverlay(null);
      setPanelCollapsed(true);
    }
  };

  const updateOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(textOverlays.map(o =>
      o.id === id ? { ...o, ...updates } : o
    ));
  };

// FULLY WORKING EXPORT FUNCTION
const exportVideo = async () => {
  try {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    setIsExporting(true);

    // 1️⃣ Canvas → video track
    const canvasStream = canvas.captureStream(30);

    // 2️⃣ Reuse existing audio context and source node (important!)
    const audioContext = audioContextRef.current;
    const sourceNode = audioSourceRef.current;

    if (!audioContext || !sourceNode) {
      alert("Please click PLAY once before exporting!");
      setIsExporting(false);
      return;
    }

    const destination = audioContext.createMediaStreamDestination();
    sourceNode.connect(destination);

    await audioContext.resume();

    const audioTrack = destination.stream.getAudioTracks()[0];

    // 3️⃣ Final combined stream
    const finalStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      audioTrack
    ]);

    // 4️⃣ Record stream
    const recorder = new MediaRecorder(finalStream, {
      mimeType: "video/webm;codecs=vp9"
    });

    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentVideo.title}_edited_with_audio.webm`;
      a.click();

      URL.revokeObjectURL(url);
      setIsExporting(false);
    };

    // 5️⃣ Start export
    video.currentTime = 0;
    await video.play();

    recorder.start();

    video.onended = () => {
      recorder.stop();
      setIsPlaying(false);
    };

    setIsPlaying(true);

  } catch (error) {
    console.error("Export failed:", error);
    alert("Export failed. Please try again.");
    setIsExporting(false);
  }
};


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-x-hidden">

      {/* Error Display */}
        {videoError && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            ⚠️ {videoError}
          </div>
        )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          🎬 Editing: {currentVideo.title}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2C4E86] text-white rounded-lg hover:bg-blue-900 whitespace-nowrap"
        >

          <span>Back</span>
          <ArrowRight />
        </button>

      </div>

      {/* <div className="flex flex-col items-center">
        {currentVideo.videoUrl ? (
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            controls
            className="rounded-lg shadow-md w-full max-w-4xl"
          />
        ) : (
          <p className="text-gray-500 mt-10">No video selected.</p>
        )}
      </div> */}


      <div className="max-w-7xl mx-auto w-full">
        {/* <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Video Editor</h1>
          <p className="text-gray-600">Add text overlays with advanced styling, positioning, and animations</p>
        </motion.div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <div
                ref={canvasContainerRef}
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  background: "black",
                  position: "relative",
                }}
              >

                <canvas
                  ref={canvasRef}
                  className="object-contain transition-all duration-300"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  style={{ position: "absolute", inset: 0 }}
                />


               <video
                  ref={videoRef}
                  src={currentVideo.videoUrl}
                  className="hidden"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error("Video load error:", e);
                    setVideoError("Failed to load video. Please check the URL or CORS settings.");
                  }}
                  onLoadedData={() => {
                    console.log("Video loaded successfully");
                    setVideoError(null);
                  }}
                />


                {selectedOverlay && isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg pointer-events-none">
                    <Move className="w-8 h-8 text-white animate-bounce" />
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2C4E86]"
                  />

                  {textOverlays.map(overlay => (
                    <div
                      key={overlay.id}
                      className="absolute top-0 h-2 bg-green-500 opacity-50"
                      style={{
                        left: `${(overlay.startTime / duration) * 100}%`,
                        width: `${((overlay.endTime - overlay.startTime) / duration) * 100}%`
                      }}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                  <span className="text-sm text-gray-600 w-full sm:w-auto text-center sm:text-left">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                          setCurrentTime(0);
                        }
                      }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="px-3 sm:px-4 py-2 bg-[#2C4E86] hover:bg-blue-900 text-white rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setShowTextPanel(true)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden xs:inline">Add Text</span>
                    </button>

                    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                      {/* ... other buttons ... */}

                      <ExportButton
                        isExporting={isExporting}
                         onClick={exportVideo}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <h3 className="text-lg font-semibold mb-3">Text Overlays</h3>
              {textOverlays.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No text overlays added yet</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {textOverlays.map(overlay => (
                    <div
                      key={overlay.id}
                      className={`p-3 border-2 rounded-lg transition-all flex items-center justify-between ${selectedOverlay === overlay.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => {
                        setSelectedOverlay(overlay.id);
                        setPanelCollapsed(false);
                      }}>
                        <p className="font-medium text-gray-800">{overlay.text}</p>
                        <p className="text-sm text-gray-500">
                          {formatTime(overlay.startTime)} → {formatTime(overlay.endTime)}
                          {overlay.animation !== 'none' && (
                            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                              {overlay.animation}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOverlay(overlay.id);
                            setPanelCollapsed(false);
                          }}
                          className="p-2 text-[#2C4E86] hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeOverlay(overlay.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Properties Panel - Only shows when overlay selected */}
          <AnimatePresence>
            {!panelCollapsed && selectedOverlay && (
              <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="
                    lg:col-span-1 
                    fixed lg:relative 
                    right-0 top-0 lg:top-auto 
                    bottom-0 lg:bottom-auto 
                    bg-white rounded-l-xl shadow-lg 
                    w-80 lg:w-auto lg:rounded-xl 
                    z-50 flex flex-col
                    max-h-[45vh] sm:max-h-[50vh] md:max-h-[60vh] lg:max-h-[76vh]
                  ">



                <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Text Properties
                  </h3>
                  <button
                    onClick={() => setPanelCollapsed(true)}
                    className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 🔹 Scrollable content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {(() => {
                    const overlay = textOverlays.find(o => o.id === selectedOverlay);
                    if (!overlay) return null;

                    return (
                      <div className="space-y-4">
                        {/* Text Content */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                          <textarea
                            value={overlay.text}
                            onChange={(e) => updateOverlay(overlay.id, { text: e.target.value })}
                            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#2C4E86]"
                          />
                        </div>

                        {/* Time Controls */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Start (s)</label>
                          <input
                              type="number"
                              min="0"
                              max={duration || 0}
                              step="0.1"
                              value={Number.isFinite(overlay.startTime) ? overlay.startTime : 0}
                              onChange={(e) => updateOverlay(overlay.id, { startTime: parseFloat(e.target.value) || 0 })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">End (s)</label>
                           <input
                              type="number"
                              min="0"
                              max={duration || 1}
                              step="0.1"
                              value={Number.isFinite(overlay.endTime) ? overlay.endTime : 0}
                              onChange={(e) => updateOverlay(overlay.id, { endTime: parseFloat(e.target.value) || 0 })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>

                        {/* Position Presets */}
                        <div className="border-t pt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3">Position Presets</label>
                          <div className="grid grid-cols-3 gap-2">
                            {positionPresets.map(preset => (
                              <button
                                key={preset.name}
                                onClick={() => updateOverlay(overlay.id, { position: { x: preset.x, y: preset.y } })}
                                className={`text-xs py-2 px-1 rounded border-2 transition-all ${Math.abs(overlay.position.x - preset.x) < 1 && Math.abs(overlay.position.y - preset.y) < 1
                                  ? 'border-[#2C4E86] bg-blue-50 font-semibold'
                                  : 'border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 italic">💡 Drag text on video to reposition</p>
                        </div>

                        {/* Manual Position */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">X (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={Math.round(overlay.position.x) || 0}
                              onChange={(e) => updateOverlay(overlay.id, { position: { ...overlay.position, x: parseFloat(e.target.value) || 0 } })}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Y (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={Math.round(overlay.position.y) || 0}
                                onChange={(e) => updateOverlay(overlay.id, { position: { ...overlay.position, y: parseFloat(e.target.value) || 0 } })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />

                          </div>
                        </div>

                        {/* Font Size */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Size: {overlay.fontSize}px
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="72"
                            value={overlay.fontSize}
                            onChange={(e) => updateOverlay(overlay.id, { fontSize: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>

                        {/* Font Family */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                          <select
                            value={overlay.fontFamily}
                            onChange={(e) => updateOverlay(overlay.id, { fontFamily: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            {fontFamilies.map(font => (
                              <option key={font} value={font}>{font}</option>
                            ))}
                          </select>
                        </div>

                        {/* Font Style */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateOverlay(overlay.id, { fontWeight: overlay.fontWeight === 'bold' ? 'normal' : 'bold' })}
                              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${overlay.fontWeight === 'bold'
                                ? 'bg-[#2C4E86] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                              <Bold className="w-4 h-4 mx-auto" />
                            </button>
                            <button
                              onClick={() => updateOverlay(overlay.id, { fontStyle: overlay.fontStyle === 'italic' ? 'normal' : 'italic' })}
                              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${overlay.fontStyle === 'italic'
                                ? 'bg-[#2C4E86] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                              <Italic className="w-4 h-4 mx-auto" />
                            </button>
                            <button
                              onClick={() => updateOverlay(overlay.id, { underline: !overlay.underline })}
                              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${overlay.underline
                                ? 'bg-[#2C4E86] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                              <Underline className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>

                        {/* Colors */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Colors</label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <label className="text-xs text-gray-600 w-20">Text Color</label>
                              <div className="flex gap-2 flex-1">
                                <div className="relative w-12 h-10 rounded border overflow-hidden">
                                  <input
                                    type="color"
                                    value={overlay.color}
                                    onClick={(e) => e.stopPropagation()} // 🧠 fix
                                    onChange={(e) => updateOverlay(overlay.id, { color: e.target.value })}
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={overlay.color}
                                  onClick={(e) => e.stopPropagation()} // 🧠 fix
                                  onChange={(e) => updateOverlay(overlay.id, { color: e.target.value })}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                                />
                              </div>
                            </div>


                            <div className="flex items-center gap-3">
                              <label className="text-xs text-gray-600 w-20">BG Color</label>
                              <div className="flex gap-2 flex-1">
                                <div className="relative w-12 h-10 rounded border overflow-hidden">
                                  <input
                                    type="color"
                                    value={overlay.backgroundColor === 'transparent' ? '#ffffff' : overlay.backgroundColor}
                                    onChange={(e) => updateOverlay(overlay.id, { backgroundColor: e.target.value })}
                                    className="absolute inset-0 w-full h-full cursor-pointer"
                                    disabled={overlay.backgroundColor === 'transparent'}
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={overlay.backgroundColor}
                                  onChange={(e) => updateOverlay(overlay.id, { backgroundColor: e.target.value })}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => updateOverlay(overlay.id, { backgroundColor: overlay.backgroundColor === 'transparent' ? 'rgba(0, 0, 0, 0.5)' : 'transparent' })}
                              className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${overlay.backgroundColor === 'transparent'
                                ? 'bg-[#2C4E86] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                              {overlay.backgroundColor === 'transparent' ? '✓ Transparent BG' : 'Make BG Transparent'}
                            </button>

                            <div className="flex flex-wrap gap-2 pt-2 border-t">
                              {presetColors.map((color) => (
                                <button
                                  key={color}
                                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-[#2C4E86]"
                                  style={{ backgroundColor: color }}
                                  onClick={(e) => {
                                    e.stopPropagation(); // ✅ prevent overlay deselection
                                    updateOverlay(overlay.id, { color });
                                  }}
                                  title="Text color"
                                />
                              ))}
                            </div>

                          </div>
                        </div>

                        {/* Letter Spacing */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Letter Spacing: {overlay.letterSpacing}px
                          </label>
                          <input
                            type="range"
                            min="-5"
                            max="20"
                            value={overlay.letterSpacing}
                            onChange={(e) => updateOverlay(overlay.id, { letterSpacing: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>

                        {/* Opacity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opacity: {overlay.opacity}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={overlay.opacity}
                            onChange={(e) => updateOverlay(overlay.id, { opacity: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>

                        {/* Animation */}
                        <div className="border-t pt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Animation
                          </label>

                          <select
                            value={overlay.animation}
                            onChange={(e) => updateOverlay(overlay.id, { animation: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="none">None</option>
                            <option value="fade-in">Fade In</option>
                            <option value="fade-out">Fade Out</option>
                            <option value="fade-in-out">Fade In + Out</option>
                            <option value="slide-left">Slide Left</option>
                            <option value="slide-right">Slide Right</option>
                            <option value="zoom-in">Zoom In</option>
                            <option value="floating">Floating Text</option>
                            <option value="ticker">Ticker (News Style)</option>

                          </select>

                          {overlay.animation !== 'none' && overlay.animation !== 'floating' && (
                            <div className="mt-3">
                              <label className="block text-sm text-gray-700 mb-1">
                                Duration (s)
                              </label>
                              <input
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  max="5"
                                  value={Number.isFinite(overlay.animationDuration) ? overlay.animationDuration : 0.5}
                                  onChange={(e) =>
                                    updateOverlay(overlay.id, { animationDuration: parseFloat(e.target.value) || 0.5 })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Text Modal */}
      {showTextPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="
              bg-white rounded-xl 
              w-full max-w-sm sm:max-w-md 
              shadow-lg overflow-hidden
              flex flex-col
            "
          >
            {/* Header (Fixed) */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg sm:text-xl font-bold">Add Text Overlay</h3>
              <button
                onClick={() => setShowTextPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="p-4 space-y-4 overflow-y-auto ">
              {/* Text input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text
                </label>
                <textarea
                  value={newText.text}
                  onChange={(e) => setNewText({ ...newText, text: e.target.value })}
                  className="w-full h-24 sm:h-20 px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm"
                  placeholder="Enter your text here..."
                />
              </div>

              {/* Font size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={newText.fontSize}
                  onChange={(e) =>
                    setNewText({
                      ...newText,
                      fontSize: parseInt(e.target.value) || 16,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* Font family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={newText.fontFamily}
                  onChange={(e) =>
                    setNewText({ ...newText, fontFamily: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Info */}
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Text will appear from {formatTime(currentTime)} to{" "}
                {formatTime(Math.min(currentTime + 3, duration))}
              </p>
            </div>

            {/* Footer (Fixed) */}
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={addTextOverlay}
                className="w-full py-3 bg-[#2C4E86] hover:bg-blue-900 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Add Text to Timeline
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>

  );
};

export default VideoEditor;