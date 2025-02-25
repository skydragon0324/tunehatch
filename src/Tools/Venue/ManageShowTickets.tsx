import React, { useRef, useEffect, useState } from "react";
import { Parser } from "json2csv";
import VenueGuestList from "./VenueGuestList";
import { Link } from "react-router-dom";
import LabelButton from "../../Components/Buttons/LabelButton";
import { useGetSoldTicketsQuery } from "../../Redux/API/VenueAPI";
import { useAppSelector } from "../../hooks";

interface IManageShowTicketsProps {
  showID?: string;
  showKey?: string;
  venueID?: string;
}

export default function ManageShowTickets(props: IManageShowTicketsProps) {
  const { showID, showKey, venueID } = props;
  const SECRET_UID = useAppSelector((state) => state.user.data.uid);
  const fileDownload = useRef<HTMLAnchorElement | null>(null);
  const soldTickets = useGetSoldTicketsQuery({
    showID: showID,
    venueID: venueID,
    SECRET_UID,
  });
  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    setTickets(soldTickets?.data?.soldTickets);
  }, [soldTickets.data]);

  const guestlistCSV = () => {
    const fields = [
      {
        label: "Email",
        value: "email",
      },
      {
        label: "Name",
        value: "name",
      },
      {
        label: "Ticket Type",
        value: "tier",
      },
      {
        label: "Ticket ID",
        value: "id",
      },
    ];
    try {
      const parser = new Parser({ fields });
      const ticketsArray = Object.values(tickets);
      const csv = parser.parse(ticketsArray);
      const file = new Blob([csv], { type: "text/csv" });
      fileDownload.current.href = URL.createObjectURL(file);
      fileDownload.current.download = "guestlist.csv";
      fileDownload.current.click();
    } catch (err) {
      console.log(err);
    }
  };

  //TODO: Use our LoadingWrapper component for slow connections?
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row">
        <h2 className="font-black text-2xl">Guest List</h2>
        <Link
          to={"/e/guestlist/" + showKey}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="material-symbols-outlined pl-2 text-amber-500 text-md fullscreenButton">
            open_in_new
          </i>
        </Link>
      </div>
      <LabelButton
        className="border text-orange border-orange"
        onClick={() => guestlistCSV()}
      >
        Download Guest List
      </LabelButton>

      <VenueGuestList
        showID={showID}
        venueID={venueID}
        tickets={tickets}
        uid={SECRET_UID}
      />
      <div className="flex right-0">
        <a className="hidden" ref={fileDownload} href="null">
          Hidden Downloader
        </a>
      </div>
    </div>
  );
}
