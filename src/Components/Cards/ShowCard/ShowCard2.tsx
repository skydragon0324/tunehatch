import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Performer, Show } from "../../../Helpers/shared/Models/Show";
import GigButton from "../../Buttons/GigButton";
import Img from "../../Images/Img";
import {
  useGetAllArtistsQuery,
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import Card from "../../Layout/Card";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { Link } from "react-router-dom";
import { openSidebar } from "../../../Redux/UI/UISlice";
import { useAppDispatch } from "../../../hooks";
// import PerformanceHistoryLabel from "../../Labels/PerformanceHistoryLabel";
import Button from "../../Buttons/Button";
import ShowEmblem from "../../Images/ShowEmblem";
import { useGetActiveRegionsQuery } from "../../../Redux/API/RegionAPI";
import RegionInfo from "../../../Helpers/shared/Models/RegionInfo";
import { getVenueLocationCode } from "../../../Helpers/shared/getVenueLocationCode";
import calculateEventTime from "../../../Helpers/shared/calculateEventTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export interface ShowCardProps {
  show?: Show;
  showID?: string;
  children?: React.ReactNode;
  isGig?: boolean;
  onShowSelect?: (show: Show) => void;
  type?: string;
  ticketIDs?: string[];
  tickets?: string[];
}
/**
 * Renders a card representing a single show
 * @prop show {Show}
 * @prop onShowSelect {Function}
 * @returns {JSX.Element}
 */
