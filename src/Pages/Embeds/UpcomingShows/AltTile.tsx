import React, { useCallback, useEffect, useState } from "react";
import {
  useGetAllArtistsQuery,
  useGetAllShowrunnerGroupsQuery,
  // useGetAllArtistsQuery,
  // useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery, useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import {
  displayTicketPrice,
  getShowDate,
} from "../../../Helpers/HelperFunctions";
import { getVenueLocationCode } from "../../../Helpers/shared/getVenueLocationCode";
import { PUBLIC_URL } from "../../../Helpers/configConstants";
import Img from "../../../Components/Images/Img";
import { useGetActiveRegionsQuery } from "../../../Redux/API/RegionAPI";
import calculateEventTime from "../../../Helpers/shared/calculateEventTime";

interface Props {
  showID: string;
  darkMode?: boolean;
}

export default function AltCard({ showID, darkMode }: Props) {
  const shows = useGetAllShowsQuery();
  const show = shows?.data?.[showID];
  // const artists = useGetAllArtistsQuery();
  // const showrunners = useGetAllShowrunnerGroupsQuery();
  // const showrunner =
  //   showrunners.data?.[show?.showrunner?.[0]?.uid] || null;
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[show?.venueID];
  const artists = useGetAllArtistsQuery();
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const showrunner = showrunners.data?.[show?.showrunner?.[0]?.uid] || null;
  const activeRegions = useGetActiveRegionsQuery();
  const regions = activeRegions.data;
  const regionCode = getVenueLocationCode(venue);
  const [timezone, setTimezone] = useState("America/Chicago");
  useEffect(() => {
    if (regions && regionCode) {
      regions.forEach((region) => {
        if (region.locations.includes(regionCode)) {
          setTimezone(region.timezone);
        }
      });
    }
  }, [regions, regionCode]);
  const getDisplayTime = useCallback((show: object, timezone: string) => {
    return calculateEventTime(show, timezone);
  }, []);
  const ticketPrice = displayTicketPrice(show);

  return (
    show?._key && (
      <div
        className={`${
          darkMode ? "dark bg-black" : ""
        } w-64 flex border rounded-lg dark:text-white`}
      >
        <a
          href={`${PUBLIC_URL}/shows/${show._key}`}
          target="_blank"
          rel="noreferrer"
        >
          <div className="flex flex-col">
            <div className="w-full">
              <Img
                src={show.flyer}
                className={`h-36 w-64 rounded-t-lg dark:filter dark:saturate-0`}
              />
            </div>
            <div className="flex">
              <div className="p-3 flex flex-col flex-shrink-0 dark:text-white">
                <p className="text-2xs text-center">{getDisplayTime(show, timezone).startdate.fragments.abbrWeekday}</p>
                <p className="text-xs text-center">{getDisplayTime(show, timezone).startdate.fragments.day}</p>
                <p className="text-2xs text-center">{getDisplayTime(show, timezone).startdate.fragments.hour}</p>
              </div>
              <div className="flex w-full justify-center flex-col">
                <h1 className="text font-black dark:text-white">{show.name}</h1>
                <p className="text-left text-xs pb-1">
                  {ticketPrice === "Free" ? "Free Show" : ticketPrice}
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>
    )
  );
}
