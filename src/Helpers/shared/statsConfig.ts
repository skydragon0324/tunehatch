import { ArtistObject } from "./Models/Artist";
import { Type } from "./Models/Type";

// Not used.
// export const serverStats = [
//   {
//     name: "spotifyScore",
//     prerequisite: (target: ArtistObject, type: Type) => target?.type?.artist?.socials?.spotifyLink,
//   },
// ];

export interface IStat {
  name: string;
  types: Type[];
  icon?: string;
  image?: string;
  label: string;
  description?: string;
  valueFn: (target: ArtistObject) => number | string;
  value?: number | string;
}

export const STATS: IStat[] = [
  {
    name: "venues",
    types: ["user", "artist"],
    icon: "location_on",
    label: "Venues Played",
    description:
      "This is the number of TuneHatch venues an artist has performed at",
    valueFn: (target: ArtistObject) => target.performances?.length,
    value: 0,
  },
  {
    name: "shows",
    types: ["user", "artist"],
    icon: "music_note",
    label: "Shows Played",
    description:
      "This is the number of TuneHatch shows an artist has performed.",
    valueFn: (target: ArtistObject) => {
      let performanceCount = 0;
      target.performances?.forEach((performance) => {
        performanceCount = performanceCount + performance.count;
      });
      return performanceCount;
    },
    value: 0,
  },
];

export const getStats = (type: Type, target: ArtistObject) => {
  let newStats = Array.from(STATS);
  let stats: IStat[] = [];
  newStats.forEach((stat) => {
    let tStat = stat;
    if (stat && stat.types?.includes(type)) {
      tStat.value =
        typeof stat.valueFn === "function" ? stat.valueFn(target) : stat.value;
      stats.push(tStat);
    }
  });
  return stats;
};
export const SOCIALS: IStat[] = [
  {
    name: "spotify",
    label: "Spotify",
    image: "tbd",
    types: ["user", "artist"],
    valueFn: (target: ArtistObject) => target.spotifyScore || "Coming Soon!",
  },
  {
    name: "instagram",
    label: "Instagram",
    image: "tbd",
    types: ["user", "artist"],
    valueFn: (target: ArtistObject) =>
      target.instagramFollowers || "Coming Soon!",
  },
  {
    name: "tikTok",
    label: "TikTok",
    image: "tbd",
    types: ["user", "artist"],
    valueFn: (target: ArtistObject) => target.tikTokLikes || "Coming Soon!",
  },
];

export const getSocialStats = (type: Type, target: ArtistObject) => {
  let stats = [];
  let newSocials = Array.from(SOCIALS);
  let socials: IStat[] = [];
  newSocials.forEach((social) => {
    if (social && social.types?.includes(type)) {
      social.value =
        typeof social.valueFn === "function"
          ? social?.valueFn(target)
          : social.value;
      socials.push(social);
    }
  });
  return socials;
};
