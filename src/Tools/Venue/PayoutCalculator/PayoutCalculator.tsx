import React, { useEffect, useState } from "react";
import {
  useGetAllArtistsQuery,
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import LoadingWrapper from "../../../Components/Layout/LoadingWrapper";
import { useAppSelector } from "../../../hooks";
import {
  useCalculatePayoutsQuery,
  useGetSoldTicketsQuery,
} from "../../../Redux/API/VenueAPI";
import PayoutManager from "./PayoutManager";
// import { useArtistCalculatePayoutsQuery } from "../../../Redux/API/ArtistAPI";
import DealVisualizer from "../../../Components/Collections/DealVisualizer";
import { Type } from "../../../Helpers/shared/Models/Type";

export default function PayoutCalculator(props: {
  showID: string;
  viewType: Type;
  venue?: string;
}) {
  const user = useAppSelector((state) => state.user.data);
  const artists = useGetAllArtistsQuery();
  const venues = useGetAllVenuesQuery();
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const payouts = useCalculatePayoutsQuery(
    { SECRET_UID: user.uid, venueID: show.venueID, showID: show._key },
    { skip: !show || props.viewType !== "venue" }
  );
  // const artistPayouts = useArtistCalculatePayoutsQuery(
  //   { SECRET_UID: user.uid, showID: show._key },
  //   { skip: !show || props.viewType === "venue" }
  // );
  const soldTickets = useGetSoldTicketsQuery(
    { SECRET_UID: user.uid, showID: show?._key, venueID: show?.venueID },
    { skip: !show }
  );
  // const defaultPayout =
  //   payouts.data?.payouts?.[
  //     props.viewType === "venue" ? show.venueID : user.displayUID
  //   ]?.total ||
  //   artistPayouts.data?.payouts?.[
  //     props.viewType === "venue" ? show.venueID : user.displayUID
  //   ]?.total;
  // const lineItems =
  //   payouts.data?.payouts?.[props.venue ? show.venueID : user.displayUID]
  //     ?.lineItems ||
  //   artistPayouts.data?.payouts?.[props.venue ? show.venueID : user.displayUID]
  //     ?.lineItems;
  const deal = show?.deal;
  const tickets: { price?: number }[] = [];
  // const [payout, setPayout] = useState(defaultPayout);
  const [dollarTicketSales, setTicketSales] = useState(0);
  const calculatePayout = () => {
    let ticketSales = 0;
    tickets?.forEach((ticket) => {
      if (ticket) {
        ticketSales = ticketSales + Number(ticket.price);
      }
    });
    setTicketSales(ticketSales);
  };

  useEffect(() => {
    if (show) {
      if (props.venue) {
        // dispatch(loadFullDeal({ dealID: show.dealID, uid, venueID: show.venueID }))
      } else {
        // dispatch(loadPartialDeal({ dealID: show.dealID, uid }))
      }
    }
    if (show && !show.cashLedger) {
    }
  }, [show]);

  useEffect(() => {
    if (tickets) {
      calculatePayout();
    }
  }, [tickets, deal]);
  console.log(tickets);
  return (
    <LoadingWrapper
      queryResponse={[
        artists,
        venues,
        showrunners,
        shows,
        soldTickets,
        payouts,
      ]}
    >
      <div className="p-2 md:w-1/2 md:mx-auto">
        <DealVisualizer showID={props.showID} />
      </div>
      <div className="w-full text-center flex flex-col items-center">
        {
          <>
            <h1 className="text-2xl font-black text-center">Manage Payouts</h1>
            {new Date(show.starttime).getTime() < 1693353600000 ? (
              <h1>
                You cannot pay out shows before August 30th, 2023. To pay out
                this show, please contact the TuneHatch team.
              </h1>
            ) : (
              <PayoutManager viewType={props.viewType} showID={props.showID} />
            )}
          </>
        }
      </div>
    </LoadingWrapper>
  );
}
