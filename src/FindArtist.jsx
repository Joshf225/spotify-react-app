import React from "react";

function FindArtist({ allTracks, handleChange, handleSearchArtist }) {
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
          />
          <button onClick={handleSearchArtist}>CLICK</button>
        </section>
      </>
    </>
  );
}

export default FindArtist;
