# Spotify Liked Songs Playlist Creator

## Overview

This app helps you make a new playlist on Spotify. You tell the app which artist you like, and it looks through your liked songs on Spotify. Then it makes a playlist with songs by that artist.

## Features

- **Find Artist's Songs:** You choose an artist, and the app finds their songs in your liked songs on Spotify.
- **Make a Playlist:** The app creates a new playlist with the songs it found from your chosen artist.
- **Easy to Use:** Simple steps to input your favorite artist and make a playlist.

## How to Use

1. **Log in:** Use your Spotify account details to sign in and access your liked songs.
2. **Enter Artist:** Type in the name of the artist whose songs you want in your new playlist.
3. **Enter Playlist Name:** Type in what you want your playlist to be called.
4. **Create Playlist:** Creates your playlist instantly and provides link on the bottom of the page

## How to Run

### Running Locally

To run the application locally:

1. **Clone Repository:** Clone this repository to your local machine.
2. **Setup Spotify API:** Obtain API keys from Spotify Developer Dashboard and add them to the application.
3. **Install Dependencies:** Install the required dependencies using package manager (e.g., npm, pip).
4. **Run Application:** Start the application using the command line or terminal.
5. **Open in Browser:** Access the app through your web browser or designated platform.

### Using Docker

Alternatively, you can run the app using Docker by pulling the Docker repository:

1. **Pull Docker Repository:**
```bash
docker pull joshf225/cs322-spotify-react-app:latest
```

2. **Run Docker Image:**
```bash
docker run -p 3000:3000 joshf225/cs322-spotify-react-app
```


3. **Access App:** Open your web browser and go to http://localhost:3000 to access the app.

## Development

The app uses Spotify's tools to get your songs and make playlists. It's built with JavaScript.


## Future Improvements

- Add more options to make playlists (like music genre or release year).
- Make the app look better and easier to use.
- Work with other music apps.
- Make it faster for people with lots of 'Liked Songs'.
- Use more than users 'Liked Songs' for the songs to create the playlist. (Check every playlist the user has instead of just the 'Liked Songs')
