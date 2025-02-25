/**
 * parseSpotify
 * Removes spotifyArtistId from link and returns, if applicable
 * @param {str} handle Instagram handle
 */

export function parseSpotify(spotifyLink: string) {
    const search = new RegExp(/\/artist\/(\w+)/);
    const result = spotifyLink.match(search);
    if (result) {
        return result[1];
    } else {
        return null;
    }
}
