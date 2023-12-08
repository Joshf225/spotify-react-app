import React from "react";
import SPOTIFY_LOGO from "../assets/spotify_logo.png";
import { useEffect, useState } from "react";

function Navbar({ handleLogin, handleLogout, token }) {
  return (
    <>
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
          style={{ height: "5rem", margin: "1rem" }}
        />
        {/* <div>{SPOTIFY_LOGO}</div> */}
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
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{ position: "absolute", top: "2rem", right: "5rem" }}
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
}

export default Navbar;
