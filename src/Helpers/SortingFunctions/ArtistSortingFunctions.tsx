import { ArtistObject } from "../shared/Models/Artist";

export const sortByPerformanceCount = (a: ArtistObject, b: ArtistObject) => {
  let aCount = 0;
  let bCount = 0;
  if (a.performances) {
    a.performances.forEach((performance) => {
      aCount = aCount + performance.count;
    });
  }
  if (b.performances) {
    b.performances.forEach((performance) => {
      bCount = bCount + performance.count;
    });
  }
  if (aCount < bCount) {
    return 1;
  } else {
    return -1;
  }
};

export const sortByVenueCount = (a: ArtistObject, b: ArtistObject) => {
  if (a.performances?.length < b.performances?.length) {
    return 1;
  } else {
    return -1;
  }
};
