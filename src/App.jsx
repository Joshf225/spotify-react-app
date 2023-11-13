import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const CLIENT_ID = "a66eaeb1ac224527aaa1970a0e99ce02";
  const REDIRECT_URI = "http://localhost:3000/callback";
  const TOKEN_URL = "https://accounts.spotify.com/api/token";
  const BASE_URL = "https://api.spotify.com/v1/";
  const AUTH_URL = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
  ];

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    handleValidToken();
  }, []);

  const handleValidToken = () => {
    let token = window.localStorage.getItem("token");
    if (!token) {
      const hash = window.location.hash;
      if (hash) {
        token = hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("access_token"))
          .split("=")[1];
        window.location.hash = "";
        window.localStorage.setItem("token", token);
        setToken(token);
      }
    }
    setToken(window.localStorage.getItem("token"));
  };

  const handleLogout = () => {
    setToken("");
    setArtists([]);
    window.localStorage.removeItem("token");
  };

  const searchArtist = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });

    console.log(data.artists.items);
    setArtists(data.artists.items);
  };

  const renderArtists = () => {
    return artists.map((artist) => (
      <div key={artist.id} style={{ margin: "1rem" }}>
        <div className="artist-img">
          {artist.images.length ? (
            <img src={artist.images[0].url} alt="" style={{ width: "10rem" }} />
          ) : (
            <div>No Images</div>
          )}
        </div>
        <div className="artist-name">
          {" "}
          <h2>{artist.name}</h2>
        </div>
      </div>
    ));
  };

  return (
    <div className="App">
      <section className="header">
        <h1>Spotify React</h1>
      </section>
      <section>
        {!token ? (
          <a
            href={`${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
          >
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
        {token ? (
          <>
            <form action="" onSubmit={searchArtist}>
              <input
                type="text"
                onChange={(e) => setSearchKey(e.target.value)}
                style={{
                  width: "15rem",
                  height: "2rem",
                  borderBottomLeftRadius: "7rem",
                  borderTopLeftRadius: "7rem",
                }}
              />
              <button type="text" style={{ height: "2.3rem" }}>
                Search
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Please Login</h2>
          </>
        )}
        <div
          style={{
            backgroundColor: "black",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            maxWidth: "100vw",
            overflow: "hidden",
            flexWrap: "wrap",
            color: "white",
          }}
        >
          {artists ? renderArtists() : ""}
        </div>
      </section>
    </div>
  );
}

export default App;
