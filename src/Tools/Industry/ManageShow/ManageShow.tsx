import React from "react";
import { useGetAllShowsQuery } from "../../../Redux/API/PublicAPI";
import LoadingWrapper from "../../../Components/Layout/LoadingWrapper";
import ManageShowGeneral from "./General/ManageShowGeneral";
import CategoryTabs from "../../../Components/Layout/CategoryTabs";
import { useAppSelector } from "../../../hooks";
import ManageShowTickets from "../../Venue/ManageShowTickets";
import PayoutCalculator from "../../Venue/PayoutCalculator/PayoutCalculator";
import LineupBuilder from "../../Venue/LineupBuilder";
import CreateShowForm from "../../../Forms/CreateShow/CreateShowForm";
import DeleteShow from "../../Venue/DeleteShow";
import PublishShowForm from "../../../Forms/PublishShow";
import { displayTicketPrice } from "../../../Helpers/HelperFunctions";
import { Type } from "../../../Helpers/shared/Models/Type";
// import { Show } from "../../../Helpers/shared/Models/Show";

export default function ManageShow(props: {
  showID: string;
  showrunnerID?: string;
  viewType: Type;
  cohosted?: boolean;
  // show?: Show;
}) {
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const currentCategory = useAppSelector(
    (state) => state.ui.views.manageShow.category
  );

  return (
    <LoadingWrapper className="flex flex-row" queryResponse={[shows]}>
      <CategoryTabs
        view="manageShow"
        defaultCategory="general"
        tabs={[
          {
            label: "General",
            category: "general",
          },
          {
            label:
              props.viewType === "venue" && displayTicketPrice(show) !== "Free"
                ? "Guest List"
                : null,
            category: "guestlist",
          },
          {
            label:
              props.viewType === "venue" && show.published ? "Payouts" : null,
            category: "payouts",
          },
          {
            label: props.viewType === "venue" ? "Lineup" : null,
            category: "lineup",
          },
          {
            label: props.viewType === "venue" ? "Edit Show" : null,
            category: "editShow",
          },
          {
            label: props.viewType === "venue" ? "Delete Show" : null,
            category: "deleteShow",
          },
          {
            label:
              props.viewType === "venue" && !show.published
                ? "Publish Show"
                : null,
            category: "publishShow",
          },
        ]}
      />
      <div className="flex flex-col w-full md:w-full">
        {currentCategory === "general" && (
          <ManageShowGeneral showID={props.showID} viewType={props.viewType} />
        )}
        {currentCategory === "guestlist" && (
          <ManageShowTickets
            showID={props.showID}
            venueID={show.venueID}
            showKey={props.showID}
          />
        )}
        {currentCategory === "payouts" && (
          <PayoutCalculator viewType={props.viewType} showID={props.showID} />
        )}
        {currentCategory === "lineup" && (
          <LineupBuilder showID={props.showID} />
        )}
        {currentCategory === "editShow" && (
          <CreateShowForm
            venueID={show.venueID}
            showrunnerID={props.showrunnerID}
            show={show}
          />
        )}
        {currentCategory === "deleteShow" && (
          <DeleteShow venueID={show.venueID} show={show} />
        )}
        {currentCategory === "publishShow" && (
          <PublishShowForm
            venueID={show.venueID}
            showID={show._key}
            performers={show.performers}
          />
        )}
      </div>
    </LoadingWrapper>
  );
}
