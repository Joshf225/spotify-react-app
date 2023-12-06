import React, { useEffect } from "react";
import FilteredTracks from "./FilteredTracks";

function DisplayTracks({
  displayList,
  filteredTracks,
  setFilteredTracks,
  setNewPlaylist,
  setDisplayList,
  newPlaylist,
}) {
  useEffect(() => {
    if (newPlaylist.length > 0) {
      console.log("NEW PLAYLIST: ", newPlaylist);
    }
  }, [newPlaylist]);
  return (
    <>
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
        />
      </div>
      <button
        onClick={() => {
          if (Array.isArray(newPlaylist) && Array.isArray(displayList)) {
            setNewPlaylist([...newPlaylist, ...displayList]);
          } else {
            console.error("newPlaylist or displayList is not an array");
          }
        }}
      >
        ADD TO PLAYLIST
      </button>
    </>
  );
}

export default DisplayTracks;
