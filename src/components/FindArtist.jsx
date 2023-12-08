import React, { useEffect, useState } from "react";

function FindArtist({
  allTracks,
  handleChange,
  handleSearchArtist,
  clearInputValue,
  setValue,
  value,
  setSearch,
  search,
}) {
  useEffect(() => {
    if (clearInputValue === true) {
      setSearch("");
    }
  }, []);
  return (
    <>
      <>
        <h4>You have {allTracks.length} tracks in your liked songs</h4>
        <section>
          <label>What artist would you like in this playlist?</label>
          <input
            onChange={handleChange}
            type="text"
            style={{ margin: "1rem" }}
            value={search}
          />
          <button onClick={handleSearchArtist}>CLICK</button>
        </section>
      </>
    </>
  );
}

export default FindArtist;
