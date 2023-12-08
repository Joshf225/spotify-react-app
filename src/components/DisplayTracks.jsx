import React, { useEffect, useState } from "react";
import FilteredTracks from "./FilteredTracks";

function DisplayTracks({
  displayList,
  filteredTracks,
  setFilteredTracks,
  setNewPlaylist,
  setDisplayList,
  newPlaylist,
  setSearch,
}) {
  const [showAddToPlaylistButton, setShowAddToPlaylistButton] = useState(false);

  useEffect(() => {
    if (displayList.length > 0) {
      setShowAddToPlaylistButton(!showAddToPlaylistButton);
    }
  }, [displayList]);

  // Function to check for duplicate track
  function checkDuplicateTrack(newTrack, playlist) {
    const isDuplicate = playlist.some(
      ({ track }) => track.id === newTrack.track.id
    );
    return isDuplicate;
  }

  const handleAddToPlaylist = () => {
    if (Array.isArray(newPlaylist) && Array.isArray(displayList)) {
      // Loop through each track in the displayList
      displayList.forEach((newTrack) => {
        // Check if the track already exists in the newPlaylist
        if (!checkDuplicateTrack(newTrack, newPlaylist)) {
          // If not a duplicate, add it to the newPlaylist
          setNewPlaylist((prevPlaylist) => [...prevPlaylist, newTrack]);
        }
      });
      setDisplayList([]);
    } else {
      console.error("newPlaylist or displayList is not an array");
    }
  };

  return (
    <>
      {showAddToPlaylistButton && (
        <button onClick={handleAddToPlaylist}>ADD TO PLAYLIST</button>
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
