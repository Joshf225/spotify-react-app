import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import Confetti from "./components/Confetti";

function App() {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [uri, setUri] = useState([]);
  const [search, setSearch] = useState("");
  const [allTracks, setAllTracks] = useState([]); // State to store all tracks
  const [gettingTracks, setGettingTracks] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [artists, setArtists] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [clearInputValue, setClearInputValue] = useState(false);
  const [value, setValue] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [userSpotifyId, setUserSpotifyId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [createdPlaylist, setCreatedPlaylist] = useState(false);
  const [button, setButton] = useState(false);

  const CLIENT_ID = "a66eaeb1ac224527aaa1970a0e99ce02";
  const REDIRECT_URI = "http://localhost:3000/callback";
  const AUTH_URL = "https://accounts.spotify.com/authorize";
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

  useEffect(() => {
    if (!token) {
      handleValidToken();
    }
    if (Date.now() / 1000 > window.localStorage.getItem("expires_in")) {
      return getRefreshToken();
    }
  }, []);

  useEffect(() => {
    console.log("HIII");
    if (playlistUrl.length > 0) {
      setTimeout(() => {
        window.location.href = playlistUrl;
      }, 5000);
    }
  }, [playlistUrl]);

  useEffect(() => {
    // Filter tracks based on the search criteria
    if (search && allTracks.length > 0) {
      const filtered = filterTracksByArtist(allTracks, search);
      setFilteredTracks(filtered);
      setSearch("");
    }
  }, [allTracks]);

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
      console.error(
        "Error fetching tracks:",
        error.response.data.error.message
      );
      setErrorMessage(error.response.data.error.message);
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
    setValue(e.target.value);
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
      setClearInputValue(false);
      setShowCreatePlaylist(false);
    }
    setClearInputValue(true);
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
    let Id = await getUserProfile();
    setUserSpotifyId(Id);
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
    addSongsToPlaylist(playlist_id);
    setButton(!button);
  };

  return (
    <div className="App">
      <Confetti button={button} />
      <ToastContainer />
      <Navbar
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        token={token}
      />
      {token && (
        <Home
          newPlaylist={newPlaylist}
          setNewPlaylist={setNewPlaylist}
          allTracks={allTracks}
          gettingTracks={gettingTracks}
          handleSearch={handleSearch}
          handleSearchArtist={handleSearchArtist}
          setFilteredTracks={setFilteredTracks}
          displayList={displayList}
          filteredTracks={filteredTracks}
          setDisplayList={setDisplayList}
          handleChange={handleChange}
          token={token}
          filterTracksByArtist={filterTracksByArtist}
          errorMessage={errorMessage}
          setSearch={setSearch}
          clearInputValue={clearInputValue}
          search={search}
          showCreatePlaylist={showCreatePlaylist}
          setShowCreatePlaylist={setShowCreatePlaylist}
          handleCreatePlaylist={handleCreatePlaylist}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          setUri={setUri}
          uri={uri}
        />
      )}
    </div>
  );
}

export default App;
