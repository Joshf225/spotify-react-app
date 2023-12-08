import React, { useEffect, useState } from "react";
import FilteredTracks from "./FilteredTracks";

function DisplayTracks({
  displayList,
  filteredTracks,
  setFilteredTracks,
  setNewPlaylist,
  setDisplayList,
  newPlaylist,
}) {
  const [showAddToPlaylistButton, setShowAddToPlaylistButton] = useState(false);

  useEffect(() => {
    if (displayList) {
      setShowAddToPlaylistButton(!showAddToPlaylistButton);
    }
  }, [displayList]);

  const handleClearScreen = () => {
    setDisplayList([]);
  };

  return (
    <>
      <button onClick={handleClearScreen}>CLEAR SCREEN</button>
      {showAddToPlaylistButton && (
        <button
          onClick={() => {
            if (Array.isArray(newPlaylist) && Array.isArray(displayList)) {
              setNewPlaylist([...newPlaylist, ...displayList]);
              setDisplayList([]);
            } else {
              console.error("newPlaylist or displayList is not an array");
            }
          }}
        >
          ADD TO PLAYLIST
        </button>
      )}
      <div
        className="tracks"
        style={{
          display: "flex",
          justifyContent: "space-around",
          overflow: "hidden",
          flexWrap: "wrap",
        }}
      >
        <FilteredTracks
          setFilteredTracks={setFilteredTracks}
          displayList={displayList}
          filteredTracks={filteredTracks}
          setNewPlaylist={setNewPlaylist}
          setDisplayList={setDisplayList}
          newPlaylist={newPlaylist}
        />
      </div>
    </>
  );
}

export default DisplayTracks;
