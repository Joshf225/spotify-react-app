import React, { useEffect } from "react";

function FindArtist({
  allTracks,
  handleChange,
  handleSearchArtist,
  clearInputValue,
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
        <h4 className="text-primary">
          You have {allTracks.length} tracks in your liked songs
        </h4>
        <section>
          <label className="text-primary">
            What artist would you like in this playlist?
          </label>
          <input
            onChange={handleChange}
            type="text"
            style={{ margin: "1rem" }}
            value={search}
            placeholder="Enter artist here"
            className="input-style"
          />
          <button onClick={handleSearchArtist} className="btn-a">
            FIND
          </button>
        </section>
      </>
    </>
  );
}

export default FindArtist;
