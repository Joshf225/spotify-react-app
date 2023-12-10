import React from "react";
import SPOTIFY_LOGO from "../assets/spotify_logo.png";

function Navbar({ handleLogin, handleLogout, token }) {
  return (
    <>
      <header
        className="header"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={SPOTIFY_LOGO}
          alt=""
          style={{ height: "5rem", margin: "1rem" }}
        />
      </header>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {!token ? (
          <>
            <h2>Please Login</h2>
            <a
              onClick={handleLogin}
              style={{
                cursor: "pointer",
                width: "10rem",
                height: "3rem",
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
          </>
        ) : (
          // <button
          //   onClick={handleLogout}
          //   style={{ position: "absolute", top: "2rem", right: "5rem" }}
          // >
          //   Logout
          // </button>
          <button className="Btn" onClick={handleLogout}>
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <div className="text">Logout</div>
          </button>
        )}
      </div>
    </>
  );
}

export default Navbar;
