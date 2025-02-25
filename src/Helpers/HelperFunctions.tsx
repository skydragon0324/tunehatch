import { Dispatch } from "@reduxjs/toolkit";
import { dispatchNotification } from "../../server/Services/DBServices/dbService";
import { addStatusMessage } from "../Redux/UI/UISlice";
import { clearForm } from "../Redux/User/UserSlice";
import { sortByShowDate } from "./SortingFunctions/ShowSortingFunctions";
import {
  DAY_LABELS,
  FILE_FIELDS,
  MONTH_LABELS,
  PUBLIC_URL,
} from "./configConstants";
import {
  NotificationResponseAPI,
  ParsedNotifications,
} from "./shared/Models/Notifications";
import { UserProfileDisplay } from "./shared/Models/ProfileDisplay";
import { QueryShowResponse, Show } from "./shared/Models/Show";
import { Type } from "./shared/Models/Type";
import { Venue } from "./shared/Models/Venue";
import { getBadges } from "./shared/badgesConfig";
import { getSocialStats, getStats } from "./shared/statsConfig";
import _ from "lodash";

// First to be refactored

/**
 * showInProgress
 * Determines whether a show is currently occuring.
 * A show is considered "begun" one hour before the scheduled starttime
 * If timeUntilStart is true, if the show has not yet begun, will return the amount of time in ms until it does.
 * @param {obj} show Show object
 * @param {bool} displayTimeUntilStart (optional)
 */
