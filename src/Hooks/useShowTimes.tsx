import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Show } from "../Helpers/shared/Models/Show";
import { formatEventTime } from "../Helpers/Time";

export const useShowTimes = (show: Show) => {
  const [showDate, setShowDate] = useState<string>();
  const [showStartTime, setShowStartTime] = useState<string>();

  useEffect(() => {
    if (!show) return;

    const humanTimestamp = dayjs(show?.starttime);
    setShowDate(humanTimestamp.format("MMMM D"));
    setShowStartTime(formatEventTime(humanTimestamp));
  }, [show]);

  return { showDate, showStartTime };
};
