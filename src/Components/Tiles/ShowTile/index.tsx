import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { Type } from "../../../Helpers/shared/Models/Type";
import {
  useGetAllArtistsQuery,
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import {
  displayTicketPrice,
  getShowDate,
} from "../../../Helpers/HelperFunctions";
import { getVenueLocationCode } from "../../../Helpers/shared/getVenueLocationCode";
import Button from "../../Buttons/Button";
import { openModal, openSidebar } from "../../../Redux/UI/UISlice";
import { DEFAULT_CALTAGS } from "../../../Helpers/shared/calTagsConfig";
import UserIcon from "../../Images/TargetIcon";
import VenueManage from "./Sections/VenueManage";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import ArtistManage from "./Sections/ArtistManage";
import { Navigate } from "react-router-dom";
// import PublishShowForm from "../../../Forms/PublishShow";
import Badge from "../../Badges/Badge";
import dayjs from "dayjs";
import { useGetActiveRegionsQuery } from "../../../Redux/API/RegionAPI";
import calculateEventTime from "../../../Helpers/shared/calculateEventTime";

export default function ShowTile(
  props: PropsWithChildren<{
    showID: string;
    viewType?: Type;
    type?: string;
    detailsOnClick?: boolean;
    useModal?: boolean;
    manageView?: boolean;
    hideDate?: boolean;
    canApply?: boolean;
    open?: boolean;
    self?: boolean;
    limit?: number;
    payoutStatus?: string;
  }>
) {
  const user = useAppSelector((state) => state.user.data);
  const shows = useGetAllShowsQuery();
  const dispatch = useAppDispatch();
  const show = useMemo(
    () => shows?.data?.[props.showID],
    [shows, props.showID]
  );
  const [timezone, setTimezone] = useState("America/Chicago");
  const artists = useGetAllArtistsQuery();
  const venues = useGetAllVenuesQuery();
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const activeRegions = useGetActiveRegionsQuery();
  const showrunner =
    showrunners.data?.[(show as any)?.showrunner?.[0]?.uid] || null;
  const venue = venues.data?.[show?.venueID];
  const regions = activeRegions.data;
  const regionCode = getVenueLocationCode(venue);

  useEffect(() => {
    if (regions && regionCode) {
      regions.forEach((region) => {
        if (region.locations.includes(regionCode)) {
          setTimezone(region.timezone);
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
  const [open, setOpen] = useState(props.open || false);
  const [limit, setLimit] = useState(props.limit || 5);
  const ticketPrice = displayTicketPrice(show);

  const showLabel = () => {
    if (!props.manageView) {
      // check if the user
      if (props.type === "invited") {
        return (
          <Button
            className="w-full rounded-full p-2"
            action={openSidebar({
              status: true,
              component: "RespondToShow",
              data: {
                viewType: "artist",
                type: "artist",
                intent: "info",
                artistID: user.displayUID,
                showID: show?._key,
              },
            })}
          >
            Review
          </Button>
        );
      }
      if (!props.self && props.type !== "applied") {
        return (
          <Button
            className="w-full rounded-full p-2"
            action={
              ticketPrice === "Free"
                ? openModal({
                    status: true,
                    component: "TicketPurchase",
                    data: { showID: show._key, free: true },
                  })
                : openModal({
                    status: true,
                    component: "TicketPurchase",
                    data: { showID: show._key },
                  })
            }
            stopPropagation
          >
            {ticketPrice === "Free" ? "Show Info" : "Buy Tickets"}
          </Button>
        );
      }
      if (props.canApply) {
        return (
          <Button
            full
            inline
            className={"bg-amber-500 text-white p-2"}
            iconClassName="text-base font-medium"
            action={openSidebar({
              status: true,
              component: "Apply",
              data: { showID: show._key },
            })}
          >
            Apply
          </Button>
        );
      } else {
        return (
          <Button
            full
            inline
            disabled
            className={"bg-amber-500 text-white p-2"}
            iconClassName="text-base font-medium"
          >
            Applied!
          </Button>
        );
      }
    }
  };
  return (
    show?._key && (
      <>
      <div
        className="flex flex-col flex-grow w-full border-b"
        onClick={() => {
          if (props.detailsOnClick) {
            if (props.useModal) {
              dispatch(
                openModal({
                  status: true,
                  component: "ShowDetails",
                  data: { showID: show._key },
                })
              );
            } else {
              return <Navigate to={`/shows/${show._key}`} />;
            }
          } else {
            return null;
          }
        }}
      >
        <div
          className="flex hover:bg-gray-200 bg-white w-full flex-grow"
          onClick={() => setOpen(!open)}
        >
          {props.viewType === "venue" && (
            <div
              className={`w-2 flex-shrink-0 flex-grow-0 ${
                props.payoutStatus === "full" || props.payoutStatus === "hidden"
                  ? "bg-green-400"
                  : props.payoutStatus === "partial"
                  ? "bg-yellow-500"
                  : props.payoutStatus === "unpaid"
                  ? "bg-red-500"
                  : ""
              }`}
              // style={{
              //   backgroundColor: show.calTag
              //     ? DEFAULT_CALTAGS[show.calTag].color
              //     : "red",
              // }}
            ></div>
          )}
          <div className="flex flex-col lg:flex-row w-full">
          <div className="flex flex-grow">
          <div className="p-3 flex flex-col flex-shrink-0 justify-center flex-grow-0 w-14">
            {!props.hideDate ? (
              <>
                <p className="text-xs text-center">{(getDisplayTime(show, timezone)).startdate.fragments.abbrMonth}</p>
                <p className="text-s text-center">{(getDisplayTime(show, timezone)).startdate.fragments.day}</p>
                <p className="text-xs text-center">{(getDisplayTime(show, timezone)).startdate.fragments.hour}</p>
              </>
            ) : (
              <>
                <p className="text-s text-center">{(getDisplayTime(show, timezone)).startdate.fragments.hour}</p>
                <p className="text-xs text-center">to</p>
                <p className="text-s text-center">{(getDisplayTime(show, timezone)).enddate.fragments.hour}</p>
              </>
            )}
          </div>
          <div className="flex-grow p-2 flex flex-col justify-center">
            <h1 className="text-xl font-black">{show.name}</h1>
            {!show.lineup_locked && props.viewType === "venue" && (
              <p className="text-xs">
                Applications are <span className="text-green-400">open</span>
              </p>
            )}
            {show.performers.length ||
            (show as any).showrunner?.[0]?.uid ||
            venue ? (
              <div className="flex gap-1 mt-2 mb-2">
                {venue ? (
                  <UserIcon
                    key={"venue/" + venue.uid}
                    color="border-violet-400"
                    src={venue.avatar}
                  />
                ) : (
                  <></>
                )}
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
                {!show.lineup_locked &&
                  show.applications?.map((applicant, i) => {
                    if (i < limit) {
                      return (
                        <UserIcon
                          key={"applicant/" + applicant.uid + i}
                          src={artists?.data?.[applicant.uid]?.avatar}
                        />
                      );
                    }
                    if (i === limit) {
                      return (
                        <Badge
                          key={"applicant/" + applicant.uid + i}
                          onClick={() => setLimit(limit + (props.limit || 5))}
                          limitBadge
                        >
                          <p className="font-black text-xl flex flex-center items-center text-gray-400">
                            +{show.applications?.length - limit}
                          </p>
                        </Badge>
                      );
                    }
                    return null; // Return null for additional applicants beyond the limit
                  })}
              </div>
            ) : (
              <></>
            )}
          </div>
          </div>
          <div className="flex flex-grow w-full md:w-auto lg:flex-grow-0 items-center p-1 pt-0 md:p-2 ">
            {props.viewType === "venue" && props.manageView && (
              <Button
                className="w-full rounded-full p-2"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  dispatch(
                    openModal({
                      status: true,
                      component: "ManageShow",
                      data: { viewType: "venue", showID: show._key },
                    })
                  );
                }}
              >
                Manage
              </Button>
            )}
            {props.viewType === "artist" &&
              props.manageView &&
              props.type !== "applied" && (
                <Button
                  className="w-full rounded-full p-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    dispatch(
                      openModal({
                        status: true,
                        component: "ManageShow",
                        data: { viewType: "artist", showID: show._key },
                      })
                    );
                  }}
                >
                  Manage
                </Button>
              )}
            {props.manageView && (
              <i
                className={`material-symbols-outlined transition ${
                  open ? "-rotate-180" : ""
                }`}
              >
                expand_more
              </i>
            )}
            {props.viewType === "venue" && props.manageView && <></>}
            {props.viewType === "artist" && props.manageView && <></>}
            {showLabel()}
          </div>
        </div>
        </div>
      </div>
      {props.manageView && (
        <div
          className={`${
            !open ? "max-h-0 overflow-hidden" : "max-h-full p-1 pb-3"
          } transition-all`}
        >
          {props.viewType === "venue" && (
            <VenueManage showID={show._key} showLineupBuilder={true} />
          )}
          {props.viewType === "artist" && (
            <ArtistManage type={props.type} showID={show._key} />
          )}
        </div>
      )}
      </>
    )
  );
}
