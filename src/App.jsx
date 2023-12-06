import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import FilteredTracks from "./FilteredTracks";
import DisplayTracks from "./DisplayTracks";
import Navbar from "./Navbar";

function App() {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [uri, setUri] = useState([]);
  const [playlistId, setPlaylistId] = useState("");
  const [search, setSearch] = useState("");
  const [allTracks, setAllTracks] = useState([]); // State to store all tracks
  const [createdPlaylist, setCreatedPlaylist] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [gettingTracks, setGettingTracks] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [display, setDisplay] = useState("");
  const [displayCreatePlaylist, setDisplayCreatePlaylist] = useState("");
  const [newPlaylist, setNewPlaylist] = useState([]);
  const [displayList, setDisplayList] = useState([]);

  const CLIENT_ID = "a66eaeb1ac224527aaa1970a0e99ce02";
  // const SECRET_KEY = "18b01338b97d40dc81868b503a187975";
  const REDIRECT_URI = "http://localhost:3000/callback";
  // const TOKEN_URL = "https://accounts.spotify.com/api/token";
  // const BASE_URL = "https://api.spotify.com/v1/";
  const AUTH_URL = "https://accounts.spotify.com/authorize";
  // const RESPONSE_TYPE = "token";
  const SCOPE = [
    "playlist-modify-private",
    "playlist-modify-public",
    "user-library-read",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
  ];
  const [artists, setArtists] = useState([]);

  const handleLogin = () => {
    const url = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE.join(
      "%20"
    )}&response_type=token&show_dialog=true`;

    window.location.href = url; // Redirect the user to the Spotify authorization URL
  };

  const handleLogout = () => {
    setToken("");
    setArtists([]);
    setExpiresIn(0);
    window.localStorage.removeItem("expires_in");
    window.localStorage.removeItem("access_token");
  };

  useEffect(() => {
    if (!token) {
      handleValidToken();
    }
    if (Date.now() / 1000 > window.localStorage.getItem("expires_in")) {
      return getRefreshToken();
    }
    // if (playlistId) {
    //   console.log("id:  ", playlistId);
    // }
  }, []);

  useEffect(() => {
    if (displayList.length > 0) {
      console.log("DISPLAY LIST: ", displayList);
      console.log("NEWPLAYLIST LIST: ", newPlaylist);
    }
  }, [displayList]);

  useEffect(() => {
    if (allTracks.length > 1) {
      console.log("All Tracks: ", allTracks);
    }
    // Filter tracks based on the search criteria
    if (search && allTracks.length > 0) {
      const filtered = filterTracksByArtist(allTracks, search);
      setFilteredTracks(filtered);
      setSearch("");
      // console.log(filteredTracks);
    }
  }, [allTracks]);

  // useEffect(() => {
  //   if (filteredTracks.length !== 0) {
  //     if (filteredTracks) {
  //       console.log("Filtered tracks: ", filteredTracks);
  //       let uri = displayList.map((track) => {
  //         return track.track.uri;
  //       });
  //       console.log("filtered uri: ", uri);
  //       setUri(uri);
  //     }
  //   }
  // }, [filteredTracks]);

  const handleValidToken = () => {
    let token = window.localStorage.getItem("access_token");
    let expires_in = window.localStorage.getItem("expires_in");
    if (!token) {
      const hash = window.location.hash;
      if (hash) {
        token = hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("access_token"))
          .split("=")[1];
      }
      window.localStorage.setItem("access_token", token);
    }
    if (!expires_in) {
      if (window.location.hash) {
        const hash = window.location.hash;
        expires_in = hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("expires_in"))
          .split("=")[1];
      }
      window.localStorage.setItem("expires_in", expires_in * 1000 + Date.now());
    }
    setToken(window.localStorage.getItem("access_token"));
    setExpiresIn(window.localStorage.getItem("expires_in"));
  };

  const getRefreshToken = async () => {
    // refresh token that has been previously stored
    const refreshToken = localStorage.getItem("access_token");
    const url = "https://accounts.spotify.com/api/token/";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
      }),
    };
    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem("access_token", response.accessToken);
    setToken(response.accessToken);
    localStorage.setItem("refresh_token", response.refreshToken);
    setRefreshToken(response.refreshToken);
  };

  const getAllSavedTracks = async () => {
    let url = "https://api.spotify.com/v1/me/tracks?offset=0&limit=50";
    let tracks = [];
    setGettingTracks(true);

    try {
      while (url) {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        tracks = [...tracks, ...response.data.items]; // Concatenate new tracks with existing ones

        url = response.data.next; // Update URL for the next page
      }
      setGettingTracks(false);
      setAllTracks(tracks); // Set all tracks in state
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const filterTracksByArtist = (trackList, name) => {
    const filtered = trackList.filter((track) => {
      const artists = track.track.artists;
      return artists.some(
        (artist) => artist.name.toLowerCase() === name.toLowerCase()
      );
    });

    return filtered;
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    // Trigger getting all tracks only if it hasn't been fetched yet
    getAllSavedTracks();
  };

  const handleSearchArtist = () => {
    let newFilteredList;
    if (search.length > 1 && allTracks.length > 0) {
      newFilteredList = filterTracksByArtist(allTracks, search);
      setSearch("");
      setDisplayList(newFilteredList);
      // setFilteredTracks(...filteredTracks, newFilteredList);
      // setNewPlaylist(...newPlaylist, newFilteredList);
    }
    console.log("FILTER LIST: ", newFilteredList);
  };

  return (
    <div className="App" style={{ backgroundColor: "#DDF2FD" }}>
      <Navbar
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        token={token}
      />
      <section
        style={{
          // backgroundColor: "#9F9FAD",
          minHeight: "91.1vh",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          alignItems: "center",
        }}
      >
        {token && (
          <>
            {/* ==================================================== */}
            <>
              <section>
                <div>Playlist so far...</div>
                {newPlaylist?.length === 0 ? (
                  <>You have nothing in your playlist yet</>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {newPlaylist?.map((tracks, length) => {
                        return (
                          <>
                            <p key={tracks.track.id}>
                              {length + 1 + ". "}
                              {tracks.track.name}
                            </p>
                          </>
                        );
                      })}
                    </div>
                  </>
                )}
              </section>
            </>
            {allTracks.length === 0 ? (
              <>
                <label>CLICK ME TO GET YOUR LIKED SONGS!</label>
                <button onClick={handleSearch}>ME</button>
              </>
            ) : (
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
            )}
            {/* ==================================================== */}

            {filterTracksByArtist && (
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
        )}
      </section>
    </div>
  );
}

export default App;
