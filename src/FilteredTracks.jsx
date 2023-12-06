import React from "react";

function FilteredTracks({
  displayList,
  filteredTracks,
  setFilteredTracks,
  setNewPlaylist,
  setDisplayList,
}) {
  const removeTrack = (trackIdToRemove) => {
    // Use filter to create a new array without the removed track
    const updatedTracks = displayList.filter(
      ({ track }) => track.id !== trackIdToRemove
    );

    // Set the new array of tracks (assuming 'filteredTracks' is a state variable)
    // setFilteredTracks(updatedTracks); // You may need to use state management here
    // setNewPlaylist(updatedTracks);
    setDisplayList(updatedTracks);
  };
  return displayList.map(({ track }) => (
    <div
      key={track.id}
      style={{
        margin: "1rem",
        backgroundColor: "#9BBEC8",
        borderRadius: "3rem",
        width: "30%",
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
            <a
              className="preview-btn"
              target="_blank"
              href={track?.preview_url}
              style={{
                textDecoration: "none",
                backgroundColor: "#427D9D",
              }}
            >
              <span className="preview-btn__icon-wrapper">
                <svg
                  width="10"
                  className="preview-btn__icon-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 15"
                >
                  <path
                    fill="currentColor"
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                  ></path>
                </svg>

                <svg
                  className="preview-btn__icon-svg  preview-btn__icon-svg--copy"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  fill="none"
                  viewBox="0 0 14 15"
                >
                  <path
                    fill="currentColor"
                    d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                  ></path>
                </svg>
              </span>
              Preview Sound
            </a>
          </>
        )}
      </div>
    </div>
  ));
}

export default FilteredTracks;
