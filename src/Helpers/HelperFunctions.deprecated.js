import axios from "axios";
import ChickLogo from "../Images/ChickLogo.png";
import { FILE_FIELDS, PUBLIC_URL } from "./configConstants.js";
import { DEFAULT_CALTAGS } from "./shared/calTagsConfig.js";

//Cookies
const setCookie = (name, value, days) => {
    if (navigator.cookieEnabled && typeof document !== "undefined") {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    } else {
    }
};

const getCookie = (cookie) => {
    if (navigator.cookieEnabled && typeof document !== "undefined") {
        var name = cookie + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca?.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name?.length, c?.length);
            }
        }
        return null;
    } else {
        return null;
    }
};

const clearCookie = (cookie) => {
    if (getCookie(cookie)) {
        document.cookie =
            cookie + "=;path=/;expires=Thu, 01 Jan 1970 00:00:01 CST";
        return true;
    }
};

//Time Functions

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
/**
 * Add hours to a Date
 * @param {date} date - Date Object to add to
 * @param {hours} hours - Number of hours to add
 */
const addHoursToDate = (date, hours) => {
    if (!date) {
        date = new Date();
    }

    return new Date(
        date.setTime(
            date.getTime() +
                (hours ? hours * 60 * 60 * 1000 : 1 * 60 * 60 * 1000),
        ),
    );
};

/**
 * Returns human time of timestamp. If timestamp is for more than one day prior, returns day. If one week prior or more, returns date.
 * @param {timestamp} Timestamp - Timestamp in ms
 */
const getDayTime = (timestamp) => {
    var days = ["Sun", "Mon", "Tues", "Thurs", "Fri", "Sat"];
    var date = new Date(timestamp);
    var now = new Date();
    //messages older than one week display date
    if (now.getTime() - timestamp > 604800000) {
        return (
            date.getMonth() +
            1 +
            "/" +
            date.getDate() +
            "/" +
            String(date.getFullYear()).slice(-2)
        );
    }
    if (date.getDay() !== now.getDay()) {
        return days[date.getDay()];
    }
    var hour = date.getHours();
    var hourSuffix;
    if (hour > 12) {
        hour = hour - 12;
        hourSuffix = "PM";
    } else {
        hourSuffix = "AM";
    }
    if (hour === 0) {
        hour = 12;
    }
    var minutes = "0" + date.getMinutes();
    return hour + ":" + minutes.substr(-2) + hourSuffix;
};
/**
 * Reschedules a timestamp to be after another date. If hours is not specified, it will be one
 * hour after the comparison date.
 * @param {date} Date - Date to reschedule
 * @param {comparison} Date - Date to compare. This should be larger than the first date.
 * @param {hours} int - (optional) Number of hours to offset the date by. Defaults to 1.
 */
const rescheduleTimestamp = (date, comparison, hours) => {
    hours = hours || 1;
    if (!date) {
        date = new Date();
    }
    date = Math.floor(date);
    comparison = Math.floor(comparison);
    if (date >= comparison) {
        let newDate = date + hours * 3600000;
        date = newDate;
    }
    // if ((date.getHours() <= comparison.getHours() && date.getMinutes() <= comparison.getMinutes()) || date.getHours() <= comparison.getHours()) {
    //     date = new Date(comparison.getTime() + (hours || 1) * 60 * 60 * 1000)
    // }
    return new Date(date);
};
/**
 * Converts a timestamp to human-friendly format.
 * @param {timestamp} timestamp - Timestamp
 * @param {includeYear} bool - Include the year in timestamp display
 * @param {bool} shortTime Simplify time display by removing timezone and trailing zeroes
 */
function convertTimestamp(timestamp, includeYear, shortTime) {
    const date = new Date(timestamp);
    let timezone = "";
    let year = "";
    if (includeYear) {
        year = date.getFullYear();
    }
    var month;
    switch (date.getMonth()) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
            break;
        default:
            month = "Undefined";
    }
    let day = date.getDate();
    let hour = date.getHours();
    var hourSuffix;
    if (hour > 11) {
        hour = hour - 12;
        hourSuffix = "PM";
    } else {
        hourSuffix = "AM";
    }
    if (hour === 0) {
        hour = "12";
        hourSuffix = "PM";
    }
    var minute = date.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (minute === "00" && shortTime) {
        minute = "";
    }
    if (!shortTime) {
        timezone = "CST";
    }

    return (
        month +
        " " +
        day +
        " " +
        year +
        " | " +
        hour +
        (minute !== "" ? ":" : "") +
        minute +
        hourSuffix +
        " " +
        timezone
    );
}

