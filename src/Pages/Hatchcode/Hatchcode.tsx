import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showInProgress, upcomingShows } from "../../Helpers/HelperFunctions";
import ShowCard from "../../Components/Cards/ShowCard/ShowCard2";
import {
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import TicketPurchase from "../Modals/TicketPurchase";
import { Show } from "../../Helpers/shared/Models/Show";
// import DoorPurchase from "../Views/Ticketing/DoorPurchase";

export default function Hatchcode() {
  const { venueID, SRID } = useParams();
  const shows = useGetAllShowsQuery();

  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[venueID];

  const showrunners = useGetAllShowrunnerGroupsQuery();
  const showrunner = showrunners.data?.[SRID];

  const allShows = shows.data;
  const [filteredShows, setFilteredShows] = useState(null);
  const [currentShow, setCurrentShow] = useState(null);
  const [nextShow, setNextShow] = useState(null);

  useEffect(() => {
    if (allShows) {
      let ts = upcomingShows(
        allShows,
        venueID || SRID,
        venue != null ? "venue" : "showrunner"
      );
      console.log(ts);
      setFilteredShows(ts);
    }
  }, [allShows]);

  useEffect(() => {
    if (filteredShows?.length) {
      setNextShow(filteredShows?.[0]);
      setCurrentShow(showInProgress(filteredShows[0]));
    }
  }, [filteredShows]);
  console.log(nextShow);

  return (
    <>
      {filteredShows && (venue || showrunner) && (
        <>
          <h1 className="text-center text-2xl font-black">
            Welcome to {venue?.name || showrunner?.name}
          </h1>
          {nextShow ? (
            currentShow ? (
              <>
                <div className="flex flex-col items-center">
                  <h1 className="text-center">{nextShow.name}</h1>
                  <span className="bg-green-400 p-2 text-xs rounded-full text-white">
                    IN PROGRESS
                  </span>
                  <>
                    {(nextShow.ticket_cost ||
                      nextShow.doorPrice ||
                      nextShow.ticket_tiers) && (
                      <div className="flex-col">
                        <h1>Door Purchase</h1>
                        {/* todo: door purchase */}
                        <TicketPurchase
                          doorPurchase
                          showID={nextShow._key}
                          defaultQuantity={1}
                        />
                        {/* <DoorPurchase showID={nextShow._key} doorPrice={(nextShow.doorPrice && nextShow.doorPrice !== "" && nextShow.doorPrice !== "0") ? nextShow.doorPrice : nextShow.ticket_cost} /> */}
                      </div>
                    )}
                    {!nextShow.ticket_cost && !nextShow.doorPrice && (
                      <>
                        <div className="sm-pad flex-col">
                          <p className="centered">Welcome to the show!</p>
                          <p className="centered sm-top bold">
                            This is a free show: that means you're good to head
                            on in!
                          </p>
                        </div>
                      </>
                    )}
                  </>
                </div>
              </>
            ) : (
              <>
                <div className="showGallery">
                  <h2 className="centered">Coming up at {venue.name}</h2>
                  {filteredShows.map((show: Show) => {
                    return <ShowCard show={show} />;
                  })}
                </div>
              </>
            )
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
