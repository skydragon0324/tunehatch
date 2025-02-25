import React, { useCallback, useEffect, useState } from "react";
import VenueGuestCard from "../../Components/Cards/VenueGuestCard";
import { useGetSoldTicketsQuery } from "../../Redux/API/VenueAPI";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { useGetAllShowsQuery } from "../../Redux/API/PublicAPI";
import LoadingWrapper from "../../Components/Layout/LoadingWrapper";

interface IVenueGuestListProps {
  tickets?: any[];
  showID?: string;
  venueID?: string;
  uid?: string;
}

export default function VenueGuestList(props: IVenueGuestListProps) {
  const [search, setSearch] = useState<string>();
  const [ticketsArray, setTicketsArray] = useState([]);
  const uid = useAppSelector((state) => state.user.data.uid);
  const { showID } = useParams();
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[showID];

  const soldTickets = useGetSoldTicketsQuery({
    showID: props.showID || showID,
    venueID: props.venueID || show?.venueID,
    SECRET_UID: props.uid || uid,
  });

  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    if (!props.tickets && uid && showID && soldTickets.data) {
      setTickets(soldTickets?.data?.soldTickets);
      setTicketsArray(Object.keys(soldTickets?.data?.soldTickets || {}));
    } else {
      setTickets(props.tickets);
      setTicketsArray(props.tickets ? Object.keys(props.tickets) : []);
    }
  }, [props.tickets, soldTickets.data, showID, uid]);

  useEffect(() => {}, [props.showID, showID]);

  const updateSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  }, []);

  return tickets ? (
    <LoadingWrapper queryResponse={[soldTickets]}>
      <div className="border border-gray-100 rounded-md p-2 m-2">
        <div className="sm-pad flex-col">
          <h2 className="font-black text-lg text-center items-center">
            Total Tickets Sold: {ticketsArray.length}
          </h2>
          <input
            className="border rounded-md border-gray-200 w-full p-2 text-center"
            placeholder="Search by name, email, or Ticket ID..."
            value={search}
            onChange={(e) => updateSearch(e)}
          />
          <p className="text-sm text-gray-300 text-center">
            To check someone in, click the checkmark next to their name. To view
            more ticket information, click on their name.
          </p>
        </div>
        <div className="flex flex-col">
          {Object.keys(tickets).map((ticket, i) => {
            let ticketBody = tickets?.[ticket];
            if (ticketBody) {
              const {
                name,
                id,
                redeemed,
                email,
                showID,
                venueID,
                purchased,
                tier,
              } = tickets?.[ticket];
              if (ticket) {
                let tMatch = true;
                if (search) {
                  tMatch =
                    name?.toLowerCase()?.includes(search) ||
                    email?.toLowerCase()?.includes(search) ||
                    id.toLowerCase()?.includes(search);
                }
                return tMatch ? (
                  <VenueGuestCard
                    redeemed={redeemed || false}
                    key={id}
                    showID={showID}
                    venueID={venueID}
                    name={name || email}
                    email={email}
                    ticketID={id}
                    purchaseDate={purchased}
                    ticketType={tier}
                    uid={uid}
                  />
                ) : (
                  <></>
                );
              } else {
                return <></>;
              }
            } else {
              return <></>;
            }
          })}
        </div>
      </div>
    </LoadingWrapper>
  ) : (
    <>
      <p className="text-center p-2">
        Once you begin selling tickets to your show, the guest list will
        populate here.
      </p>
    </>
  );
}
