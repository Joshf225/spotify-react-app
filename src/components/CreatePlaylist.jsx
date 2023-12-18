import React, { useState } from "react";

export default function CreatePlaylist({
  handleCreatePlaylist,
  setPlaylistName,
  setValue,
  value,
}) {
  const handlePlaylistNameChange = (e) => {
    setValue(e.target.value);
    setPlaylistName(e.target.value);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label className="text-primary" style={{ margin: "1rem" }}>
          What would you like to call your playlist?
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "15rem",
          }}
        >
          <input
            className="input-style"
            type="text"
            name="playlist-name"
            onChange={handlePlaylistNameChange}
            value={value}
            style={{ width: "100%", margin: "1rem" }}
          />
          <button className="btn-a" onClick={handleCreatePlaylist}>
            CREATE PLAYLIST
          </button>
        </div>
      </div>
    </>
  );
}
