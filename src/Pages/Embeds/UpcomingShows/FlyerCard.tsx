import React, { useCallback, useEffect, useState } from "react";
// import { Type } from "../../../Helpers/shared/Models/Type";
import {
  useGetAllArtistsQuery,
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import {
  // displayTicketPrice,
  getShowDate,
} from "../../../Helpers/HelperFunctions";
import { getVenueLocationCode } from "../../../Helpers/shared/getVenueLocationCode";
// import Button from "../../../Components/Buttons/Button";
// import { openModal, openSidebar } from "../../../Redux/UI/UISlice";
// import { DEFAULT_CALTAGS } from "../../../Helpers/shared/calTagsConfig";
import UserIcon from "../../../Components/Images/TargetIcon";
// import { useAppSelector } from "../../../hooks";
import Img from "../../../Components/Images/Img";
import { PUBLIC_URL } from "../../../Helpers/configConstants";
import { useGetActiveRegionsQuery } from "../../../Redux/API/RegionAPI";
import calculateEventTime from "../../../Helpers/shared/calculateEventTime";

export default function FlyerCard(props: {
  showID: string;
  darkMode?: boolean;

  children?: any;
}) {
  const shows = useGetAllShowsQuery();
  const show = shows?.data?.[props.showID];
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
  // );
  // const [showDate, setShowDate] = useState(
  //   show &&
  //     getShowDate(show?.starttime || show?.starttime, {
  //       abbreviateWeekday: true,
  //     })
  // );
  // const [showEndDate, setShowEndDate] = useState(
  //   show &&
  //     getShowDate(show?.endtime || show?.endtime, { abbreviateWeekday: true })
  // );
  // const ticketPrice = displayTicketPrice(show);

  // useEffect(() => {
  //   if (show) {
  //     setShowDate(
  //       getShowDate(show?.starttime || show?.starttime, {
  //         abbreviateWeekday: true,
  //       })
  //     );
  //     setShowEndDate(
  //       getShowDate(show?.endtime || show?.endtime, {
  //         abbreviateWeekday: true,
  //       })
  //     );
  //   }
  // }, [show]);

  return (
    show?._key && (
      <div
        className={`${
          props.darkMode ? "dark" : ""
        } flex flex-col flex-grow w-full border-b dark:text-white`}
      >
        <a
          href={`${PUBLIC_URL}/shows/${show._key}`}
          target="_blank"
          rel="noreferrer"
        >
          <div className="flex">
            <div className="p-3 flex flex-col flex-shrink-0 flex-grow-0 w-14 dark:text-white">
              <p className="text-xs text-center">
                {getDisplayTime(show, timezone).startdate.fragments.weekday}
              </p>
              <p className="text-s text-center">
                {getDisplayTime(show, timezone).startdate.fragments.day}
              </p>
              <p className="text-xs text-center">
                {getDisplayTime(show, timezone).startdate.fragments.hour}
              </p>
            </div>
            <div className="flex-grow p-2 flex flex-col dark:text-white">
              <h2>
                {getDisplayTime(show, timezone).startdate.fragments.month}{" "}
                {getDisplayTime(show, timezone).startdate.fragments.day},{" "}
                {getDisplayTime(show, timezone).startdate.fragments.year} |{" "}
                {getDisplayTime(show, timezone).starttime}
              </h2>
              <h1 className="text-2xl font-black">{show.name}</h1>
              {show.performers.length || (show as any).showrunner?.[0]?.uid ? (
                <div className="flex gap-1 mt-2 mb-2">
                  {showrunner ? (
                    <UserIcon
                      key={"showrunner/" + showrunner.uid}
                      color="border-violet-400"
                      src={showrunner.avatar}
                    />
                  ) : (
                    <></>
                  )}
                  {show.performers?.map((performer, i) => {
                    return (
                      <UserIcon
                        key={"performer/" + performer.uid + i}
                        src={artists?.data?.[performer.uid]?.avatar}
                      />
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
              <Img src={show.flyer} className="w-100" />
            </div>
            <div className="flex items-center p-3">
              {
                // show label
              }
            </div>
          </div>
        </a>
      </div>
    )
  );
}
