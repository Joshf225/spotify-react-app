import React from "react";
import TrackPreview from "./TrackPreview";

function FilteredTracks({ displayList, setDisplayList }) {
  const removeTrack = (trackIdToRemove) => {
    // Use filter to create a new array without the removed track
    const updatedTracks = displayList.filter(
      ({ track }) => track.id !== trackIdToRemove
    );

    setDisplayList(updatedTracks);
  };
  return displayList.map(({ track }) => (
    <div
      key={track.id}
      style={{
        margin: "1rem",
        backgroundColor: "#9BBEC8",
        borderRadius: "3rem",
        width: "20%",
        // height: "10%",
      }}
    >
      <div
        className="track-name"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <img
          src={track.album?.images[0].url}
          alt=""
          style={{ width: "80%", borderRadius: "5rem" }}
        />
        <h2 style={{ color: "white", textOverflow: "hidden" }}>{track.name}</h2>
        <button
          onClick={() => removeTrack(track.id)}
          style={{
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          Remove Track
        </button>
        {track?.preview_url && (
          <>
            <TrackPreview previewUrl={track?.preview_url} />
          </>
        )}
      </div>
    </div>
  ));
}

export default FilteredTracks;
