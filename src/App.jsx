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
      } else {
        // Handle the case when hash is undefined or null
        console.log("Hash is undefined or null");
      }
    } else {
      setToken(window.localStorage.getItem("token"));
    }
  };

  const handleLogout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
        {/* {
          token ? 
        } */}
      </header>
    </div>
  );
}

export default App;
