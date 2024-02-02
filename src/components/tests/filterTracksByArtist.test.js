const filterTracksByArtist = (trackList, name) => {
  const filtered = trackList.filter((track) => {
    const artists = track.track.artists;
    return artists.some(
      (artist) => artist.name.toLowerCase() === name.toLowerCase()
    );
  });

  return filtered;
};

describe("filterTracksByArtist", () => {
  it("should filter tracks by artist name", () => {
    const mockTracks = [
      {
        track: {
          artists: [{ name: "Artist 1" }],
        },
      },
      {
        track: {
          artists: [{ name: "Artist 2" }],
        },
      },
    ];

    const result = filterTracksByArtist(mockTracks, "Artist 1");
    expect(result).toHaveLength(1);
    expect(result[0].track.artists[0].name).toBe("Artist 1");
  });

  // More test cases can be added here
});