export function showInProgress(show: Show, displayTimeUntilStart?: boolean) {
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
export function sortVenueShows(
  shows: { [key: string]: Show } | { [key: string]: any },
  venueID: string,
  onlyPublished?: boolean,
  onlyPast?: boolean
) {
  var returnShows: Show[] = [];
  if (shows.loading === "completed") {
    Object.keys(shows).forEach((showKey) => {
      if (shows[showKey]?.venueID === venueID) {
        let show = { ...shows[showKey] };
        if (
          (onlyPublished ? show.published : true) &&
          (onlyPast ? new Date(show.endtime).getTime() > Date.now() : true)
        ) {
          show.calTag = show.calTag || null;
          if (!show.calTag) {
            show.calTag = show.published ? "published" : "unpublished";
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

export function upcomingShows(
  shows: { [key: string]: Show },
  id: string,
  type: Type
) {
  //requires showData from state, ID of user/venue
  //optional field "type" can be "artist" or "venue" or "user".
  //type defaults to user
  var returnShows: Show[] = [];
  var IDList = [];
  if (!Array.isArray(id)) {
    IDList = [id];
  } else {
    IDList = id;
  }
  if (shows) {
    switch (type) {
      case "artist":
        for (const id of IDList) {
          if (id) {
            Object.keys(shows).forEach((showKey) => {
              if (
                shows[showKey].performers &&
                shows[showKey].published &&
                new Date(shows[showKey].endtime).getTime() > Date.now()
              ) {
                if (
                  shows[showKey].performers.some(
                    (performer) => performer.uid === id
                  )
                ) {
                  returnShows.push(shows[showKey]);
                }
              }
            });
          }
        }
        break;

      case "showrunner":
        Object.keys(shows).forEach((showKey) => {
          if (
            id != null &&
            shows[showKey].showrunner?.find(
              (sr) => sr.id === id || sr.uid === id
            ) &&
            new Date(shows[showKey].endtime).getTime() > Date.now()
          ) {
            returnShows.push(shows[showKey]);
          }
        });
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
    returnShows.sort(sortByShowDate);
    return returnShows;
  } else {
    return [];
  }
}

// These functions work, however, they rely on the current "user" structure.
/**truncateNumber
 * @param {int} number
 * @param {int} places defaults to 2 decimal places
 */
export function truncateNumber(number: number, places?: number) {
  const reg = new RegExp("^-?\\d+(?:.\\d{0," + (places || 2) + "})?");
  return Number(number.toString().match(reg)?.[0]);
}

export const copyArrayObjectWithFunctions = (array: any[]) => {
  let arr = [];
  for (const value in array) {
    arr.push(array[value]);
  }
  return arr;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const parseProfileData = (type: Type, profile: any, venues?: any) => {
  if (profile) {
    var DisplayData: UserProfileDisplay = {
      type,
      primaryCity: "",
      secondaryCity: "",
      genre: "",
      subgenre: "",
      id: "",
      displayName: "",
      about: "",
      avatar: "",
      banner: "",
      badges: [],
      socialStats: [],
    };
    switch (type) {
      case "venue":
        return (DisplayData = {
          type,
          id: profile._key,
          primaryCity:
            `${profile?.location?.city ? `${profile.location.city}, ` : ""}${
              profile?.location?.state || ""
            }` || `${profile?.location?.address || ""}`,
          displayName: profile.name,
          about: profile.description || "",
          avatar: profile.avatar,
          banner: profile.banner,
          images: profile.images || [],
          socials: profile.socials || {},
        });
      case "showrunner":
        return (DisplayData = {
          type,
          id: profile._key,
          displayName: profile.name,
          primaryCity: "",
          about: profile.description || profile.bio || "",
          avatar: profile.avatar || "",
          banner: profile.banner,
          images: profile.images || [],
          socials: profile.socials || {},
          roster: profile.members?.map((member: any) => {
            return member?.uid || null;
          }),
          venues: profile.venues?.map((venue: Venue) => {
            return venue || null;
          }),
        });
      default:
        // 1 profile display - base don the type and data provided
        return (DisplayData = {
          type: type || "user",
          id: profile._key,
          primaryCity: profile.primaryCity || "",
          secondaryCity: profile.secondaryCity || "",
          displayName: getDisplayName("artist", profile),
          about: profile.bio || "",
          avatar: profile.avatar || "",
          banner: profile.type?.artist?.banner || "",
          genre: profile.type?.artist?.genre || "",
          subgenre: profile.type?.artist?.subgenre || "",
          socials: profile.type?.artist?.socials || {},
          images: profile.images || [],
          sr_groups: profile.sr_groups?.map((group: any) => {
            return group || null;
          }),
          badges: getBadges("artist", profile, venues),
          stats: getStats("artist", profile),
          socialStats: getSocialStats("artist", profile),
        });
    }
  } else {
    return {};
  }
};
/**
 * Sorts shows by date descending
 * @param {shows} object - Shows object to sort
 */
export function sortShowsByDate(
  shows: { [key: string | number]: Show },
  sortDirection: "asc" | "desc" = "asc"
) {
  return _.orderBy(
    shows,
    (show: Show & { getTime?: () => string }) =>
      show.getTime ? show.getTime() : new Date(show.starttime),
    sortDirection
  );
}

export function objToArray(obj: { [key: string]: any }) {
  var arr: { [key: string]: any }[] = [];
  const keys = Object.keys(obj);
  keys?.forEach((key) => {
    arr.push({ ...obj[key] });
  });
  return arr;
}

export function upcomingSRApps(
  showQueryResponse: { data?: { [key: string]: Show }; isLoading?: boolean },
  id: string
) {
  var returnShows: Show[] = [];
  if (!showQueryResponse.isLoading) {
    Object.keys(showQueryResponse.data).forEach((showKey) => {
      let show = showQueryResponse.data?.[showKey];
      if (show?.showrunner) {
        // console.log('SR', show.showrunner)
        // returnShows.push(show);
      }
      if (
        show &&
        (show.showrunner?.[0]?.id || show.showrunner?.[0]?.uid) === id &&
        !show.lineup_locked &&
        new Date(show.starttime).getTime() > Date.now()
      ) {
        returnShows.push(show);
      }
    });
    return returnShows;
  } else {
    return [];
  }
}

export const prepTooltip = (
  status: boolean,
  x: number,
  y: number,
  data: React.ReactNode,
  width?: number,
  height?: number,
  backgroundColor?: string
) => {
  const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;
  if (viewportWidth - x - width < 0) {
    x = x - (viewportWidth - x - width) * -1;
  } else if (x + width > viewportWidth) {
    x = viewportWidth - width;
  }
  return {
    status,
    data,
    width: width || 300,
    height: height || 300,
    x: x,
    y: y,
    backgroundColor: backgroundColor,
  };
};

export const asyncDataSubmit = async (
  SECRET_UID: string,
  displayUID: string,
  form: any,
  setPendingState: (arg: string) => void,
  formName: string,
  submitFn: (formData: any) => any,
  successStatusMessage: string,
  dispatch: Dispatch,
  clearOnComplete: boolean,
  onComplete?: () => void,
  venueID?: string,
  showID?: string,
  separateFormObject?: boolean,
  media?: boolean,
  additionalAuthParams?: any
) => {
  var promise;
  setPendingState("true");
  let formData;
  if (media) {
    formData = prepMediaFormData(form, SECRET_UID, form?.venueID || null);
    promise = submitFn(formData);
  } else {
    formData = form;
    if (separateFormObject) {
      promise = submitFn({
        SECRET_UID,
        ...additionalAuthParams,
        id: displayUID,
        form: formData,
      });
    } else {
      promise = submitFn({
        SECRET_UID,
        ...additionalAuthParams,
        id: displayUID,
        ...formData,
      });
    }
  }
  try {
    await promise.unwrap();
    setPendingState("completed");
    successStatusMessage &&
      dispatch(
        addStatusMessage({ type: "success", message: successStatusMessage })
      );
    if (onComplete && typeof onComplete === "function") {
      onComplete();
    }
    if (clearOnComplete) {
      dispatch(clearForm({ form: formName })) && setPendingState("false");
    }
  } catch (err: any) {
    console.log(err);
    setPendingState("error");
    dispatch(addStatusMessage({ type: "error", message: err.data }));
  }
};
export const getNavLinks = (
  isLoggedIn: boolean,
  isArtist: boolean,
  isHost: boolean,
  isShowrunner: boolean
) => {
  //list of possible destinations
  //this excludes LogOut due to its functional nature.
  const viewLinks: {
    [key: string]: {
      position: string;
      type: string;
      type2?: string;
      label: string;
    };
  } = {
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
    "/venues/manage": {
      position: "dropdown",
      type: "host",
      label: "Manage Venues",
    },
    "/showrunner-tools": {
      position: "dropdown",
      type: "showrunner",
      label: "Showrunners",
    },
    "/artist/manage-shows": {
      position: "dropdown",
      type: "artist",
      label: "Artist Shows",
    },
    "/logout": {
      position: "dropdown",
      type: "logged_in",
      label: "Logout",
    },
  };
  var type = ["all"];
  var links: { [key: string]: any } = {};
  //get user type to compare to permissions
  if (isLoggedIn) {
    type.push("logged_in");
    isArtist && type.push("artist");
    isHost && type.push("host");
    isShowrunner && type.push("showrunner");
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
};

// Regular Functions

export const setCookie = (name: string, value: any, days?: number) => {
  if (navigator.cookieEnabled && typeof document !== "undefined") {
    var expires = "";
    if (!days) {
      days = 365;
    }
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  } else {
  }
};

export const getCookie = (cookie: String) => {
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

export const clearCookie = (cookie: string) => {
  if (getCookie(cookie)) {
    document.cookie = cookie + "=;path=/;expires=Thu, 01 Jan 1970 00:00:01 CST";
    return true;
  }
};

export function prepMediaFormData(
  form: any,
  SECRET_UID: string | Blob,
  additionalAuthParams: { [key: string]: any }
) {
  let formData = new FormData();
  if (typeof additionalAuthParams === "string") {
    //legacy support for venueIDs
    formData.append("venueID", additionalAuthParams);
  } else {
    Object.keys(additionalAuthParams)?.forEach((param) => {
      formData.append(param, additionalAuthParams[param]);
    });
  }
  formData.append("SECRET_UID", SECRET_UID);
  for (let key in form) {
    // if(key === 'attachments_existingFilePaths' || key === 'attachments_existingFileNames'){
    //   formData.append(key, form[key]);

    // }else{
    //handle images
    if (!FILE_FIELDS.includes(key)) {
      formData.append(key, JSON.stringify(form[key]));
    } else {
      // handling for multiple files
      if (Array.isArray(form[key])) {
        form[key].forEach((value: any, i: number) => {
          if (value?.file) {
            formData.append(key, value.file);
            // pass into the form data array of existing and new images
            formData.append(key, "newImage");
          } else {
            console.log(value);
            formData.append(key, value);
          }
        });
      } else {
        formData.append(key, form[key]);
      }
    }
  }
  return formData;
}

export function getDisplayName(type: Type, target: any) {
  if (target) {
    if (type === "artist" || type === "user") {
      return target?.type?.artist?.enabled && target?.type?.artist?.stagename
        ? target.type.artist.stagename
        : target.firstname + " " + target.lastname;
    } else {
      return target?.name;
    }
  } else {
    return null;
  }
}

export function getArtistName(user: any) {
  if (user?.type.artist.stagename) {
    return user.stagename || user.type?.artist?.stagename;
  } else {
    return user.firstname + " " + user.lastname;
  }
}

/** getShowDate
 * Given a show date, returns an object containing the month, day, day of the week, year, and time of the show.
 * @param timestamp standard-formatted timestamp
 * @param options
 * @returns {Object} {month, day, weekday, year, time, inPast}
 */
export function getShowDate(
  timestamp: string | Date,
  options?: {
    abbreviateMonth?: boolean;
    abbreviateYear?: boolean;
    abbreviateWeekday?: boolean;
  }
) {
  const date = new Date(timestamp);
  const ts = date.getTime();
  const now = Date.now();
  let inPast = ts > now;
  let timecode = "AM";
  let times = [date.getHours(), date.getMinutes()];
  if (times[0] > 12) {
    times[0] = times[0] - 12;
    timecode = "PM";
  }
  let minutes = String(times[1]);
  if (times[1] < 10) {
    minutes = times[1] + "0";
  }
  if (minutes === "00") {
    minutes = "";
  }

  return {
    month: options?.abbreviateMonth
      ? MONTH_LABELS[date.getMonth()].substring(0, 3)
      : MONTH_LABELS[date.getMonth()],
    day: date.getDate(),
    weekday: options?.abbreviateWeekday
      ? DAY_LABELS[date.getDay()].substring(0, 3)
      : DAY_LABELS[date.getDay()],
    year: options?.abbreviateYear
      ? String(date.getFullYear()).substring(2, 2)
      : date.getFullYear(),
    time: times[0] + (minutes ? ":" + minutes + " " : minutes) + timecode,
    inPast,
  };
}

export function displayTicketPrice(show: {
  ticket_cost?: string | number;
  doorPrice?: string | number;
  ticket_tiers?: { [key: string]: any };
}) {
  if (show?.ticket_cost || show?.ticket_tiers) {
    if (show.ticket_tiers) {
      let startingPrice: number;
      Object.keys(show.ticket_tiers).forEach((tier) => {
        if (
          show.ticket_tiers[tier] &&
          (show.ticket_tiers[tier]?.price < startingPrice || !startingPrice)
        ) {
          startingPrice = show.ticket_tiers[tier].price;
        }
      });
      return `Tickets from $${startingPrice}`;
    } else {
      return `$${show.ticket_cost} tickets`;
    }
  } else {
    return "Free";
  }
}

export function displayAgeLabel(show: { min_age: string | number }) {
  if (show.min_age && show.min_age !== "0") {
    return `${show.min_age}+`;
  } else {
    return "All Ages";
  }
}

export function generateShowDescription(show: { description: string }) {
  if (show.description) {
    return show.description;
  } else {
    return null;
  }
}

/**
 * getArtistShows
 * Gets shows that an artist is involved in. By default, will return an array. If includePending is true, will instead return an object of arrays.
 * @param {obj} shows Shows Object
 * @param {_key} uid ArtistID
 * @param {bool} includePast (optional) Includes past shows. Defaults to false.
 * @param {bool} includePending (optional) Includes future shows that an artist has been invited to or applied to. Will cause return to become an object.
 */

export function getArtistShows(
  shows: QueryShowResponse,
  uid: string,
  includePast?: boolean,
  includePending?: boolean
) {
  includePast = includePast || false;
  includePending = includePending || false;
  let ts: {
    performing?: Show[];
    invited?: Show[];
    applied?: Show[];
    past?: Show[];
  } =
    includePending || includePast
      ? {
          performing: [],
          invited: [],
          applied: [],
          past: [],
        }
      : {};

  Object.keys(shows).forEach((showKey) => {
    const show = shows[showKey];
    if (show) {
      let futureShow = new Date(show.endtime).getTime() > Date.now();
      if (!includePast && !futureShow) {
        return false;
      } else if (
        show.performers?.some(
          (performer: any) => performer && performer.uid === uid
        )
      ) {
        if (Array.isArray(ts)) return;
        if (!futureShow && includePast) {
          ts["past"].push(show);
        } else if (includePending && futureShow) {
          ts["performing"].push(show);
        } else if (futureShow) {
          // TODO: PubGenius -> What is the purpose of this? its creating now we have ts being an object with set properties or an array?
          // Resolution: checked use cases in /Pages/AristShows.tsx and /Pages/Profile/UserProfile and all require ts to be an object of listed keys above
          // this function might need to be refactored to match current requirements.
          // if (Array.isArray(ts)) {
          //   ts.push(show);
          // }
        }
      } else if (
        futureShow &&
        includePending &&
        !show.lineup_locked &&
        show.applications?.some(
          (performer: any) =>
            performer &&
            performer.uid === uid &&
            performer.status !== "rejected"
        )
      ) {
        ts["applied"].push(show);
      } else if (
        futureShow &&
        includePending &&
        !show.lineup_locked &&
        show.invites?.some(
          (performer: any) =>
            performer &&
            performer.uid === uid &&
            performer.status !== "rejected"
        )
      ) {
        ts["invited"].push(show);
      }
    }
  });
  return ts;
}

//Notifications
/**
 * nameFromID
 * Converts notifications object into sorted, human-readable values.
 * @param {obj} notifications Notifications object containing read and unread arrays
 */
export function parseNotifications(notifications: {
  unread?: ParsedNotifications[];
  read?: ParsedNotifications[];
}): { notifications: ParsedNotifications[]; unread: number } {
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
    let displayNotifications: ParsedNotifications[] = [];
    // let notificationTypes = [
    //   "TICKETS_SOLD",
    //   "NEW_APPLICATION",
    //   "APPLICATION_ACCEPTED",
    //   "APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION",
    //   "INVITE_ACCEPTED",
    //   "NEW_INVITE",
    //   "SHOW_RESCHEDULED",
    // ];
    var keyLocations: { [key: string]: any } = {};
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
            displayNotifications[index].data.quantity + notif.data.quantity;
        } else {
          displayNotifications[index].multiple = displayNotifications[index]
            .multiple
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
        }) - 1
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
          // displayNotifications[index].data.abc = "def";
          displayNotifications[index].data.quantity =
            displayNotifications[index].data.quantity + notif.data.quantity;
        } else {
          displayNotifications[index].multiple = displayNotifications[index]
            .multiple
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
        }) - 1
      );
    });
    // This sorting function is flawed. Review functionality
    displayNotifications
      //   .sort((a, b) => {
      //     return a - b;
      //   })
      .sort();
    return { notifications: displayNotifications, unread };
  } else {
    console.error("Invalid notification object passed to parseNotifications");
    return { notifications: [], unread: 0 };
  }
}

/**
 * renderPageTitle
 * Creates page title, differentiates localhost, Iris, and TuneHatch
 * @param {string} title Piece of title to use when rendering
 * @param {bool} fullTitle (optional) If true, sets title to the parameter specified. Otherwise, appends @ TuneHatch
 */
export function renderPageTitle(title: string, fullTitle?: boolean) {
  let platformTag = "";
  if (PUBLIC_URL.includes("iris")) {
    platformTag = "[IRIS]";
  } else if (PUBLIC_URL.includes("localhost")) {
    platformTag = "[LH]";
  }
  if (title) {
    document.title = platformTag + title + (!fullTitle ? " @ TuneHatch" : "");
  } else {
    document.title = platformTag + "TuneHatch";
  }
}
