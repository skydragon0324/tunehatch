import { convertTimestampToUTC } from "../../../server/Services/cleaningService.js";

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const calcMonthlyRepeat = (date: Date | string) => {
  const weekNumber = Math.ceil(new Date(date).getDate() / 7);
  if (weekNumber >= 4) {
    return 4;
  }
  return weekNumber;
};
export const getMonthlyRepeatText = (date: Date | string) => {
  let day = DAY_LABELS[new Date(date).getDay()];
  let repNum = calcMonthlyRepeat(date);
  const repNums = ["first", "second", "third"];
  // if (repNum === 1) {
  //     repNum = "first";
  // } else if (repNum === 2) {
  //     repNum = "second";
  // } else if (repNum === 3) {
  //     repNum = "third";
  // } else {
  //     repNum = "last";
  // }

  getOrdinal(date);
  return `${repNums?.[repNum - 1] || "last"} ${day}`;
};

export const getOrdinal = (timestamp: Date | string) => {
  if (timestamp) {
    const ordinal = calcMonthlyRepeat(timestamp);
    console.log("Ordinal: " + ordinal);
    const date = new Date(timestamp);
    const eventDay = date.getDay();
    console.log("Weekday of Event: " + eventDay);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    let monthStart = nextMonth.getDay();
    console.log("First Weekday of Next Month: " + monthStart);
    let eventDate;
    let diff;
    if (ordinal === 4) {
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
      var lastWeekday = lastDay.getDay();
      diff = lastWeekday - eventDay;
      console.log("Last Weekday of Next Month: " + lastWeekday);
      console.log("Difference Between Last Weekday and Event Day: " + diff);
      diff = lastDay.getDate() - diff;
      if (diff > lastDay.getDate()) {
        diff = diff - 7;
      }
      console.log("Days of Next Month: " + lastDay.getDate());
    } else {
      if (monthStart === 0) {
        monthStart = 7;
      }
      diff = monthStart - eventDay - 1;
      console.log("Difference Subtraction Offset: " + diff);
      diff = ordinal * 7 - diff;
      //If the starting day of the month is before the event day, then it must subtract seven, provided the total is over
      //If it is below 7, then it is the correct date for the first occurence of a weekday.
      if (monthStart - eventDay <= 0 && diff > 7) {
        diff = diff - 7;
      }
    }
    date.setMonth(nextMonth.getMonth());
    date.setFullYear(nextMonth.getFullYear());
    console.log("Date to Set: " + diff);
    date.setDate(diff);
    eventDate = convertTimestampToUTC(new Date(date.getTime()));
    return eventDate;
  }
};
