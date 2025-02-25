import React from "react";
// import LoadingSpinner from "../../../Components/LoadingSpinner";
import Img from "../../../Components/Images/Img";
import HatchyLoading from "../../../Images/Loading.gif";
import WAYGTS from "../../../Components/WAYGTS";
import { useAppSelector } from "../../../hooks";
import TicketTile from "../../../Components/Tiles/TicketTile";

export default function TicketGeneration() {
  const currentTickets = useAppSelector(
    (state) => state.user.tickets.generated
  );
  return (
    <>
      {!currentTickets?.length ? (
        <>
          <h3 className="text-center text-xl font-black">
            Purchase successful! Generating your tickets now...
          </h3>
          <div className="w-full flex justify-center p-10">
            <Img src={HatchyLoading} className="md:w-1/4" />
          </div>
          <h2 className="text-center">
            While you're waiting, help support your favorite artists by tapping
            who you came to see.
          </h2>
        </>
      ) : (
        <>
          <h1 className="text-center text-3xl font-black">
            You're good to go!
          </h1>
          <p className="text-center">
            Your tickets have been sent to {currentTickets?.[0]?.email}!
          </p>
        </>
      )}
      <WAYGTS showID={currentTickets?.[0]?.showID} />
      {currentTickets?.map(
        (ticket: { showID: string; venueID: string; id: string }) => {
          return (
            <TicketTile
              showID={ticket?.showID}
              venueID={ticket?.venueID}
              ticketIDs={[ticket?.id]}
            />
          );
        }
      )}
    </>
  );
}
