import React from "react";
// import ShowEmblem from "../Images/ShowEmblem";
import dayjs from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import { displayAgeLabel } from "../../Helpers/HelperFunctions";
import Button from "../Buttons/Button";
import { openModal, openSidebar } from "../../Redux/UI/UISlice";
import Img from "../Images/Img";
import { useAppDispatch } from "../../hooks";

export default function FeaturedShowBanner(props: {
  showID: string;
  applyView?: boolean;
}) {
  const dispatch = useAppDispatch();
  const shows = useGetAllShowsQuery();
  const venues = useGetAllVenuesQuery();
  const show = shows.data?.[props.showID];
  const starttime = dayjs(show?.starttime);
  const venue = venues.data?.[show?.venueID];
  return (
    <div className="w-1/2 md:h-full h-72 flex flex-col justify-center gap-3">
      <h1 className={`text-3xl md:text-5xl md:leading-tight font-black ${props.applyView ? "text-white" : "hidden md:block text-gray-800"}`}>
        {props.applyView ? (
          <>Apply to play at {venue?.name}</>
        ) : (
          <>{show?.name}</>
        )}
      </h1>
      <Img
        src={venue?.avatar}
        title={venue?.name}
        className={`w-28 h-28 p-2 rounded-full ${props.applyView ? "" : "hidden md:block"}`}
        onClick={() =>
          dispatch(
            openSidebar({
              status: true,
              component: "ViewProfile",
              data: { profileID: venue?._key, type: "venue" },
            }),
          )
        }
      />
      <h4 className={`text-lg font-medium ${props.applyView ? "text-white" : "hidden md:block"} whitespace-pre-wrap`}>
        {props.applyView ? (
          ""
        ) : (
          <>
            {starttime?.format("MMMM D \n h:mmA")} |{" "}
            {show ? displayAgeLabel(show) : ""}
          </>
        )}
      </h4>
      <div className="flex gap-3 md:static absolute bottom-3">
        <Button
          action={
            props.applyView
              ? openSidebar({
                  status: true,
                  component: "Apply",
                  data: { showID: props.showID },
                })
              : openModal({
                  status: true,
                  component: "TicketPurchase",
                  data: { showID: props.showID },
                })
          }
        >
          {props.applyView ? "Apply" : "Tickets"}
        </Button>
        {!props.applyView && (
          <Button secondary link={`/shows/${props.showID}`}>
            Details
          </Button>
        )}
      </div>
    </div>
  );
}
