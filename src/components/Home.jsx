import React from "react";
import NewPlaylist from "./NewPlaylist";
import Loader from "./Loader";
import FindArtist from "./FindArtist";
import DisplayTracks from "./DisplayTracks";

function Home({
  newPlaylist,
  setNewPlaylist,
  allTracks,
  gettingTracks,
  handleSearch,
  handleSearchArtist,
  setFilteredTracks,
  displayList,
  filteredTracks,
  setDisplayList,
  handleChange,
  errorMessage,
  clearInputValue,
  setSearch,
  search,
  showCreatePlaylist,
  setShowCreatePlaylist,
  handleCreatePlaylist,
  playlistName,
  setPlaylistName,
  setUri,
  uri,
}) {
  return (
    <section className="home-page">
      <>
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            transition: "ease",
          }}
        >
          <NewPlaylist
            newPlaylist={newPlaylist}
            setNewPlaylist={setNewPlaylist}
            setDisplayList={setDisplayList}
            setUri={setUri}
            uri={uri}
          />
        </div>

        {allTracks.length === 0 ? (
          <>
            <button className="tracks-btn" onClick={handleSearch}>
              GET TRACKS
            </button>
            {gettingTracks && errorMessage?.length > 0 && (
              <>
                <h2>{errorMessage}, try logging in again</h2>
              </>
            )}
            {gettingTracks && <Loader />}
          </>
        ) : (
          <>
            <FindArtist
              allTracks={allTracks}
              handleChange={handleChange}
              handleSearchArtist={handleSearchArtist}
              clearInputValue={clearInputValue}
              setSearch={setSearch}
              search={search}
            />
            <DisplayTracks
              setFilteredTracks={setFilteredTracks}
              displayList={displayList}
              filteredTracks={filteredTracks}
              setNewPlaylist={setNewPlaylist}
              setDisplayList={setDisplayList}
              newPlaylist={newPlaylist}
              setSearch={setSearch}
              showCreatePlaylist={showCreatePlaylist}
              setShowCreatePlaylist={setShowCreatePlaylist}
              handleCreatePlaylist={handleCreatePlaylist}
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              uri={uri}
            />
          </>
        )}
      </>
    </section>
  );
}

export default Home;
