/**
 * parseInstagram
 * Removes handle from link and returns, if applicable
 * @param {str} handle Instagram handle
 */

export function parseInstagram(handle: string) {
    const search = new RegExp(
        /(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)?\/?([A-Za-z0-9-_.]+)/,
        "im",
    );
    const result = handle.match(search);
    if (result) {
        return result[1];
    } else {
        return null;
    }
}
