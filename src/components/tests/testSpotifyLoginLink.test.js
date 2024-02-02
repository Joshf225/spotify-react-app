/*Testing a Spotify login link in a React application typically involves verifying that the application correctly constructs the URL and redirects the user to the Spotify login page. Since this process involves interaction with an external service (Spotify) and the browser's window object, it can be a bit tricky to test directly. So I ended up changing the approach, testing the logic that constructs the URL and any functions that handle redirection. */

function constructSpotifyLoginUrl(clientId, redirectUri, scope) {
  return `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(
    scope.join(" ")
  )}&response_type=token&show_dialog=true`;
}

describe("constructSpotifyLoginUrl", () => {
  it("constructs the Spotify login URL correctly", () => {
    const clientId = "your-client-id";
    const redirectUri = "http://localhost:3000/callback";
    const scope = ["scope1", "scope2"];

    const url = constructSpotifyLoginUrl(clientId, redirectUri, scope);
    expect(url).toBe(
      "https://accounts.spotify.com/authorize?client_id=your-client-id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=scope1%20scope2&response_type=token&show_dialog=true"
    );
  });
});
