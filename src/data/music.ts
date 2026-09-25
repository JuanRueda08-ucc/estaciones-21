// The playlist is only reachable through its share link: the bare playlist URL returns 404, so the `si` token is required.
const PLAYLIST_ID = "5eMK6UuauVRB4VB7EoeGXz";
const SHARE_TOKEN = "R4gAlGxUS7KegJyt8tHl_A";

export const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}?si=${SHARE_TOKEN}`;
export const PLAYLIST_EMBED_URL = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?si=${SHARE_TOKEN}`;
