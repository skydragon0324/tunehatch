import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

/**
 * calculateEventTime
 * Given a show object, returns time zone corrected start and end times.
 * If timezone is omitted, defaults to CST.
 *
 * Returns object containing the start/end dates & times
 * @param {Show} show
 * @param {string} timezone
 * @returns {{
 *      startdate: {
 *          long: string,
 *          short: string,
 * fragments: {
 *      month: string,
 * abbrMonth: string,
 *  weekday: string,
 * abbrWeekday: string,
 * day: string,
 * year: string,
 * hour: string,
 * timezone: string,
 * }
 *      };
 *      starttime: string;
 *      enddate: {long: string,
 *          short: string
 *          fragments: {
 *      month: string,
 * abbrMonth: string,
 *  weekday: string,
 * abbrWeekday: string,
 * day: string,
 * year: string,
 * hour: string,
 * timezone: string
 * }};
 *      endtime: string;
 * }}
 */
export default function calculateEventTime(show, timezone) {
    if (show) {
        let starttime;
        let endtime;
        let timeObject = {
            startdate: {
                long: null,
                short: null,
                fragments: {
                    month: null,
                    abbrMonth: null,
                    weekday: null,
                    abbrWeekday: null,
                    day: null,
                    year: null,
                    hour: null,
                    timezone: null,
                },
            },
            starttime: null,
            enddate: {
                long: null,
                short: null,
                fragments: {
                    month: null,
                    abbrMonth: null,
                    weekday: null,
                    abbrWeekday: null,
                    day: null,
                    year: null,
                    hour: null,
                    timezone: null,
                },
            },
            endtime: null,
        };
        starttime = show.starttime;
        endtime = show.endtime;
        starttime = dayjs(new Date(starttime)).tz(
            timezone || "America/Chicago"
        );

        let timeFormat = (timestamp, includeTZ) => {
            return timestamp.minute() > 0 ? `h:mmA${includeTZ ? " z" : ""}` : `hA ${includeTZ ? " z" : ""}`;
        };

        let longDateFormat = "MMMM Do";
        let shortDateFormat = "YYYY-MM-DD";

        endtime = dayjs(new Date(endtime)).tz(timezone || "America/Chicago");
        timeObject.startdate.long = starttime.format(longDateFormat);
        timeObject.startdate.short = starttime.format(shortDateFormat);
        timeObject.starttime = starttime.format(timeFormat(starttime, true));

        timeObject.startdate.fragments.day = starttime.format("DD");
        timeObject.startdate.fragments.month = starttime.format("MMMM");
        timeObject.startdate.fragments.abbrMonth = starttime.format("MMM");
        timeObject.startdate.fragments.weekday = starttime.format("dddd");
        timeObject.startdate.fragments.abbrWeekday = starttime.format("ddd");
        timeObject.startdate.fragments.year = starttime.format("YYYY");
        timeObject.startdate.fragments.hour = starttime.format(timeFormat(starttime, false));
        timeObject.startdate.fragments.timezone = starttime.format("z");


        timeObject.enddate.long = endtime.format(longDateFormat);
        timeObject.enddate.short = endtime.format(shortDateFormat);
        timeObject.endtime = endtime.format(timeFormat(endtime, true));

        timeObject.enddate.fragments.day = endtime.format("DD");
        timeObject.enddate.fragments.month = endtime.format("MMMM");
        timeObject.enddate.fragments.abbrMonth = endtime.format("MMM");
        timeObject.enddate.fragments.weekday = endtime.format("dddd");
        timeObject.enddate.fragments.abbrWeekday = endtime.format("ddd");
        timeObject.enddate.fragments.year = endtime.format("YYYY");
        timeObject.enddate.fragments.hour = endtime.format(timeFormat(endtime, false));
        timeObject.enddate.fragments.timezone = endtime.format("z");

        return timeObject;
    } else {
        throw Error("A show object was not provided to calculateEventTime.");
    }
}
