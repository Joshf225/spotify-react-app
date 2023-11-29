import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import SPOTIFY_LOGO from "./assets/spotify_logo.png";

function App() {
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

  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [artists, setArtists] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [userSpotifyId, setUserSpotifyId] = useState("");
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
    if (allTracks.length > 1) {
      console.log("All Tracks: ", allTracks);
    }
    // Filter tracks based on the search criteria
    if (search && allTracks.length > 0) {
      const filtered = filterTracks(allTracks, search);
      setFilteredTracks(filtered);
      // console.log(filtered);
    }
  }, [allTracks]);

  useEffect(() => {
    if (filteredTracks.length !== 0) {
      if (filteredTracks && gettingTracks === false) {
        console.log("Filtered tracks: ", filteredTracks);
        let uri = filteredTracks.map((track) => {
          return track.track.uri;
        });
        console.log("filtered uri: ", uri);
        setUri(uri);
      }
    }
  }, [filteredTracks]);

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

  const renderFilteredTracks = () => {
    const removeTrack = (trackIdToRemove) => {
      // Use filter to create a new array without the removed track
      const updatedTracks = filteredTracks.filter(
        ({ track }) => track.id !== trackIdToRemove
      );

      // Set the new array of tracks (assuming 'filteredTracks' is a state variable)
      setFilteredTracks(updatedTracks); // You may need to use state management here
    };
    return filteredTracks.map(({ track }) => (
      <div
        key={track.id}
        style={{
          margin: "1rem",
          backgroundColor: "#9BBEC8",
          borderRadius: "3rem",
          width: "30%",
        }}
      >
        <div
          className="track-name"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <img
            src={track.album?.images[0].url}
            alt=""
            style={{ width: "80%", borderRadius: "5rem" }}
          />
          <h2 style={{ color: "white", textOverflow: "hidden" }}>
            {track.name}
          </h2>
          <button
            onClick={() => removeTrack(track.id)}
            style={{
              backgroundColor: "#FF0000",
              color: "#FFFFFF",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Remove Track
          </button>
          {track?.preview_url && (
            <>
              <a
                className="preview-btn"
                target="_blank"
                href={track?.preview_url}
                style={{
                  textDecoration: "none",
                  backgroundColor: "#427D9D",
                }}
              >
                <span className="preview-btn__icon-wrapper">
                  <svg
                    width="10"
                    className="preview-btn__icon-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 15"
                  >
                    <path
                      fill="currentColor"
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    ></path>
                  </svg>

                  <svg
                    className="preview-btn__icon-svg  preview-btn__icon-svg--copy"
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    fill="none"
                    viewBox="0 0 14 15"
                  >
                    <path
                      fill="currentColor"
                      d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                    ></path>
                  </svg>
                </span>
                Preview Sound
              </a>
            </>
          )}
        </div>
      </div>
    ));
  };

  const getUserProfile = async () => {
    try {
      const { data } = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.id;
    } catch (error) {
      console.error("Error fetching profile_details:", error);
    }
  };

  const createPlaylist = async () => {
    let Id;
    if (!userSpotifyId) {
      Id = await getUserProfile();
      setUserSpotifyId(Id);
    }
    try {
      const url = `https://api.spotify.com/v1/users/${Id}/playlists`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const body = {
        name: `${playlistName}`,
        description: `${playlistName}`,
        public: true,
      };

      const response = await axios.post(url, body, {
        headers: headers,
      });

      if (response.status === 201) {
        const playlistData = response.data;
        let playlistUrl = playlistData.external_urls.spotify;
        setPlaylistUrl(playlistUrl);
        console.log("Playlist created:", playlistData.id);
        setPlaylistId(playlistData.id);
        return playlistData.id;
      } else {
        throw new Error("Failed to create playlist");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      return null;
    }
  };

  const addSongsToPlaylist = async (id) => {
    try {
      const url = `https://api.spotify.com/v1/playlists/${id}/tracks`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const body = {
        uris: uri,
        position: 0,
      };

      const response = await axios.post(url, body, {
        headers: headers,
      });

      if (response.status === 201) {
        setCreatedPlaylist(true);
        const playlistData = response.data;
        console.log("successfully added songs!");
        return playlistData;
      } else {
        throw new Error("Failed to add songs to playlist");
      }
    } catch (error) {
      console.error("Error adding songs:", error.message);
      return null;
    }
  };

  const handleCreatePlaylist = async () => {
    const playlist_id = await createPlaylist();
    return addSongsToPlaylist(playlist_id);
  };

  const filterTracks = (trackList, name) => {
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

  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSearch = () => {
    // Trigger getting all tracks only if it hasn't been fetched yet
    if (allTracks.length === 0) {
      getAllSavedTracks();
    }
    if (allTracks.length > 1) {
      console.log("All Tracks: ", allTracks);
    }
  };

  return (
    <div className="App" style={{ backgroundColor: "#DDF2FD" }}>
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "blue",
        }}
      >
        <img
          src={SPOTIFY_LOGO}
          alt=""
          style={{ height: "10rem", margin: "1rem" }}
        />
        {/* <div>{SPOTIFY_LOGO}</div> */}
      </header>
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
        {!token && <h2>Please Login</h2>}
        {!token ? (
          <a
            onClick={handleLogin}
            style={{
              cursor: "pointer",
              width: "10rem",
              height: "3rem",
              // backgroundColor: "#81E4DA",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5px",
            }}
            className="btn"
          >
            <i className="animation"></i>
            Login to Spotify
            <i className="animation"></i>
          </a>
        ) : (
          <button
            onClick={handleLogout}
            style={{ position: "absolute", top: "2rem", right: "5rem" }}
          >
            Logout
          </button>
        )}
        {token && (
          <>
            {/* ==================================================== */}
            {!allTracks.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <label style={{ margin: "1rem" }}>
                  What artist would you like?
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "10rem",
                  }}
                >
                  <input
                    className="input"
                    onChange={handleChange}
                    type="text"
                    style={{ margin: "1rem" }}
                  />
                  <button
                    className="button"
                    onClick={handleSearch}
                    style={{ margin: "1rem" }}
                  >
                    GET
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {filteredTracks.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <label style={{ margin: "1rem" }}>
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
                    className="input"
                    type="text"
                    name="playlist-name"
                    id=""
                    onChange={handlePlaylistNameChange}
                    style={{ width: "100%", margin: "1rem" }}
                  />
                  <button
                    className="button"
                    onClick={handleCreatePlaylist}
                    style={{}}
                  >
                    CREATE PLAYLIST
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================== */}

            {filterTracks && (
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
                  {renderFilteredTracks()}
                </div>
              </>
            )}
            {gettingTracks && (
              <div className="loader">
                <div className="loader-inner">
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                  <div className="loader-block"></div>
                </div>
              </div>
            )}
            {createdPlaylist && (
              <button className="contactButton" style={{ cursor: "pointer" }}>
                <a
                  target="_blank"
                  href={playlistUrl}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Open playlist
                </a>
                <div className="iconButton">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30"
                    height="24"
                  >
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path
                      fill="currentColor"
                      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                    ></path>
                  </svg>
                </div>
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default App;
