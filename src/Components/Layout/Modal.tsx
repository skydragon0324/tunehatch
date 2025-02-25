import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { openModal, resetModal } from "../../Redux/UI/UISlice";
import EditProfile from "../../Pages/Modals/EditProfile";
import CreateShow from "../../Pages/Modals/CreateShow";
import CreateVenue from "../../Pages/Modals/CreateVenue";
import TicketPurchase from "../../Pages/Modals/TicketPurchase";
import InviteArtistsForm from "../../Forms/InviteArtistsForm";
import ManageShow from "../../Tools/Industry/ManageShow/ManageShow";
import EditVenueProfile from "../../Pages/Modals/EditVenueProfile";
import CreateSRG from "../../Pages/Modals/CreateSRG";
import EditShowrunnerProfileForm from "../../Forms/EditProfile/EditShowrunnerProfileForm";
import DealVisualizer from "../Collections/DealVisualizer";
import ManageShowrunners from "../../Pages/ManageShowrunners";
import ManageVenues from "../../Pages/ManageVenues";
import VenueToolbox from "../../Pages/VenueToolbox";
import Welcome from "../../Pages/Modals/Welcome";
import ShowDetails from "../../Pages/ShowDetails";
import DeleteShow from "../../Tools/Venue/DeleteShow";
import PublishShowForm from "../../Forms/PublishShow";
import { Performer, Show } from "../../Helpers/shared/Models/Show";
import { Type } from "../../Helpers/shared/Models/Type";
import { FormKeys } from "../../Redux/User/UserSlice";
import ShowrunnerToolbox from "../../Pages/ShowrunnerToolbox";

interface Props {
  data: {
    keepOnClose?: boolean;
    venueID?: string;
    defaultDate?: Date | string;
    SRID?: string;
    show?: Show;
    showID?: string;
    free?: boolean;
    form?: FormKeys;
    viewType?: Type;
    performers?: Performer[];
  };
}

export default function Modal({ data }: Props) {
  const dispatch = useAppDispatch();
  const sidebarActive = useAppSelector((state) => state.ui.sidebar.active);
  const mostRecentlyOpened = useAppSelector(
    (state) => state.ui.mostRecentlyOpened
  );
  const component = useAppSelector((state) => state.ui.modal.component);

  return (
    <div
      className={`absolute flex items-center justify-center ${
        mostRecentlyOpened === "modal" ? "z-40" : "z-30"
      } top-0 left-0 w-full h-full pointer-events-none overflow-hidden`}
      style={{ animation: ".2s slide-down ease-in-out" }}
    >
      <div
        className={`${
          sidebarActive
            ? "absolute md:w-8/12 bg-white left-0 h-full top-0"
            : "w-full h-full absolute md:w-5/6 md:h-4/5 md:min-h-0 md:rounded-xl"
        } border z-40 overflow-visible bg-white`}
      >
        <div className="relative w-full h-full bg-white pointer-events-auto">
          <button
            className="right-2 top-2 fixed z-50"
            onClick={() =>
              dispatch(
                data.keepOnClose ? openModal({ status: false }) : resetModal()
              )
            }
          >
            <i className="material-symbols-outlined p-2 text-gray-400">close</i>
          </button>
          <div className="bg-white h-full overflow-auto">
            {component === "EditProfile" && <EditProfile />}
            {component === "EditVenueProfile" && (
              <EditVenueProfile venueID={data.venueID} />
            )}
            {component === "EditVenueToolbox" && (
              <VenueToolbox venueID={data.venueID} />
            )}
            {component === "EditShowrunnerToolbox" && (
              <ShowrunnerToolbox SRID={data.SRID} />
            )}
            {component === "CreateShow" && (
              <CreateShow
                venueID={data.venueID}
                showrunnerID={data.SRID}
                defaultDate={data.defaultDate}
              />
            )}
            {component === "CreateVenue" && <CreateVenue />}
            {component === "CreateSRG" && <CreateSRG />}
            {component === "EditShowrunnerProfileForm" && (
              <EditShowrunnerProfileForm id={data.SRID} />
            )}
            {component === "ManageShowrunners" && <ManageShowrunners />}
            {component === "ManageVenues" && <ManageVenues />}
            {component === "DeleteShow" && (
              <DeleteShow show={data.show} venueID={data.show.venueID} />
            )}
            {component === "TicketPurchase" && (
              <TicketPurchase showID={data.showID} free={data.free} />
            )}
            {component === "InviteArtists" && (
              <InviteArtistsForm
                form={data.form}
                showID={data.showID}
                venueID={data.venueID}
              />
            )}
            {/* TODO: ADD Artist Form */}
            {component === "ShowDetails" && (
              <ShowDetails showID={data.showID} />
            )}
            {component === "ManageShow" && (
              <ManageShow viewType={data.viewType} showID={data.showID} showrunnerID={data.SRID} />
            )}
            {component === "PublishShow" && (
              <PublishShowForm
                form={data.form}
                showID={data.showID}
                venueID={data.venueID}
                performers={data.performers}
              />
            )}
            {component === "DealVisualizer" && (
              <DealVisualizer showID={data.showID} />
            )}
            {component === "Welcome" && <Welcome />}
          </div>
        </div>
      </div>
    </div>
  );
}
