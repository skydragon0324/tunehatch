import React, { useCallback, useEffect, useState } from "react";
import metaPixel from "react-facebook-pixel";
// import dayjs from "dayjs";
import {
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import ErrorPage from "./404";
import { Link, useParams } from "react-router-dom";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
// import BannerImage from "../Components/Images/BannerImage";
import BackgroundAbstractor from "../Components/Images/BackgroundAbstractor";
import Img from "../Components/Images/Img";
import IconLabel from "../Components/Labels/IconLabel";
import {
  displayAgeLabel,
  displayTicketPrice,
  generateShowDescription,
  renderPageTitle,
} from "../Helpers/HelperFunctions";
import { getVenueLocationCode } from "../Helpers/shared/getVenueLocationCode";
// import LoadingSpinner from "../Components/LoadingSpinner";
import DisplayCard from "../Components/Cards/DisplayCard";
import Button from "../Components/Buttons/Button";
import StickyContainer from "../Components/Layout/StickyContainer";
import ArtistCard from "../Components/Cards/ArtistCard/ArtistCard";
import GoogleMapsEmbed from "../Components/Embeds/GoogleMapsEmbed";
import { openModal, openSidebar } from "../Redux/UI/UISlice";
import { useShowTimes } from "../Hooks/useShowTimes";
import { Show } from "../Helpers/shared/Models/Show";
import calculateEventTime from "../Helpers/shared/calculateEventTime";
import { useGetActiveRegionsQuery } from "../Redux/API/RegionAPI";

interface IShowDetailsProps {
  showID?: string;
  applicationDetails?: boolean;
  manageView?: boolean;
}

export default function ShowDetails(props: IShowDetailsProps) {
  var { showID } = useParams();
  showID = showID || props.showID;
  const shows = useGetAllShowsQuery();
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const show: Show = shows.data?.[showID];
  const showrunner =
    showrunners.data?.[show?.showrunner?.[0]?.uid || show?.showrunner?.[0]?.id];
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[show?.venueID];
  const ticketPrice = displayTicketPrice(show);
  const activeRegions = useGetActiveRegionsQuery();
  const regions = activeRegions.data;
  const [timezone, setTimezone] = useState("America/Chicago");
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

  const ReactPixel = metaPixel;
  const getDisplayTime = useCallback(
    (show: object, timezone: string) => {
      return calculateEventTime(show, timezone)
    },
    []
  );
  useEffect(() => {
    if (show) {
      renderPageTitle(show.name);
      if (show.metaPixel) {
        // const advancedMatching = {};
        // const options = {
        //   autoConfig: true,
        //   debug: true,
        // };
        console.log("meta pixel initialized");
        ReactPixel.init(show.metaPixel);
        ReactPixel.pageView();
      } else {
        console.log("meta pixel not initialized");
      }
    }
  }, [show]);

  return (
    <LoadingWrapper queryResponse={[shows, venues]}>
      {show ? (
        <div className="grid grid-cols-12 mb-20">
          <div className="h-auto flex-fix overflow-hidden col-span-12 md:col-span-12">
            <BackgroundAbstractor
              src={show.flyer}
              className="md:p-4 md:pb-10 grid grid-cols-12 md:gap-6"
            >
              <div className="col-span-12 md:col-span-6 max-h-144 flex-shrink flex justify-center md:justify-end">
                <Img
                  src={show?.flyer}
                  fallback={venue?.avatar}
                  className="h-full rounded max-h-128"
                />
              </div>
              <div className="col-span-12 flex flex-col justify-center md:col-span-6 h-full md:w-[90%]">
                <div className="bg-white md:rounded-lg md:border-2">
                  <h1 className="text-4xl font-black text-center p-3">
                    {show?.name}
                  </h1>
                  <div className="flex justify-center gap-4 items-center flex-wrap h-auto">
                    <IconLabel icon="schedule">{getDisplayTime(show, timezone).startdate.long} at {getDisplayTime(show, timezone).starttime}</IconLabel>
                    <IconLabel icon="local_activity">{ticketPrice}</IconLabel>
                    <IconLabel icon="universal_currency">
                      {displayAgeLabel(show)}
                    </IconLabel>
                    <IconLabel icon="location_on">{`${venue?.location?.city}, ${venue?.location?.state}`}</IconLabel>
                    <GoogleMapsEmbed
                      className="hidden md:block h-full w-full"
                      address={
                        venue?.location?.address +
                        " " +
                        venue?.location?.city +
                        " " +
                        venue?.location?.state +
                        " " +
                        venue?.location?.zip
                      }
                    />
                  </div>
                  <div className="p-4 md:p-0">
                    <Button
                      inline
                      className="w-full mt-2 md:mt-0 bg-orange text-white rounded-full"
                      action={
                        ticketPrice === "Free"
                          ? openModal({
                              status: true,
                              component: "TicketPurchase",
                              data: { showID: showID, free: true },
                            })
                          : openModal({
                              status: true,
                              component: "TicketPurchase",
                              data: { showID: showID },
                            })
                      }
                    >
                      {ticketPrice === "Free" ? "Show Info" : "Buy Tickets"}
                    </Button>
                  </div>
                </div>
              </div>
            </BackgroundAbstractor>
          </div>
          <div className="col-span-12">
            <div className="w-11/12 mx-auto">
              {show?.media && (
                <DisplayCard
                  topMargin="mt-3"
                  className="whitespace-pre-wrap flex-row overflow-scroll w-full"
                  contentPadding="p-4"
                  title={`Gallery`}
                >
                  <div className="flex gap-2 mt-2 mb-2">
                    {show.media.map((link, i) => {
                      return <Img className="h-72 w-72" src={link} />;
                    })}
                  </div>
                </DisplayCard>
              )}
              <DisplayCard
                topMargin="mt-3"
                className="whitespace-pre-wrap"
                contentPadding="p-4"
                title={`About ${show.name}`}
              >
                {generateShowDescription(show)}
              </DisplayCard>
              {show.performers.length > 0 && (
                <DisplayCard topMargin="mt-3" title={`Meet The Artists`}>
                  <div className="flex flex-nowrap pt-2 pb-2 overflow-auto gap-2 pl-2">
                    <div className="pl-2"></div>
                    {show.performers?.map((performer) => {
                      return (
                        <ArtistCard
                          key={`performers/${performer?.name}/${
                            performer?.uid || performer?.uid
                          }`}
                          id={(
                            performer?.uid ||
                            performer?.id ||
                            ""
                          ).toString()}
                          name={performer?.name}
                        />
                      );
                    })}
                    <div className="pr-4"></div>
                  </div>
                </DisplayCard>
              )}
              <div className="grid grid-cols-12 gap-4">
                <DisplayCard
                  topMargin="mt-3"
                  containerClassName={`col-span-12 ${
                    showrunner ? "md:col-span-6" : "md:col-span-12"
                  }`}
                  contentPadding="p-2"
                  title={`Peep The ${
                    show.venueLabel ? show.venueLabel : "Venue"
                  }`}
                >
                  <div className="flex-col w-full">
                    <div className="flex mb-3">
                      <div className="m-2 w-24 h-24 flex-shrink-0">
                        <Img
                          className="min-w-full w-24 min-h-full flex-grow flex-shrink-0 h-24 rounded-full"
                          src={venue?.avatar}
                        />
                      </div>
                      <div className="flex flex-col flex-grow-0 justify-center">
                        <h2 className="text-xl font-black">{venue?.name}</h2>
                        <IconLabel
                          className="text-sm text-gray-400"
                          iconClassName="text-sm"
                          icon="location_on"
                        >{`${venue?.location?.city}, ${venue?.location?.state}`}</IconLabel>
                        <p className="truncate-2">{venue?.description}</p>
                      </div>
                    </div>
                    <div className="m-2">
                      <Button
                        inline
                        className="text-white w-full bg-blue-500"
                        action={openSidebar({
                          status: true,
                          component: "ViewProfile",
                          data: { type: "venue", id: show.venueID },
                        })}
                      >
                        View Venue Profile{" "}
                      </Button>
                    </div>
                  </div>
                </DisplayCard>

                <DisplayCard
                  topMargin="mt-3"
                  containerClassName={`${
                    !showrunner ? "hidden" : "md:col-span-6 col-span-12"
                  }`}
                  contentPadding="p-2"
                  title={
                    show?.showrunner?.[0]?.type
                      ? "...and the " + show.showrunner[0].type
                      : "...and the showrunner"
                  }
                >
                  <div className="flex-col w-full">
                    <div className="flex mb-3">
                      <div className="m-2 w-24 h-24 flex-shrink-0">
                        <Img
                          className="min-w-full w-24 min-h-full h-24 rounded-full"
                          src={showrunner?.avatar}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h2 className="text-xl font-black">
                          {showrunner?.name}
                        </h2>
                        {/* <IconLabel
                        className="text-sm text-gray-400"
                        iconClassName="text-sm"
                        icon="location_on"
                      >{`${venue?.location?.city}, ${venue?.location?.state}`}</IconLabel> */}
                        <p className="truncate-2">{showrunner?.about}</p>
                      </div>
                    </div>
                    <div className="m-2">
                      <Button
                        inline
                        className="text-white w-full bg-blue-500"
                        action={openSidebar({
                          status: true,
                          component: "ViewProfile",
                          data: { type: "showrunner", id: showrunner?._key },
                        })}
                      >
                        View {showrunner?.type || "Showrunner"} Profile{" "}
                      </Button>
                    </div>
                  </div>
                </DisplayCard>
              </div>
              <DisplayCard
                className="text-center items-center"
                topMargin="mt-3"
                title={"Time & Location"}
              >
                <div className="flex flex-col text-center w-full">
                  <GoogleMapsEmbed
                    className="h-72"
                    address={
                      venue.location?.address +
                      " " +
                      venue.location?.city +
                      " " +
                      venue.location?.state +
                      " " +
                      venue.location?.zip
                    }
                  />
                  <div className="bg-amber-500">
                    <div className="text-white font-bold p-2">
                      <div className="flex flex-col gap-2 md:flex-row w-full items-center">
                        <IconLabel className="flex-col w-full" icon="today">
                          {" "}
                          {getDisplayTime(show, timezone).startdate.long} <br /> {getDisplayTime(show, timezone).starttime}{" "}
                        </IconLabel>
                        <IconLabel
                          className="w-full flex-col text-center"
                          iconClassName=" text-center"
                          icon="location_on"
                        >
                          {venue.location?.address}
                          <br />
                          {venue.location?.city +
                            " " +
                            venue.location?.state}{" "}
                          <br />
                          {venue.location?.zip}
                        </IconLabel>
                      </div>
                      <h2 className="text-2xl p-2 mt-2">Don't miss out.</h2>
                      <Button
                        inline
                        className="w-full bg-white text-black rounded-full"
                        action={
                          ticketPrice === "Free"
                            ? openModal({
                                status: true,
                                component: "TicketPurchase",
                                data: { showID: showID, free: true },
                              })
                            : openModal({
                                status: true,
                                component: "TicketPurchase",
                                data: { showID: showID },
                              })
                        }
                      >
                        {ticketPrice === "Free" ? "Show Info" : "Buy Tickets"}
                      </Button>
                    </div>
                  </div>
                </div>
              </DisplayCard>
            </div>
          </div>
          {!props.applicationDetails && !props.manageView && (
            <StickyContainer className="p-4 w-full col-span-12 md:hidden">
              <Button
                inline
                className=" w-full bg-orange text-white rounded-full"
                action={
                  ticketPrice === "Free"
                    ? openModal({
                        status: true,
                        component: "TicketPurchase",
                        data: { showID: showID, free: true },
                      })
                    : openModal({
                        status: true,
                        component: "TicketPurchase",
                        data: { showID: showID },
                      })
                }
              >
                {ticketPrice === "Free" ? "Show Info" : "Buy Tickets"}
              </Button>
            </StickyContainer>
          )}
        </div>
      ) : (
        <ErrorPage
          title="We're having trouble finding that show."
          description={
            <span>
              Please check to make sure you have the right link, or{" "}
              <Link to={"/shows"} className="text-blue-500">
                view all shows
              </Link>
            </span>
          }
        />
      )}
    </LoadingWrapper>
  );
}
