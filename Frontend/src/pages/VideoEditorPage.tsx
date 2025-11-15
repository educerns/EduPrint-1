import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoEditor from '../components/VideoEditor';

interface LocationState {
  videoUrl: string;
  videoTitle: string;
}

const VideoEditorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state?.videoUrl) {
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

  return (
    <VideoEditor
      videoUrl={state.videoUrl}
      videoTitle={state.videoTitle}
      onClose={() => navigate(-1)}
    />
  );
};

export default VideoEditorPage;
