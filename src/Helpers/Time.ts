import dayjs from "dayjs";

export const formatEventTime = (timestamp: dayjs.Dayjs) =>
  timestamp.format(timestamp.minute() > 0 ? "h:mm A" : "h A");
