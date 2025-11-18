import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoEditor from '@/components/VideoEditor';

interface LocationState {
  videoUrl: string;
  videoTitle: string;
}

const VideoEditorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Optional: Pre-check before rendering (but VideoEditor already handles this)
  // You can remove this if you want VideoEditor to handle everything
  if (!state?.videoUrl && !sessionStorage.getItem('currentVideoUrl')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No video selected</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ✅ Just render VideoEditor - it handles everything internally
  return <VideoEditor />;
};

export default VideoEditorPage;