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
  token,
  filterTracksByArtist,
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
          />
        </div>

        {allTracks.length === 0 ? (
          <>
            <button onClick={handleSearch}>CLICK ME TO GET YOUR TRACKS!</button>
            {gettingTracks && errorMessage?.length > 0 && (
              <>
                <h2>{errorMessage}, try logging in again</h2>
              </>
            )}
            {gettingTracks && <Loader />}
          </>
        ) : (
          <FindArtist
            allTracks={allTracks}
            handleChange={handleChange}
            handleSearchArtist={handleSearchArtist}
          />
        )}
        {/* {allTracks.length === 0 && (
          
        )} */}
        {displayList.length > 0 && (
          <DisplayTracks
            setFilteredTracks={setFilteredTracks}
            displayList={displayList}
            filteredTracks={filteredTracks}
            setNewPlaylist={setNewPlaylist}
            setDisplayList={setDisplayList}
            newPlaylist={newPlaylist}
          />
        )}
      </>
    </section>
  );
}

export default Home;
