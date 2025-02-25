import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRedeemTicketMutation } from "../../Redux/API/VenueAPI";

interface IVenueGuestCard {
  redeemed?: boolean;
  showID?: string;
  ticketID?: string;
  ticketType?: string | React.ReactNode;
  venueID?: string;
  uid?: string;
  name?: string;
  email?: string;
  purchaseDate?: string | Date;
}

export default function VenueGuestCard(props: IVenueGuestCard) {
  const {
    showID,
    ticketID,
    ticketType,
    venueID,
    uid,
    name,
    email,
    purchaseDate,
  } = props;
  const [expanded, expand] = useState(false);
  const [redeemed, redeem] = useState(props.redeemed || false);
  const [purchasedDate, setPurchasedDate] = useState("");
  useEffect(() => {
    if (purchaseDate) {
      const humanTimestamp = dayjs(purchaseDate);
      const month = humanTimestamp.format("MMMM");
      const date = humanTimestamp.format("D");
      const hour = humanTimestamp.format("hA");
      setPurchasedDate(month + " " + date + " | " + hour);
    }
  }, [purchaseDate]);

  const [redeemTicket] = useRedeemTicketMutation();

  const setTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    redeem(!redeemed);
    redeemTicket({ showID, venueID, ticketID, redeemed, uid });
  };

  return (
    <>
      <div
        className="w-full border border-gray-100 rounded-md p-2"
        onClick={() => expand(!expanded)}
      >
        <div className="w-full flex flex-row justify-start">
          <div
            className="basis-1"
            onClick={(e) => {
              setTicket(e);
            }}
          >
            <span
              className={`material-symbols-outlined ${
                redeemed ? "text-amber-500" : "text-black"
              } text-md pr-2`}
            >
              {redeemed ? "check_circle" : "check_circle_outline"}
            </span>
          </div>
          <div className="basis-1/2">
            <h1
              className={`font-black text-3xl text-left ml-2 ${
                redeemed ? "line-through decoration-3" : ""
              }`}
            >
              {name || email}
            </h1>
            <p className="text-xs  text-gray-400 text-left pl-4 pb-4">
              {ticketType}
            </p>
          </div>
          <div className="ml-auto">
            <i className="material-symbols-outlined text-gray-400 text-md">
              expand_more
            </i>
          </div>
        </div>
        {expanded && (
          <div className="flex flex-col p-2 leading-5">
            <p>
              Email: <b>{email}</b>
            </p>
            <p>
              Ticket ID: <b>{ticketID}</b>
            </p>
            {/* TODO: ADD Timezone */}
            <p>
              Purchased: <b>{purchaseDate && purchasedDate}</b>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
