import React, { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_CALTAGS } from "../Helpers/shared/calTagsConfig";
import useWindowDimensions, { useAppDispatch, useAppSelector } from "../hooks";
import {
  openDrawer,
  openModal,
  openTooltip,
  resetTooltip,
} from "../Redux/UI/UISlice";
import { useGetShowPayoutStatusQuery } from "../Redux/API/VenueAPI";
import { prepTooltip } from "../Helpers/HelperFunctions";
import dayjs from "dayjs";
import Button from "./Buttons/Button";
import { PUBLIC_URL } from "../Helpers/configConstants";
import { formatEventTime } from "../Helpers/Time";
import { useGetShowsQueryState } from "../Redux/API/PublicAPI";
import { Show } from "../Helpers/shared/Models/Show";
import FlyerSharingStatus from "./FlyerSharingStatus";
import { Showrunner } from "../Helpers/shared/Models/Showrunner";

export default function CalendarDay(props: {
  date?: Date | string | number;
  venueID?: string;
  showrunnerID?: string;
  shows?: Show[];
  filterFn?: (val: Show, startDate: number, endDate: number) => boolean;
  onClick?: (day: number) => void;
  selected?: any;
  openDrawer?: any;
  day?: number;
  viewType?: string;
  circle?: any;
  offset?: any;
  external?: boolean;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const [shows, setShows] = useState<Show[]>([]);
  const startDate = new Date(props.date).setHours(0, 0, 0, 0);
  const endDate = new Date(props.date).setHours(23, 59, 59, 59);
  const [circleHeight, setCircleHeight] = useState("40px");
  const dayTile = useRef<HTMLDivElement>(null);
  const windowWidth = useWindowDimensions().width;

  const { data } = useGetShowsQueryState();

  const filteredShows = useMemo(() => {
    const apiSliceShows = Object.values(data || {});
    const allShows = !!apiSliceShows.length ? apiSliceShows : props.shows;

    if (!!allShows && props.filterFn) {
      return allShows
        .filter((show: any) => {
          if (!props.external && !show.published) return false;

          return (
            (show.venueID != null && show.venueID === props.venueID) ||
            (props.showrunnerID != null &&
              show.showrunner?.find(
                (sr: Showrunner) =>
                  (sr.id || sr.uid || sr._key) === props.showrunnerID
              ))
          );
        })
        .sort(
          (a: any, b: any) =>
            new Date(a.starttime).getTime() - new Date(b.starttime).getTime()
        )
        .filter((show: any) => props.filterFn(show, startDate, endDate));
    }

    return [];
  }, [data, endDate, props, startDate]);

  const payouts = useGetShowPayoutStatusQuery(
    { SECRET_UID: user.uid, showIDs: shows, venueID: props.venueID },
    { skip: !shows || !shows.length }
  );

  useEffect(() => {
    if (props.shows && props.filterFn) {
      let filterShows = (props.shows || []).filter(
        (show) => show.venueID === props.venueID
      );
      filterShows = filterShows.sort(
        (a: Show, b: Show) =>
          new Date(a.starttime).getTime() - new Date(b.starttime).getTime()
      );
      setShows(
        filterShows.filter((show: Show) =>
          props.filterFn(show, startDate, endDate)
        )
      );
    }
  }, [props.shows, props.date]);

  useEffect(() => {
    if (dayTile.current) {
      setCircleHeight(dayTile.current.scrollWidth + "px");
    }
  }, [dayTile.current]);

  const handleClick = (day: number) => {
    props.onClick && props.onClick(day);
    if (
      props.selected &&
      new Date(startDate).setHours(18, 0, 0, 0) > Date.now() &&
      windowWidth > 800 &&
      !props.external
    ) {
      dispatch(
        openModal({
          status: true,
          component: "CreateShow",
          data: {
            defaultDate: new Date(props.date),
            venueID: props.venueID,
            SRID: props.showrunnerID,
          },
        })
      );
    }
    props.openDrawer &&
      windowWidth < 800 &&
      dispatch(
        openDrawer({
          status: true,
          component: "DayView",
          data: { shows: shows, date: props.date, venueID: props.venueID },
        })
      );
  };

  const handleTileClick = (e: React.MouseEvent, show: Show) => {
    e.stopPropagation();
    if (windowWidth < 800) {
      handleClick(props.day);

      return;
    }
    if (props.viewType === "venue" || props.viewType === "showrunner") {
      const starttime = dayjs(show?.starttime);
      windowWidth > 800 &&
        dispatch(
          openTooltip(
            prepTooltip(
              true,
              e.clientX,
              e.clientY,
              <>
                <p className="text-xl font-black text-black text-center">
                  {show.name}
                </p>
                <p className="text-xl font-black text-black text-center">
                  {starttime.format("MMMM D")},&nbsp;
                  {formatEventTime(starttime)}
                </p>
                <div className="text-black">
                  <FlyerSharingStatus showID={show._key} />
                </div>
                <Button
                  className="w-full rounded-full p-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    dispatch(resetTooltip());
                    dispatch(
                      openModal({
                        status: true,
                        component: "ManageShow",
                        data: {
                          viewType: "venue",
                          showID: show._key,
                          SRID: props.showrunnerID,
                        },
                      })
                    );
                  }}
                >
                  Manage
                </Button>
                <Button
                  className="w-full rounded-full p-2 mt-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    dispatch(resetTooltip());
                    dispatch(
                      openModal({
                        status: true,
                        component: "ShowDetails",
                        data: { showID: show._key },
                      })
                    );
                  }}
                >
                  Show Details
                </Button>
              </>,
              300,
              300,
              "white"
            )
          )
        );
    } else {
      const starttime = dayjs(show?.starttime);
      windowWidth > 800 &&
        dispatch(
          openTooltip(
            prepTooltip(
              true,
              e.clientX,
              e.clientY,
              <>
                <p className="text-xl font-black text-black text-center">
                  {show.name}
                </p>
                <p className="text-xl font-black text-black text-center">
                  {starttime.format("MMMM D \n h:mmA")}
                </p>
                <Button
                  className="w-full"
                  link={PUBLIC_URL + "/shows/" + show._key}
                  newTab
                >
                  Tickets & Details
                </Button>
              </>,
              300,
              200,
              "white"
            )
          )
        );
    }
  };

  return (
    <div
      onClick={() => handleClick(props.day)}
      className={`${
        props.circle
          ? `w-full p-1 rounded-full flex items-center justify-center`
          : "w-full border h-20 flex-fix flex flex-col md:h-28 overflow-x-auto"
      } ${
        props.offset
          ? props.circle
            ? ""
            : " bg-gray-100 dark:bg-gray-900"
          : ""
      }`}
    >
      <p
        ref={dayTile}
        style={{ height: circleHeight }}
        className={`${
          props.circle
            ? props.offset
              ? ""
              : "border w-full max-w-[50px] rounded-full relative text-center flex items-center justify-center"
            : "text-xs rounded-full w-6 text-center inline-block p-1 "
        } ${props.selected ? "bg-orange font-bold text-white" : ""}`}
      >
        {props.day}
        {props.circle && filteredShows.length > 0 && (
          <span className=" absolute bottom-1 w-2 h-2 rounded-full bg-red-400"></span>
        )}
      </p>
      <div className="flex-col pt-1 lg:p-2 ">
        {!props.circle && filteredShows.length ? (
          filteredShows.map((show) => {
            const timestamp = new Date(show.endtime);
            const currentDate = new Date();
            return (
              <>
                <div
                  onClick={(e) => handleTileClick(e, show)}
                  className="p-1 relative mb-1 lg:rounded-sm"
                  style={{
                    backgroundColor:
                      endDate > Date.now()
                        ? show.calTag
                          ? DEFAULT_CALTAGS[show.calTag].color
                          : DEFAULT_CALTAGS["green"].color
                        : "gray",
                  }}
                >
                  {payouts.data?.[show._key] &&
                    payouts.data?.[show._key] !== "hidden" &&
                    timestamp < currentDate &&
                    new Date(show.endtime) > new Date("2023-08-30") && (
                      <span
                        className={`${
                          payouts.data?.[show._key] === "full"
                            ? "bg-green-400"
                            : ""
                        }${
                          payouts.data?.[show._key] === "partial"
                            ? "bg-yellow-500"
                            : ""
                        }${
                          payouts.data?.[show._key] === "unpaid"
                            ? "bg-red-500"
                            : ""
                        } w-[6px] h-full top-0 left-0 absolute ml-auto`}
                      ></span>
                    )}
                  <p className="text-2xs pl-1 text-white truncate-2">
                    {show.name}
                  </p>
                </div>
              </>
            );
          })
        ) : (
          <div className="h-5"></div>
        )}
      </div>
    </div>
  );
}
