import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

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
  const [tracks, setTracks] = useState([]);
  const [userSpotifyId, setUserSpotifyId] = useState("");
  const [uri, setUri] = useState([]);
  const [playlistId, setPlaylistId] = useState("");
  const [search, setSearch] = useState("");
  const [allTracks, setAllTracks] = useState([]); // State to store all tracks

  useEffect(() => {
    handleValidToken();
    if (Date.now() / 1000 > window.localStorage.getItem("expires_in")) {
      return getRefreshToken();
    }
    if (playlistId) {
      console.log("id:  ", playlistId);
    }
  }, []);

  useEffect(() => {
    console.log("All Tracks: ", allTracks);
    let filtered = filterTracks(allTracks, search);
    console.log("Filtered tracks: ", filtered);
    let uri = filtered.map((track) => {
      return track.track.uri;
    });
    console.log("filtered uri: ", uri);
    setUri(uri);
  }, [allTracks]);

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

  const getSavedTracks = async () => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setTracks(response.data.items);
      console.log(response);
      let res = await response.data.items;
      console.log("raw response: ", res);
      // console.log(filterTracks(res, search));
      let filler = filterTracks(res, search);
      let uri = filler.map((track) => {
        return track.track.uri;
      });
      console.log("filtered response: ", uri);
      setTracks(filler);
      setUri(uri);
      // console.log(response.data.items);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const getAllSavedTracks = async () => {
    let url = "https://api.spotify.com/v1/me/tracks?offset=0&limit=50";
    let tracks = [];

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

      setAllTracks(tracks); // Set all tracks in state
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  const renderTracks = () => {
    return tracks.map(({ track }) => (
      <div
        key={track.id}
        style={{
          margin: "1rem",
          cursor: "pointer",
          backgroundColor: "black",
          borderRadius: "1rem",
        }}
      >
        {/* <div className="track-img" style={{ width: "15rem", padding: "1rem" }}>
          {track.album.images.length ? (
            <img
              src={track.album.images[0].url}
              alt=""
              style={{ width: "90%", borderRadius: "2rem" }}
            />
          ) : (
            <div>No Images</div>
          )}
        </div> */}
        <div className="track-name">
          <h2 style={{ color: "white", textOverflow: "hidden" }}>
            {track.name}
          </h2>
        </div>
      </div>
    ));
  };

  //

  //===============================================================================

  // const getSavedTracks = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setTracks(response.data.items); // Set tracks in state
  //     setNextPage(response.data.next); // Set URL of the next page
  //   } catch (error) {
  //     console.error("Error fetching tracks:", error);
  //   }
  // };

  // const getAllSavedTracks = async () => {
  //   const url = "https://api.spotify.com/v1/me/tracks?offset=1&limit=50";
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const updatedTracks = [...allTracks, ...response.data.items]; // Concatenate new tracks with existing ones
  //     setAllTracks(updatedTracks); // Set all tracks in state

  //     // Check if there are more tracks available
  //     if (response.data.next) {
  //       // Fetch next page if available
  //       await getAllSavedTracks(response.data.next);
  //     }
  //     console.log(response);
  //   } catch (error) {
  //     console.error("Error fetching tracks:", error);
  //   }
  // };

  // const renderTracks = () => {
  //   return tracks.map(({ track }) => (
  //     <div key={track.id}>
  //       <h2>{track.name}</h2>
  //     </div>
  //   ));
  // };
  //===============================================================================

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
    }
    // console.log("Spotify Id:", Id);
    try {
      const url = `https://api.spotify.com/v1/users/${Id}/playlists`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const body = {
        name: `Playlist of ${search}`,
        description: "temp playlist 1",
        public: true,
      };

      const response = await axios.post(url, body, {
        headers: headers,
      });

      if (response.status === 201) {
        const playlistData = response.data;
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

  return (
    <div className="App">
      <section
        className="header"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Spotify React</h1>
      </section>
      <section>
        {!token ? (
          <a onClick={handleLogin} style={{ cursor: "pointer" }}>
            Login to Spotify
          </a>
        ) : (
          <button
            onClick={handleLogout}
            style={{ position: "absolute", top: "2rem", right: "5rem" }}
          >
            Logout
          </button>
        )}
        {!token && <h2>Please Login</h2>}
        {token && (
          <>
            <div
              className="container"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "10rem",
              }}
            >
              <input onChange={handleChange} type="text" />
              <button onClick={getAllSavedTracks}>GET</button>
              <button onClick={handleCreatePlaylist}>CREATE PLAYLIST</button>
            </div>
            {tracks && (
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
                  {tracks && renderTracks()}
                </div>
              </>
            )}
          </>
        )}
        {/* {tracks.length > 0 && (
          <div>
            <button onClick={fetchNextTracks}>Next</button>
            {renderTracks()}
          </div>
        )} */}
      </section>
    </div>
  );
}

export default App;
