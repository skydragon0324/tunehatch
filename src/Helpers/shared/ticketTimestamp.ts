import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);


export function ticketTimestamp(timestamp: string, timezone?: string) {
  console.log("Generating ticket timestamp...");
  console.log("Provided timestamp", timestamp);
  console.log("Timezone", timezone);
  var datestamp;
  if ((timestamp.includes(":00-") || timestamp.includes(":00+")) && !timestamp.includes("000Z")) {
    datestamp = dayjs(timestamp)
      .utc()
      .local()
      .tz(timezone || "America/Chicago");
    console.log("DayJS timestamp", datestamp);
  } else {
      console.log("LEGACY DATE DETECTED");
      datestamp = dayjs(new Date(timestamp)).tz(timezone || "America/Chicago", true);
  }
  const date = datestamp.format("MM/D/YYYY");
  const time = datestamp.format("h:mmA z");
  console.log("Chicago time", time);
  return { date, time };
}