/**
 * Converts a timestamp to a full date
 * @param {timestamp} timestamp - Timestamp
 * @param {includeYear} bool - Include the year in timestamp display
 */
function getFullDate(timestamp, includeYear) {
    const date = new Date(timestamp);
    let year = "";
    if (includeYear) {
        year = date.getFullYear();
    }
    var month;
    switch (date.getMonth()) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
            break;
        default:
            month = "Undefined";
    }
    let day = String(date.getDate());

    return month + " " + day + ", " + year;
}

function toStandardTime(timestamp) {
    let timecode = "AM";
    let times = timestamp.split(":");
    if (times[0] > 12) {
        times[0] = times[0] - 12;
        timecode = "PM";
    }
    if (times[0] === 0) {
        times[0] = 12;
    }

    return parseInt(times[0]) + ":" + times[1] + " " + timecode;
}

//Data Parsing
/**
 * defaultValue
 * Gets default value based on type of field
 * @param {string} inputType Can be toggle, dropdown, button. Defaults to standard input
 * @param {string} defaultValue (optional) Pass if an initial value is provided
 */
function getDefaultValue(inputType, defaultValue) {
    if (defaultValue !== undefined && defaultValue !== null) {
        return defaultValue;
    }
    switch (inputType?.toLowerCase()) {
        case "toggle" || "button":
            return false;
        case "dropdown":
            return "other";
        default:
            return "";
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function prepMediaFormData(form, SECRET_UID, venueID) {
    let formData = new FormData();
    if (venueID) {
        formData.append("venueID", venueID);
    }
    formData.append("SECRET_UID", SECRET_UID);
    for (let key in form) {
        if (!FILE_FIELDS.includes(key)) {
            formData.append(key, JSON.stringify(form[key]));
        } else {
            //handling for multiple files
            if (Array.isArray(form[key])) {
                form[key].forEach((value) => {
                    formData.append(key, value);
                });
            } else {
                formData.append(key, form[key]);
            }
        }
    }
    return formData;
}

/**
 * showInProgress
 * Determines whether a show is currently occuring.
 * A show is considered "begun" one hour before the scheduled starttime
 * If timeUntilStart is true, if the show has not yet begun, will return the amount of time in ms until it does.
 * @param {obj} show Show object
 * @param {bool} displayTimeUntilStart (optional)
 */
function showInProgress(show, displayTimeUntilStart) {
    let starttime = new Date(show.starttime).getTime();
    let endtime = new Date(show.endtime).getTime();
    let now = Date.now();
    if (starttime < now && now < endtime) {
        return true;
    } else {
        let timeUntilStart = starttime - now;
        if (timeUntilStart < 3600000) {
            return true;
        }
        if (displayTimeUntilStart) {
            return timeUntilStart;
        }
    }
    return false;
}
/**
 * sortVenueShows
 * Returns specified shows in array.
 * @param {obj} shows Shows Object
 * @param {_key} venueID
 * @param {bool} onlyPublished (optional) If true, limits to published shows
 * @param {bool} onlyPast (optional) If true, limites to past shows.
 */
function sortVenueShows(shows, venueID, onlyPublished, onlyPast) {
    var returnShows = [];
    if (shows.loading === "completed") {
        Object.keys(shows).forEach((showKey) => {
            if (shows[showKey]?.venueID === venueID) {
                let show = { ...shows[showKey] };
                if (
                    (onlyPublished ? show.published : true) &&
                    (onlyPast ? new Date(show.endtime) > Date.now() : true)
                ) {
                    show.calTag = show.calTag || null;
                    if (!show.calTag) {
                        show.calTag = show.published
                            ? "published"
                            : "unpublished";
                    }
                    returnShows.push(show);
                }
            }
        });
        return returnShows;
    } else {
        return [];
    }
}

function upcomingShows(shows, id, type) {
    //requires showData from state, ID of user/venue
    //optional field "type" can be "artist" or "venue" or "user".
    //type defaults to user
    var returnShows = [];
    var IDList = [];
    if (!Array.isArray(id)) {
        IDList = [id];
    } else {
        IDList = id;
    }
    if (shows.loading === "completed") {
        switch (type) {
            case "artist":
            case "showrunner":
                for (const id of IDList) {
                    if (id) {
                        Object.keys(shows).forEach((showKey) => {
                            if (
                                shows[showKey].performers &&
                                shows[showKey].published &&
                                new Date(shows[showKey].endtime).getTime() >
                                    Date.now()
                            ) {
                                if (
                                    shows[showKey].performers.some(
                                        (performer) => performer.uid === id,
                                    )
                                ) {
                                    returnShows.push(shows[showKey]);
                                }
                            }
                        });
                    }
                }
                break;
            case "venue":
                Object.keys(shows).forEach((showKey) => {
                    if (
                        shows[showKey].venueID === id &&
                        shows[showKey].published &&
                        new Date(shows[showKey].endtime).getTime() > Date.now()
                    ) {
                        returnShows.push(shows[showKey]);
                    }
                });
                break;
            default:
                //todo: user
                return [];
        }
        return returnShows;
    } else {
        return [];
    }
}
/**
 * Sorts shows by date descending
 * @param {shows} object - Shows object to sort
 */
function sortShows(shows) {
    let sortedArray = [];
    const sortedShows = Object.entries(shows).sort(function (a, b) {
        if (a[1] && b[1]) {
            return new Date(a[1].starttime).getTime() >
                new Date(b[1].starttime).getTime()
                ? 1
                : -1;
        } else {
            return 0;
        }
    });
    sortedShows.forEach((show) => {
        sortedArray.push(show[1]);
    });
    return sortedArray;
}
/**
 * specifyShows
 * Sorts shows by criteria
 * @param {Array} shows An Array of shows
 * @param {str} type "shows" or "gigs", false for all
 * @param {bool} includePast Return future and past shows
 */
function specifyShows(shows, type, includePast) {
    let sortedShows = [];
    if (type === "shows") {
        sortedShows = shows.filter(
            (show) => show.published === true && !show.private,
        );
    } else if (type === "gigs") {
        sortedShows = shows.filter(
            (show) => !show.private && !show.lineup_locked,
        );
    } else {
        sortedShows = shows.filter((show) => !show.private);
    }
    if (!includePast) {
        const currTime = new Date().getTime();
        sortedShows = sortedShows.filter(
            (show) => new Date(show.endtime).getTime() > currTime,
        );
    }
    return sortedShows;
}

//Navigation
function getNavLinks(userData, mobile) {
    //list of possible destinations
    //this excludes LogOut due to its functional nature.
    const viewLinks = {
        "/apply": {
            position: "navbar",
            type: "all",
            label: "Apply",
        },
        "/shows": {
            position: "navbar",
            type: "all",
            label: "Shows",
        },
        "/artists": {
            position: "navbar",
            type: "all",
            label: "Artists",
        },
        "/login": {
            position: "navbar",
            type: "logged_out",
            label: "Login",
        },
        "/profile": {
            position: "dropdown",
            type: "logged_in",
            label: "Profile",
        },
        "/messages": {
            position: "dropdown",
            type: "artist",
            type2: "host",
            label: "Messages",
        },
        "/tickets": {
            position: "dropdown",
            type: "logged_in",
            label: "Tickets",
        },
        "/manage-venues": {
            position: "dropdown",
            type: "host",
            label: "Manage Venues",
        },
        "/showrunner-tools": {
            position: "dropdown",
            type: "showrunner",
            label: "Showrunners",
        },
        "/manage-shows": {
            position: "dropdown",
            type: "artist",
            label: "Artist Shows",
        },
    };
    var type = ["all"];
    var links = {};
    //get user type to compare to permissions
    if (userData.uid) {
        type.push("logged_in");
        userData.artist && type.push("artist");
        userData.host && type.push("host");
        userData.showrunner && type.push("showrunner");
    } else {
        type.push("logged_out");
    }
    //Check to see which links user has access to
    Object.keys(viewLinks).forEach((link) => {
        if (
            type.includes(viewLinks[link].type) ||
            type.includes(viewLinks[link].type2)
        ) {
            links[link] = viewLinks[link];
        }
    });
    return links;
}

/**
 * getArtistShows
 * Gets shows that an artist is involved in. By default, will return an array. If includePending is true, will instead return an object of arrays.
 * @param {obj} shows Shows Object
 * @param {_key} uid ArtistID
 * @param {bool} includePast (optional) Includes past shows. Defaults to false.
 * @param {bool} includePending (optional) Includes future shows that an artist has been invited to or applied to. Will cause return to become an object.
 */
function getArtistShows(shows, uid, includePast, includePending) {
    includePast = includePast || false;
    includePending = includePending || false;
    let ts =
        includePending || includePast
            ? {
                  performing: [],
                  invited: [],
                  applied: [],
                  past: [],
              }
            : [];
    Object.keys(shows).forEach((show) => {
        show = shows[show];
        if (show._key) {
            let futureShow = new Date(show.endtime).getTime() > Date.now();
            if (!includePast && !futureShow) {
                return false;
            } else if (
                show.performers?.some(
                    (performer) => performer && performer.uid === uid,
                )
            ) {
                if (!futureShow && includePast) {
                    ts["past"].push(show);
                } else if (includePending && futureShow) {
                    ts["performing"].push(show);
                } else if (futureShow) {
                    ts.push(show);
                }
            } else if (
                futureShow &&
                includePending &&
                !show.lineup_locked &&
                show.applications?.some(
                    (performer) =>
                        performer &&
                        performer.uid === uid &&
                        performer.status !== "rejected",
                )
            ) {
                ts["applied"].push(show);
            } else if (
                futureShow &&
                includePending &&
                !show.lineup_locked &&
                show.invites?.some(
                    (performer) =>
                        performer &&
                        performer.uid === uid &&
                        performer.status !== "rejected",
                )
            ) {
                ts["invited"].push(show);
            }
        }
    });
    return ts;
}

/**
 * renderPageTitle
 * Creates page title, differentiates localhost, Iris, and TuneHatch
 * @param {string} title Piece of title to use when rendering
 * @param {bool} fullTitle (optional) If true, sets title to the parameter specified. Otherwise, appends @ TuneHatch
 */
function renderPageTitle(title, fullTitle) {
    let platformTag = "";
    if (PUBLIC_URL.includes("iris")) {
        platformTag = "[IRIS]";
    } else if (PUBLIC_URL.includes("localhost")) {
        platformTag = "[LH]";
    }
    if (title) {
        document.title =
            platformTag + title + (!fullTitle ? " @ TuneHatch" : "");
    } else {
        document.title = platformTag + "TuneHatch";
    }
}

//Calculations
function getEstimatedPayout(ticket_cost, quantity) {
    return ticket_cost * quantity;
}
/**
 * getRemainingTickets
 * Given a show's ticket tiers, determines how many tickets are available for all combined tier levels.
 * Has support for single-tier events by passing the show's remainingTickets property.
 * @param {ticket_tiers} obj - A show's ticket tiers
 * @param {remainingTickets} int - (optional) For single-tier support
 */
function getRemainingTickets(ticket_tiers, remainingTickets) {
    if (ticket_tiers) {
        let tierTickets = 0;
        Object.keys(ticket_tiers).forEach((tier) => {
            tierTickets = tierTickets + ticket_tiers[tier].quantity;
        });
        return tierTickets;
    } else {
        return remainingTickets;
    }
}
/**
 * equalArrays
 * Checks to see if two arrays are equal
 * @param {a} Array - Array 1
 * @param {b} Array - Array 2
 */
function equalArrays(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a?.length !== b?.length) return false;
    for (var i = 0; i < a?.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

//Naming and Lookups
/**
 * nameFromID
 * Converts UID of artist or venue to human-readable name
 * @param {uid} str - UID
 * @param {artists} Object - Loaded artists
 * @param {venues} Object - Loaded venues
 */
function nameFromID(uid, artists, venues) {
    if (venues[uid]) {
        return venues[uid].name;
    } else if (artists[uid]) {
        return (
            artists[uid].type?.artist?.stagename ||
            artists[uid].firstname + " " + artists[uid].lastname
        );
    } else {
        return "Unknown User";
    }
}

/**
 * artistName
 * Reads user. If artist with stagename, returns stagename. Otherwise, returns first + last name.
 * @param {Object} user User object
 */
function artistName(artist) {
    if (artist) {
        if (artist.type?.artist?.enabled && artist.type.artist.stagename) {
            return artist.type.artist.stagename;
        } else {
            return artist.firstname + " " + artist.lastname;
        }
    }
    return null;
}

/**
 * CategorizeArtists
 * Returns object of arrays, each array being an artist sorted by category
 * @param {obj} artists Object of artists to categorize
 * @param {Array} categories List of categories to sort into.
 * @param {int} maxCategories (optional) Maximum number of categories to search
 */
function categorizeArtists(artists, categories, maxCategories) {
    if (artists && categories) {
        let catArtists = {};
        //initialize category arrays
        categories.forEach((category) => {
            catArtists[category] = [];
        });
        Object.keys(artists).forEach((artist) => {
            if (artists[artist].th_tags) {
                artists[artist].th_tags.forEach((tag) => {
                    if (categories.includes(tag)) {
                        catArtists[tag].push(artists[artist]);
                    }
                });
            }
        });
        return catArtists;
    } else {
        return {};
    }
}
//Notifications
/**
 * nameFromID
 * Converts notifications object into sorted, human-readable values.
 * @param {obj} notifications Notifications object containing read and unread arrays
 */
function parseNotifications(notifications) {
    // * TICKETS_SOLD: showID, quantity
    // *
    // * NEW_APPLICATION: showID, artistID
    // *
    // * APPLICATION_ACCEPTED: showID
    // *
    // * INVITE_ACCEPTED: showID, artistID
    // *
    // * NEW_INVITE: showID, venueID
    // *
    // * SHOW_RESCHEDULED: showID, newTime
    if (notifications && notifications.unread && notifications.read) {
        let displayNotifications = [];
        let notificationTypes = [
            "TICKETS_SOLD",
            "NEW_APPLICATION",
            "APPLICATION_ACCEPTED",
            "INVITE_ACCEPTED",
            "NEW_INVITE",
            "SHOW_RESCHEDULED",
        ];
        var keyLocations = {};
        notifications.unread.forEach((notif) => {
            //check for existing unread notif with same ID
            if (
                keyLocations[notif.id] &&
                notif.type !== "APPLICATION_ACCEPTED" &&
                notif.type !== "SHOW_RESCHEDULED"
            ) {
                let index = keyLocations[notif.id];
                if (notif.type === "TICKETS_SOLD") {
                    displayNotifications[index].data.quantity =
                        displayNotifications[index].data.quantity +
                        notif.data.quantity;
                } else {
                    displayNotifications[index].multiple = displayNotifications[
                        index
                    ].multiple
                        ? displayNotifications[index].multiple + 1
                        : 2;
                }
                if (displayNotifications[index].timestamp < notif.timestamp) {
                    displayNotifications[index].timestamp = notif.timestamp;
                }
                return false;
            }
            keyLocations[notif.id] = String(
                displayNotifications.push({
                    ...notif,
                    data: { ...notif.data },
                }) - 1,
            );
        });
        const unread = displayNotifications?.length || 0;
        notifications.read.forEach((notif) => {
            //check for existing unread notif with same ID
            if (
                keyLocations[notif.id + "/READ"] &&
                notif.type !== "APPLICATION_ACCEPTED" &&
                notif.type !== "SHOW_RESCHEDULED"
            ) {
                let index = keyLocations[notif.id + "/READ"];
                if (notif.type === "TICKETS_SOLD") {
                    displayNotifications[index].data.abc = "def";
                    displayNotifications[index].data.quantity =
                        displayNotifications[index].data.quantity +
                        notif.data.quantity;
                } else {
                    displayNotifications[index].multiple = displayNotifications[
                        index
                    ].multiple
                        ? displayNotifications[index].multiple + 1
                        : 2;
                }
                if (displayNotifications[index].timestamp < notif.timestamp) {
                    displayNotifications[index].timestamp = notif.timestamp;
                }
                return false;
            }
            keyLocations[notif.id + "/READ"] = String(
                displayNotifications.push({
                    ...notif,
                    data: { ...notif.data },
                    read: true,
                }) - 1,
            );
        });
        displayNotifications
            .sort((a, b) => {
                return a - b;
            })
            .sort();
        return { notifications: displayNotifications, unread };
    } else {
        console.error(
            "Invalid notification object passed to parseNotifications",
        );
        return [];
    }
}

/**
 * humanText
 * Removes underscores.
 * @param {str} text Text to human-ify
 */
function humanText(text) {
    return text.replace("_", " ");
}

/** getCalTagInfo
 * Returns selected CalTag
 * @param {obj} venueTags Object of Venue's tags
 * @param {str} calTag Show's assigned Calendar Tag
 * @param {bool} published Show's publish status
 * @returns {obj} CalTag object
 */
function getCalTagInfo(venueTags, calTag, published) {
    let calTags = { ...(venueTags || {}), ...DEFAULT_CALTAGS };
    if (!calTag || !calTags[calTag]) {
        calTag = published ? "green" : "red";
    }
    return calTags[calTag];
}

/**truncateNumber
 * @param {int} number
 * @param {int} places defaults to 2 decimal places
 */
function truncateNumber(number, places) {
    const reg = new RegExp("^-?\\d+(?:.\\d{0," + (places || 2) + "})?");
    return Number(number.toString().match(reg)?.[0]);
}

/**
 * imageErrFn
 * Automatically replaces the image source with the Chick logo if image is broken.
 */
function imageErrFn({ currentTarget }) {
    currentTarget.onerror = null;
    currentTarget.src = ChickLogo;
}

export {
    getCookie,
    clearCookie,
    setCookie,
    getDefaultValue,
    onlyUnique,
    prepMediaFormData,
    sortVenueShows,
    upcomingShows,
    showInProgress,
    sortShows,
    specifyShows,
    delay,
    convertTimestamp,
    getFullDate,
    toStandardTime,
    addHoursToDate,
    rescheduleTimestamp,
    getDayTime,
    getNavLinks,
    renderPageTitle,
    getArtistShows,
    getEstimatedPayout,
    getRemainingTickets,
    equalArrays,
    nameFromID,
    categorizeArtists,
    artistName,
    parseNotifications,
    humanText,
    getCalTagInfo,
    truncateNumber,
    imageErrFn,
};

/*
Get the spotify artist popularity metric
 */
export const getSpotifyArtistPopularity = async (
    spotifyAccessToken,
    spotifyArtistId,
) => {
    try {
        const artistResponse = await axios.get(
            `https://api.spotify.com/v1/artists/${spotifyArtistId}`,
            {
                headers: {
                    "Accept-Encoding": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${spotifyAccessToken}`,
                },
            },
        );
        const artist = artistResponse.data;
        const popularity = artist.popularity;
        return popularity;
    } catch (err) {
        if (err.response.status === 401) {
            // expired token, let's refresh
            fetchSpotifyAccessToken();
        }
    }
};

/*Function to get shows that include a match for the current user that have end times in the past
The Total number of shows would be all of the shows in the performances collection 
w/ their artist ID and optionally the VenueID from the showID in the performance object. */
export function getShowsForCurrentUser(shows, userID) {
    const userShows = [];
    if (typeof shows !== "object") {
        console.error("Input 'shows' is not an object.");
        return userShows; // Return an empty array in case of an error
    }
    const currentTime = new Date(); // Get the current date and time

    for (const showKey in shows) {
        if (shows.hasOwnProperty(showKey)) {
            const show = shows[showKey];
            if (show && Array.isArray(show.performers) && show.endtime) {
                const showEndTime = new Date(show.endtime);
                if (showEndTime < currentTime) {
                    // Check if the show's endtime is in the past
                    for (const performer of show.performers) {
                        if (performer && performer.uid === userID) {
                            userShows.push(show);
                            break; // No need to check other performers for this show
                        }
                    }
                }
            }
        }
    }
    return userShows;
}

/*
Function to get the total number of unique venues (not counting repeats)
*/
export function getTotalUniqueVenues(artistShows) {
    const uniqueVenues = new Set();

    if (typeof artistShows !== "object") {
        return 0; // Return 0 in case of an error
    }

    for (const showKey in artistShows) {
        if (artistShows.hasOwnProperty(showKey)) {
            const show = artistShows[showKey];
            if (show && show.venueID) {
                uniqueVenues.add(show.venueID);
            }
        }
    }
    return uniqueVenues.size;
}

// Function returning the unique (no repeats) cities of venues where shows were played
export function getUniqueCitiesForShows(shows, venues) {
    const uniqueCities = new Set();
    if (typeof shows !== "object" || typeof venues !== "object") {
        console.error("Input 'shows' or 'venues' is not an object.");
        return Array.from(uniqueCities); // Return an empty array in case of an error
    }

    for (const showKey in shows) {
        if (shows.hasOwnProperty(showKey)) {
            const show = shows[showKey];
            if (show && show.venueID) {
                const venue = venues[show.venueID];
                if (venue && venue.location.city) {
                    uniqueCities.add(venue.location.city);
                }
            }
        }
    }
    return uniqueCities.size;
}
