import Spotify from "../../Images/Icons/Spotify.png";
import HatchedIcon from "../../Images/Icons/HatchedIcon2.png";
import { ArtistObject } from "./Models/Artist";
import { Venue } from "./Models/Venue";
import { Type } from "./Models/Type";

export interface IBadge {
  image?: string;
  customImage?: string;
  type?: string;
  description?: string;
  name: string;
  label: string;
  awardText: string;
  criteria?: (target: ArtistObject) => boolean;
  icon?: React.ReactNode;
}

export const BADGES: IBadge[] = [
  {
    image: HatchedIcon,
    name: "hatched",
    label: "Hatched",
    awardText:
      "Awarded to artists who have verified their profile and connected to Stripe for payouts.",
    criteria: (target: ArtistObject) => target.stripeEnabled,
  },
  {
    name: "spotify",
    customImage: Spotify,
    type: "milestone",
    label: "Spotify",
    description: "obtained a Spotify Score over 25.",
    awardText: "Awarded to artists who obtain a Spotify Score over 25",
    criteria: (target: ArtistObject) => target.spotifyScore > 25,
  },
];

export const getBadges = (
  type: Type,
  target: ArtistObject,
  venues: { [key: string]: Venue }
) => {
  const badges: IBadge[] = [];
  if (type === "artist") {
    BADGES.forEach((badge) => {
      if (badge.criteria(target)) {
        badges.push(badge);
      }
    });
    target.performances?.forEach((performance) => {
      if (venues?.[performance.venueID]) {
        let badge = {
          name: venues[performance.venueID].name,
          label: venues[performance.venueID].name,
          image: venues[performance.venueID].avatar,
          awardText:
            "Awarded to artists who have given their first performance at " +
            venues[performance.venueID].name,
        };
        badges.push(badge);
      }
    });
  }
  return badges;
};

// shows: {
//     icon: "mic",
//     label: "Shows",
//     description: 'This is the total number of TuneHatch shows played.',
//     info: "shows",
// },
// venues: {
//     icon: "holiday_village",
//     label: "Venues",
//     description: 'This is the total number of TuneHatch venues performed in.',
//     info: "venues",
// },
// cities: {
//     icon: "pin_drop",
//     label: "Cities",
//     description: 'This is total number of cities for TuneHatch performances.',
//     info: "cities",
// },
