import React from "react";
import CountLabel from "../../../Components/Labels/CountLabel";
import ArtistCard from "../../../Components/Cards/ArtistCard/ArtistCard";
import { useGetAllShowsQuery } from "../../../Redux/API/PublicAPI";
import { openModal, openSidebar } from "../../../Redux/UI/UISlice";
import { useAppDispatch } from "../../../hooks";
import { Show } from "../../../Helpers/shared/Models/Show";

interface ILineupRowProps {
  showID?: string;
  category?: keyof Show;
}

export default function LineupRow(props: ILineupRowProps) {
  const dispatch = useAppDispatch();
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const getHelperText = () => {
    switch (props.category) {
      case "performers":
        return "Artists will appear here when they are confirmed to play your show.";
      case "invites":
        return "Artists you invite to perform at your show will appear here.";
      case "applications":
        return "Artists who apply to play at your show will appear here.";
    }
  };
  const getLabelText = () => {
    switch (props.category) {
      case "performers":
        return "Confirmed Artists";
      case "invites":
        return "Pending";
      case "applications":
        return "Pending Applications";
    }
  };
  const helperText = getHelperText();
  const labelText = getLabelText();
  return (
    <>
      <div className="flex items-center relative mb-2">
        <CountLabel
          label={labelText}
          small
          count={show[props.category]?.length}
          className="pl-1 text-base text-gray-500"
        />

        {props.category === "invites" && (
          <button
            className="flex items-center absolute text-sm text-blue-500 right-2 text-s"
            onClick={() =>
              dispatch(
                openModal({
                  status: true,
                  component: "InviteArtists",
                  data: {
                    form: "inviteArtists",
                    venueID: show.venueID,
                    showID: show._key,
                  },
                })
              )
            }
          >
            <i className="material-symbols-outlined text-sm">add</i>Invite More
          </button>
        )}
        {props.category === "performers" && (
          <button
            className="flex items-center absolute text-sm text-blue-500 right-2 text-s"
            onClick={() =>
              dispatch(
                openSidebar({
                  status: true,
                  component: "AddConfirmedArtists",
                  data: { showID: show._key, venueID: show.venueID },
                })
              )
            }
          >
            <i className="material-symbols-outlined text-sm">add</i>Add More
          </button>
        )}
      </div>
      {show[props.category]?.length ? (
        <div className="flex mt-1 gap-2 pl-2 pr-2 overflow-auto">
          {show[props.category]?.map((performer: any, i: number) => {
            console.log(performer);
            let performerID = performer.uid || performer.id;
            return (
              <ArtistCard
                viewType="venue"
                key={"performers/" + props.showID + "/" + i + "/" + performerID}
                id={performerID}
                name={performer.name}
                showID={props.showID}
                applicantView={props.category === "applications"}
                invitedView={props.category === "invites"}
                confirmedView={props.category === "performers"}
              />
            );
          })}
        </div>
      ) : (
        <p className="p-2 text-center">{helperText}</p>
      )}
    </>
  );
}