export default function ShowCard(props: ShowCardProps) {
  const activeRegions = useGetActiveRegionsQuery();

  const shows = useGetAllShowsQuery(null, {
    skip: !props.showID || props.show !== undefined,
  });
  const show = props.show || shows.data?.[props.showID];
  const dispatch = useAppDispatch();
  const [showDetails, setShowDetails] = useState(false);
  const venue = useGetAllVenuesQuery().data?.[show?.venueID];
  const [performerIDs, setPerformerIDs] = useState(null);
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const showrunner = show?.showrunner?.[0]
    ? showrunners.data?.[show?.showrunner[0].id]
    : null;
  const artists = useGetAllArtistsQuery();
  const [performerAvatars, setPerformerAvatars] = useState([]);


  const [timezone, setTimezone] = useState("America/Chicago");
  const regions = activeRegions.data;
  const regionCode = getVenueLocationCode(venue);
  useEffect(() => {
    if (regions && regionCode) {
      regions.forEach((region) => {
        if (region.locations.includes(regionCode)) {
          setTimezone(region.timezone);
          console.log(region.timezone)
        }
      });
    }
  }, [regions, regionCode]);
  const getDisplayTime = useCallback(
    (show: object, timezone: string) => {
      return calculateEventTime(show, timezone)
    },
    []
  );

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const getPerformers = (performers: Performer[]) => {
    const performerIDs = performers?.map((performer) => performer.uid);

    setPerformerIDs(performerIDs);
  };

  const getPerformerAvatars = async (performers: string[]=[]) => {
    const avatarPromises = performers.map(async (performer) => {
      const artist = await artists?.data?.[performer];
      return artist?.avatar || null;
    });

    const avatars = await Promise.all(avatarPromises);
    setPerformerAvatars(avatars);
  };

  useEffect(() => {
    if (show?.performers.length > 0) {
      getPerformers(show?.performers);
    }
  }, [show?.performers]);

  useEffect(() => {
    if (show?.performers.length > 0) {
      getPerformerAvatars(performerIDs);
    }
  }, [show?.performers, performerIDs]);
  // let tzStarttime: Dayjs;
  // const venueShortcode = venue?.location.metadata
  //   ? venue?.["location"]?.["metadata"]?.["address_components"]?.find(
  //       (c: any) => c.types.includes("locality")
  //     ).long_name +
  //     ", " +
  //     venue?.["location"]?.["metadata"]?.["address_components"]?.find(
  //       (c: any) => c.types.includes("administrative_area_level_1")
  //     )?.short_name
  //   : "";
  // if (venueShortcode) {
  //   const venueRegion = activeRegions.data?.find((region: RegionInfo) =>
  //     region.locations.includes(venueShortcode)
  //   );
  //   tzStarttime = dayjs(show?.starttime).tz(
  //     venueRegion?.timezone || "America/Chicago",
  //     true
  //   );
  // } else {
  //   tzStarttime = dayjs(show?.starttime);
  // }
  // // Time object for display
  // const start = useMemo(
  //   () => ({
  //     month: dayjs(tzStarttime).format("dddd, MMMM"),
  //     day: dayjs(tzStarttime).format("D"),
  //     time: dayjs(tzStarttime).format("h:mm A"),
  //     timeZone: dayjs(tzStarttime).format("z"),
  //   }),
  //   [show?.starttime]
  // );

  return (
    show && (
      <Card
        className="@container min-w-fit cursor-pointer relative translate-x-0 hover:shadow-md transition-all hover:translate-x-1"
        onClick={toggleDetails}
      >
        <div className="flex w-full flex-col @xl:flex-row items-center text-center @xl:text-left">
          {/** image */}
          <div className="max-w-[128px] flex-none m-4">
            <ShowEmblem
              venueEmblem={venue?.avatar}
              showrunnerEmblem={showrunner?.avatar}
            />
          </div>

          {/** show info */}
          <div className="flex flex-col flex-grow p-4">
            <div className="text-[24px] font-black">
              <div className="w-full text-center @xl:text-left">{show.name}</div>
            </div>
            <div className="sm:text-[13.6px] @md:text-lg text-grey p-1">
              <div>
                {showrunner ? (
                  <>
                    Hosted by{" "}
                    <Link
                      to={`/profile/g/${showrunner?._key || showrunner?.SRID}`}
                      className="text-orange"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        dispatch(
                          openSidebar({
                            status: true,
                            component: "ViewProfile",
                            data: { profileID: showrunner._key || showrunner.SRID, type: "showrunner" },
                          })
                        );
                      }}
                    >
                      {showrunner?.name}
                    </Link>
                  </>
                ) : (
                  <></>
                )}{" "}
                @{" "}
                <Link
                  to={`/profile/v/${venue?._key}`}
                  className="text-orange"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    dispatch(
                      openSidebar({
                        status: true,
                        component: "ViewProfile",
                        data: { profileID: venue._key, type: "venue" },
                      })
                    );
                  }}
                >
                  {venue?.name}
                </Link>
              </div>
            </div>
            <div className="text-md">
              <div>{`${(getDisplayTime(show, timezone)).startdate.fragments.weekday} ${(getDisplayTime(show, timezone)).startdate.long} | ${(getDisplayTime(show, timezone)).starttime}`}</div>
            </div>
            <div className={`${(show.min_age as number) <= 0 ? "hidden" : ""}`}>
              <div>Age: {show.min_age}+</div>
            </div>
          </div>

          {/** action buttons */}
          <div className="flex flex-grow w-full @xl:w-auto @xl:flex-shrink flex-col items-center sm:items-end p-2">
            {!props.isGig && props.type === "ticket" && (
              <Button
                className="bg-amber-500 w-full text-white"
                full
                inline
                onClick={() =>
                  dispatch(
                    openSidebar({
                      status: true,
                      component: "Ticket Tile",
                      data: {
                        venueID: show.venueID,
                        showID: show._key,
                        ticketIDs: props.ticketIDs,
                        tickets: props.tickets,
                      },
                    })
                  )
                }
              >
                {show.name}
              </Button>
            )}
            {props.type !== "ticket" && (
              <GigButton show={show} isGig={props.isGig} />
            )}
          </div>
        </div>

        {/** details expansion on card click */}
        <div
          className={`flex w-full p-4 flex-col sm:flex-row text-[20px] justify-around align-center text-center sm:text-justify ${
            showDetails ? "" : "hidden"
          }`}
        >
          {/** details */}
          <div className="p-2">
            <div className="tracking-wide font-light">Performing Artists</div>
            <div className="break-after-right">
              <div className="flex flex-row justify-center items-center flex-grow w-full">
                {show.performers.length > 0 ? (
                  performerAvatars.map((avatar, i) => {
                    const artistData = artists?.data?.[performerIDs[i]];
                    const artistName = artistData
                      ? `${artistData.firstname} ${
                          artistData.lastname || artistData.stagename
                        }`
                      : "Unknown Artist";
                    const artistID = artistData && artistData._key;

                    return (
                      <div key={i} className="flex items-center flex-col">
                        <Img
                          src={avatar}
                          className="w-16 h-16 p-2 rounded-full"
                          title={artistName}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            dispatch(
                              openSidebar({
                                status: true,
                                component: "ViewProfile",
                                data: { profileID: artistID, type: "artist" },
                              })
                            );
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center">TBA</div>
                )}
              </div>
            </div>
          </div>
          <div className="p-2">
            <div className="tracking-wide font-light">Peep Venue</div>
            <div className="flex flex-row justify-center items-center flex-grow w-full">
              <Img
                src={venue?.avatar}
                alt={show?.name}
                title={venue?.name}
                className="w-16 h-16 p-2 rounded-full"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  dispatch(
                    openSidebar({
                      status: true,
                      component: "ViewProfile",
                      data: { profileID: venue._key, type: "venue" },
                    })
                  );
                }}
              />
            </div>
          </div>
          {/* <div className="p-2">
            <div className="tracking-wide font-light">Capacity</div>
            <div>{show.capacity}</div>
          </div> */}
        </div>
      </Card>
    )
  );
}
