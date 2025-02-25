import { Show } from "../shared/Models/Show";

export const sortByShowDate = (a: Show, b: Show) => {
  if (new Date(a.starttime).getTime() > new Date(b.starttime).getTime()) {
    return 1;
  } else {
    return -1;
  }
};
