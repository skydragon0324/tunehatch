/**truncateNumber
 * @param {int} number
 * @param {int} places defaults to 2 decimal places
 */
export default function truncate(number: number, places: number) {
    const reg = new RegExp("^-?\\d+(?:.\\d{0," + (places || 2) + "})?");
    return Number(number.toString().match(reg)?.[0]);
}
