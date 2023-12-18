import React, { useState } from "react";

function TrackPreview({ previewUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <button
        onClick={toggleAudio}
        className="preview-btn"
        style={{
          textDecoration: "none",
          backgroundColor: "#427D9D",
          borderColor: "none",
        }}
      >
        {isPlaying ? "Pause Preview" : "Play Preview"}
      </button>

      {isPlaying && (
        <audio controls autoPlay>
          <source src={previewUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default TrackPreview;
