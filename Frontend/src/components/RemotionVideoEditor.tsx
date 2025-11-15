import React, { useState, useEffect, useRef } from 'react';
import { Player } from '@remotion/player';
import { AbsoluteFill, Sequence, Video, useCurrentFrame, useVideoConfig } from 'remotion';
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
  ArrowRight,
  Loader
} from 'lucide-react';

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
  animation:
    | "none"
    | "fade-in"
    | "fade-out"
    | "fade-in-out"
    | "slide-left"
    | "slide-right"
    | "zoom-in"
    | "floating"
    | "ticker";
  animationDuration: number;
}

const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Courier New",
  "Tahoma",
  "Impact",
  "Comic Sans MS",
];

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

// Animated Text Component for Remotion
const AnimatedText = ({ overlay, startFrame, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const localFrame = frame - startFrame;
  
  if (localFrame < 0 || localFrame >= durationInFrames) return null;

  const progress = localFrame / durationInFrames;
  const animDurationFrames = Math.min(durationInFrames, overlay.animationDuration * fps);
  
  let opacity = overlay.opacity / 100;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  switch (overlay.animation) {
    case "fade-in":
      opacity *= Math.min(1, localFrame / animDurationFrames);
      break;
    case "fade-out":
      opacity *= Math.min(1, (durationInFrames - localFrame) / animDurationFrames);
      break;
    case "fade-in-out":
      if (progress < 0.5) {
        opacity *= Math.min(1, (localFrame * 2) / animDurationFrames);
      } else {
        opacity *= Math.min(1, ((durationInFrames - localFrame) * 2) / animDurationFrames);
      }
      break;
    case "slide-left":
      translateX = (1 - progress) * (width * 0.25);
      break;
    case "slide-right":
      translateX = -(1 - progress) * (width * 0.25);
      break;
    case "zoom-in":
      scale = 0.8 + 0.2 * Math.min(1, localFrame / animDurationFrames);
      break;
    case "floating":
      translateY = Math.sin((frame / fps) * 2 * Math.PI) * 10;
      break;
  }

  const x = (overlay.position.x / 100) * width;
  const y = (overlay.position.y / 100) * height;

  const lines = overlay.text.split("\n");
  const lineHeight = overlay.lineHeight || overlay.fontSize * 1.2;
  const letterSpacing = overlay.letterSpacing || 0;

  if (overlay.animation === "ticker") {
    const speed = 100;
    const timeOffset = ((frame / fps) * speed) % (width * 2);
    
    return (
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: width - timeOffset,
            top: height * 0.9,
            fontSize: overlay.fontSize,
            fontFamily: overlay.fontFamily,
            fontWeight: overlay.fontWeight,
            fontStyle: overlay.fontStyle,
            color: overlay.color,
            opacity: opacity,
            whiteSpace: 'nowrap',
            letterSpacing: `${letterSpacing}px`,
          }}
        >
          {overlay.text}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x + translateX,
          top: y + translateY,
          transform: `translate(-50%, -50%) scale(${scale})`,
          fontSize: overlay.fontSize,
          fontFamily: overlay.fontFamily,
          fontWeight: overlay.fontWeight,
          fontStyle: overlay.fontStyle,
          color: overlay.color,
          opacity: opacity,
          textAlign: 'center',
          letterSpacing: `${letterSpacing}px`,
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              backgroundColor: overlay.backgroundColor !== 'transparent' ? overlay.backgroundColor : undefined,
              padding: overlay.backgroundColor !== 'transparent' ? '8px' : 0,
              marginBottom: i < lines.length - 1 ? `${lineHeight - overlay.fontSize}px` : 0,
              textDecoration: overlay.underline ? 'underline' : 'none',
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Main Remotion Composition - Must be a proper React component
const VideoComposition = (props) => {
  const { videoUrl, textOverlays, durationInFrames } = props;
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Video src={videoUrl} />
      
      {textOverlays.map((overlay) => {
        const startFrame = Math.round(overlay.startTime * fps);
        const endFrame = Math.round(overlay.endTime * fps);
        const duration = endFrame - startFrame;
        
        return (
          <Sequence
            key={overlay.id}
            from={startFrame}
            durationInFrames={duration}
          >
            <AnimatedText
              overlay={overlay}
              startFrame={startFrame}
              durationInFrames={duration}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Set display name for debugging
VideoComposition.displayName = 'VideoComposition';

// Main Editor Component
const RemotionVideoEditor = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('Sample Video');
  const [videoDuration, setVideoDuration] = useState(10);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textOverlays, setTextOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [showTextPanel, setShowTextPanel] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const playerRef = useRef(null);
  const fps = 30;

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
    animation: 'none',
    animationDuration: 0.5
  });

  useEffect(() => {
    if (!playerRef.current) return;

    const handleFrameUpdate = ({ detail }) => {
      setCurrentFrame(detail.frame);
    };

    const player = playerRef.current;
    player.addEventListener("frameupdate", handleFrameUpdate);

    return () => {
      player.removeEventListener("frameupdate", handleFrameUpdate);
    };
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideoTitle(file.name);
      
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
      };
    }
  };

  const currentTime = currentFrame / fps;
  const durationInFrames = Math.round(videoDuration * fps);

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    const newFrame = Math.round(newTime * fps);
    setCurrentFrame(newFrame);
    if (playerRef.current) {
      playerRef.current.seekTo(newFrame);
    }
  };

  const addTextOverlay = () => {
    const overlay = {
      id: Date.now().toString(),
      text: newText.text,
      startTime: currentTime,
      endTime: Math.min(currentTime + 3, videoDuration),
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

  const removeOverlay = (id) => {
    setTextOverlays(textOverlays.filter(o => o.id !== id));
    if (selectedOverlay === id) {
      setSelectedOverlay(null);
      setPanelCollapsed(true);
    }
  };

  const updateOverlay = (id, updates) => {
    setTextOverlays(textOverlays.map(o =>
      o.id === id ? { ...o, ...updates } : o
    ));
  };

  // FULLY WORKING EXPORT FUNCTION
  const exportVideo = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      // Load video element
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.crossOrigin = 'anonymous';
      videoElement.muted = true;
      
      await new Promise((resolve, reject) => {
        videoElement.onloadeddata = resolve;
        videoElement.onerror = reject;
      });

      // Setup MediaRecorder
      const stream = canvas.captureStream(fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${videoTitle.replace(/\.[^/.]+$/, '')}-edited.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(100);
          alert('✅ Video exported successfully!\n\nThe video is in WebM format. To convert to MP4, you can use:\n• Online: CloudConvert.com or FreeConvert.com\n• Locally: ffmpeg -i video.webm video.mp4');
        }, 500);
      };

      mediaRecorder.start();

      // Render frames
      let frameCount = 0;
      const totalFrames = durationInFrames;
      const frameInterval = 1000 / fps;
      
      const renderFrame = async () => {
        if (frameCount >= totalFrames) {
          mediaRecorder.stop();
          return;
        }

        const currentTime = frameCount / fps;
        videoElement.currentTime = currentTime;

        await new Promise(resolve => {
          videoElement.onseeked = resolve;
        });

        // Clear and draw video frame
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Draw text overlays
        textOverlays.forEach(overlay => {
          if (currentTime >= overlay.startTime && currentTime <= overlay.endTime) {
            const localTime = currentTime - overlay.startTime;
            const duration = overlay.endTime - overlay.startTime;
            const progress = localTime / duration;
            const animDuration = Math.min(duration, overlay.animationDuration);
            
            let opacity = overlay.opacity / 100;
            let translateX = 0;
            let translateY = 0;
            let scale = 1;

            // Apply animations
            switch (overlay.animation) {
              case "fade-in":
                opacity *= Math.min(1, localTime / animDuration);
                break;
              case "fade-out":
                opacity *= Math.min(1, (duration - localTime) / animDuration);
                break;
              case "fade-in-out":
                if (progress < 0.5) {
                  opacity *= Math.min(1, (localTime * 2) / animDuration);
                } else {
                  opacity *= Math.min(1, ((duration - localTime) * 2) / animDuration);
                }
                break;
              case "slide-left":
                translateX = (1 - progress) * (canvas.width * 0.25);
                break;
              case "slide-right":
                translateX = -(1 - progress) * (canvas.width * 0.25);
                break;
              case "zoom-in":
                scale = 0.8 + 0.2 * Math.min(1, localTime / animDuration);
                break;
              case "floating":
                translateY = Math.sin(currentTime * 2 * Math.PI) * 10;
                break;
            }

            ctx.save();
            ctx.globalAlpha = opacity;

            const x = (overlay.position.x / 100) * canvas.width;
            const y = (overlay.position.y / 100) * canvas.height;

            // Handle ticker animation
            if (overlay.animation === "ticker") {
              const speed = 100;
              const timeOffset = (currentTime * speed) % (canvas.width * 2);
              
              ctx.font = `${overlay.fontStyle} ${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
              ctx.fillStyle = overlay.color;
              ctx.textAlign = 'left';
              ctx.fillText(overlay.text, canvas.width - timeOffset, canvas.height * 0.9);
            } else {
              // Regular text rendering
              ctx.translate(x + translateX, y + translateY);
              ctx.scale(scale, scale);
              
              ctx.font = `${overlay.fontStyle} ${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
              ctx.fillStyle = overlay.color;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              const lines = overlay.text.split('\n');
              const lineHeight = overlay.lineHeight || overlay.fontSize * 1.2;

              lines.forEach((line, i) => {
                const yOffset = (i - (lines.length - 1) / 2) * lineHeight;
                
                // Background
                if (overlay.backgroundColor !== 'transparent') {
                  ctx.fillStyle = overlay.backgroundColor;
                  const metrics = ctx.measureText(line);
                  ctx.fillRect(
                    -metrics.width / 2 - 8,
                    yOffset - overlay.fontSize / 2 - 8,
                    metrics.width + 16,
                    overlay.fontSize + 16
                  );
                }

                // Text
                ctx.fillStyle = overlay.color;
                
                // Underline
                if (overlay.underline) {
                  const metrics = ctx.measureText(line);
                  ctx.beginPath();
                  ctx.moveTo(-metrics.width / 2, yOffset + overlay.fontSize / 2 + 2);
                  ctx.lineTo(metrics.width / 2, yOffset + overlay.fontSize / 2 + 2);
                  ctx.strokeStyle = overlay.color;
                  ctx.lineWidth = 2;
                  ctx.stroke();
                }
                
                ctx.fillText(line, 0, yOffset);
              });
            }

            ctx.restore();
          }
        });

        // Update progress
        const progress = Math.round((frameCount / totalFrames) * 100);
        setExportProgress(progress);

        frameCount++;
        setTimeout(renderFrame, frameInterval);
      };

      // Start rendering
      videoElement.currentTime = 0;
      await new Promise(resolve => {
        videoElement.onseeked = resolve;
      });

      renderFrame();

    } catch (err) {
      console.error("EXPORT FAILED:", err);
      alert(`❌ Export failed: ${err.message}`);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            🎬 Remotion Video Editor
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Upload a video to start editing with text overlays
          </p>
          <label className="block w-full">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="video-upload"
            />
            <div className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-center cursor-pointer">
              Choose Video File
            </div>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            🎬 Editing: {videoTitle}
          </h1>
          <button
            onClick={() => {
              setVideoUrl('');
              setTextOverlays([]);
              setSelectedOverlay(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>New Video</span>
            <ArrowRight />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                 <Player
                  ref={playerRef}
                  component={VideoComposition}
                  inputProps={{
                    videoUrl,
                    textOverlays,
                    durationInFrames
                  }}
                  durationInFrames={durationInFrames}
                  fps={fps}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  style={{ width: '100%', height: '100%' }}
                  controls={false}
                />
              </div>

              <div className="mt-4 space-y-3">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={videoDuration}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  {textOverlays.map(overlay => (
                    <div
                      key={overlay.id}
                      className="absolute top-0 h-2 bg-green-500 opacity-50 pointer-events-none"
                      style={{
                        left: `${(overlay.startTime / videoDuration) * 100}%`,
                        width: `${((overlay.endTime - overlay.startTime) / videoDuration) * 100}%`
                      }}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-gray-600">
                    {formatTime(currentTime)} / {formatTime(videoDuration)}
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentFrame(0);
                        if (playerRef.current) {
                          playerRef.current.seekTo(0);
                        }
                      }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setShowTextPanel(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Text</span>
                    </button>

                    <button
                      onClick={exportVideo}
                      disabled={isExporting}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50"
                    >
                      {isExporting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>{exportProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Export WebM</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlays List */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Text Overlays</h3>
              {textOverlays.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No text overlays added yet</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {textOverlays.map(overlay => (
                    <div
                      key={overlay.id}
                      className={`p-3 border-2 rounded-lg transition-all flex items-center justify-between ${
                        selectedOverlay === overlay.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setSelectedOverlay(overlay.id);
                          setPanelCollapsed(false);
                        }}
                      >
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
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeOverlay(overlay.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Properties Panel */}
          {!panelCollapsed && selectedOverlay && (() => {
            const overlay = textOverlays.find(o => o.id === selectedOverlay);
            if (!overlay) return null;

            return (
              <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Text Properties
                  </h3>
                  <button
                    onClick={() => setPanelCollapsed(true)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Text Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                    <textarea
                      value={overlay.text}
                      onChange={(e) => updateOverlay(overlay.id, { text: e.target.value })}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg resize-none"
                    />
                  </div>

                  {/* Time Controls */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Start (s)</label>
                      <input
                        type="number"
                        min="0"
                        max={videoDuration}
                        step="0.1"
                        value={overlay.startTime}
                        onChange={(e) => updateOverlay(overlay.id, { startTime: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">End (s)</label>
                      <input
                        type="number"
                        min="0"
                        max={videoDuration}
                        step="0.1"
                        value={overlay.endTime}
                        onChange={(e) => updateOverlay(overlay.id, { endTime: parseFloat(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  {/* Position Presets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <div className="grid grid-cols-3 gap-2">
                      {positionPresets.map(preset => (
                        <button
                          key={preset.name}
                          onClick={() => updateOverlay(overlay.id, { position: { x: preset.x, y: preset.y } })}
                          className={`text-xs py-2 px-1 rounded border-2 ${
                            Math.abs(overlay.position.x - preset.x) < 1 && Math.abs(overlay.position.y - preset.y) < 1
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
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
                        className={`flex-1 py-2 px-3 rounded ${
                          overlay.fontWeight === 'bold'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Bold className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => updateOverlay(overlay.id, { fontStyle: overlay.fontStyle === 'italic' ? 'normal' : 'italic' })}
                        className={`flex-1 py-2 px-3 rounded ${
                          overlay.fontStyle === 'italic'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Italic className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => updateOverlay(overlay.id, { underline: !overlay.underline })}
                        className={`flex-1 py-2 px-3 rounded ${
                          overlay.underline
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Underline className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-16">Text</span>
                        <input
                          type="color"
                          value={overlay.color}
                          onChange={(e) => updateOverlay(overlay.id, { color: e.target.value })}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={overlay.color}
                          onChange={(e) => updateOverlay(overlay.id, { color: e.target.value })}
                          className="flex-1 px-2 py-1 border rounded text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-16">Background</span>
                        <input
                          type="color"
                          value={overlay.backgroundColor === 'transparent' ? '#ffffff' : overlay.backgroundColor}
                          onChange={(e) => updateOverlay(overlay.id, { backgroundColor: e.target.value })}
                          className="w-12 h-10 rounded border cursor-pointer"
                          disabled={overlay.backgroundColor === 'transparent'}
                        />
                        <input
                          type="text"
                          value={overlay.backgroundColor}
                          onChange={(e) => updateOverlay(overlay.id, { backgroundColor: e.target.value })}
                          className="flex-1 px-2 py-1 border rounded text-xs"
                        />
                      </div>
                      <button
                        onClick={() => updateOverlay(overlay.id, { 
                          backgroundColor: overlay.backgroundColor === 'transparent' ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
                        })}
                        className={`w-full py-2 px-3 rounded text-sm ${
                          overlay.backgroundColor === 'transparent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {overlay.backgroundColor === 'transparent' ? '✓ Transparent BG' : 'Make BG Transparent'}
                      </button>
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        {presetColors.map((color) => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded border-2 border-gray-300 hover:border-blue-600"
                            style={{ backgroundColor: color }}
                            onClick={() => updateOverlay(overlay.id, { color })}
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

                    {overlay.animation !== 'none' && overlay.animation !== 'floating' && overlay.animation !== 'ticker' && (
                      <div className="mt-3">
                        <label className="block text-sm text-gray-700 mb-1">
                          Duration (s)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="5"
                          value={overlay.animationDuration}
                          onChange={(e) =>
                            updateOverlay(overlay.id, { animationDuration: parseFloat(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Add Text Modal */}
      {showTextPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold">Add Text Overlay</h3>
              <button
                onClick={() => setShowTextPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                <textarea
                  value={newText.text}
                  onChange={(e) => setNewText({ ...newText, text: e.target.value })}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm"
                  placeholder="Enter your text here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={newText.fontSize}
                  onChange={(e) => setNewText({ ...newText, fontSize: parseInt(e.target.value) || 16 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={newText.fontFamily}
                  onChange={(e) => setNewText({ ...newText, fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                <select
                  value={newText.animation}
                  onChange={(e) => setNewText({ ...newText, animation: e.target.value as any })}
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
              </div>

              <p className="text-sm text-gray-600 text-center">
                Text will appear from {formatTime(currentTime)} to {formatTime(Math.min(currentTime + 3, videoDuration))}
              </p>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={addTextOverlay}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Add Text to Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Progress Modal */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-center">Exporting Video</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <p className="text-center text-gray-600">
              {exportProgress < 100 ? `Processing... ${exportProgress}%` : 'Export Complete!'}
            </p>
            {exportProgress === 100 && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Note: For production MP4 export, use @remotion/renderer on a server
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RemotionVideoEditor;