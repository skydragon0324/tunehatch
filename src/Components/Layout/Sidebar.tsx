import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { resetSidebar } from "../../Redux/UI/UISlice";
import ProfileWrapper from "../../Pages/Profile/ProfileWrapper";
import ApplyForm from "../../Forms/ApplyForm";
import RespondToShow from "../../Pages/Sidebars/RespondToShow";
import TicketTile from "../Tiles/TicketTile";
import AddConfirmedArtists from "../../Pages/Sidebars/AddConfirmedArtists";
import { Type } from "../../Helpers/shared/Models/Type";
import { ShowFormType, ShowIntent } from "../../Redux/User/UserSlice";
import MessageCenter from "../../Pages/MessageCenter";

interface Props {
  data: {
    profileID?: string;
    id?: string;
    showID?: string;
    type?: ShowFormType;
    viewType?: Type;
    intent?: ShowIntent;
    artistID?: string;
    artistName?: string;
    venueID?: string;
    ticketIDs?: string[];
    tickets?: { image?: string }[];
    recipientID?: string;
    recipientType?: Type;
  };
}

export default function Sidebar({ data }: Props) {
  const active = useAppSelector((state) => state.ui.sidebar.active);
  const component = useAppSelector((state) => state.ui.sidebar.component);
  const mostRecentlyOpened = useAppSelector(
    (state) => state.ui.mostRecentlyOpened
  );
  const dispatch = useAppDispatch();

  return (
    <div
      className={`${
        mostRecentlyOpened === "sidebar" ? "z-40" : "z-30"
      } absolute max-h-viewport h-full min-h-viewport overflow-auto ${
        active ? "" : "translate-x-full"
      } right-0 w-full md:w-7/12 lg:w-5/12 xl:w-4/12 bg-gray-50 transition-all duration-250 md:border-l md:shadow-md md:border-gray-300`}
    >
      <button
        className="fixed z-50 right-2 top-2 text-slate-700"
        onClick={() => dispatch(resetSidebar())}
      >
        <i className="material-symbols-outlined p-2 text-slate-700 relative z-50">
          close
        </i>
      </button>
      <div className="relative z-40 bg-white min-h-full">
        {component === "ViewProfile" && (
          <ProfileWrapper
            profileID={data.profileID || data.id}
            type={data.type}
          />
        )}
        {component === "Apply" && <ApplyForm showID={data.showID} />}
        {component === "RespondToShow" && (
          <RespondToShow
            viewType={data.viewType}
            type={data.type}
            intent={data.intent}
            artistID={data.artistID}
            artistName={data.artistName}
            showID={data.showID}
          />
        )}
        {component === "Ticket Tile" && (
          <TicketTile
            showID={data.showID}
            venueID={data.venueID}
            ticketIDs={data.ticketIDs}
            tickets={data.tickets}
          />
        )}
        {component === "Message Center" && (
          <MessageCenter
            recipientID={data.recipientID}
            recipientType={data.recipientType}
          />
        )}
        {component === "AddConfirmedArtists" && (
          <AddConfirmedArtists showID={data.showID} venueID={data.venueID} />
        )}
      </div>
    </div>
  );
}
