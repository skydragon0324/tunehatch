import { Show } from "../shared/Models/Show";

export const FilterByShowTime = (
  show: Show,
  starttime: string | Date | number,
  endtime: string | Date | number
) => {
  let startRange = new Date(starttime).getTime();
  let endRange = new Date(endtime).getTime();
  let showStart = new Date(show.starttime).getTime();
  // let showEnd = new Date(show.endtime).getTime();
  if (startRange <= showStart && showStart <= endRange) {
    return !!show;
  }
  //todo: multiple day shows
};
