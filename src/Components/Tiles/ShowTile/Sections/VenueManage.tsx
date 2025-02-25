import React, { useMemo } from "react";
import LabelButton from "../../../Buttons/LabelButton";
import LineupBuilder from "../../../../Tools/Venue/LineupBuilder";
import { openModal } from "../../../../Redux/UI/UISlice";
import { useAppDispatch } from "../../../../hooks";
import { useGetAllShowsQuery } from "../../../../Redux/API/PublicAPI";
export default function VenueManage(props: {
  showID: string;
  showLineupBuilder?: boolean;
}) {
  const dispatch = useAppDispatch();
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const past = useMemo(
    () => new Date(show?.endtime).getTime() < Date.now(),
    [show?.endtime]
  );

  return show._key ? (
    <>
      <div className="w-full gap-2 m-1 justify-around flex flex-wrap">
        <LabelButton
          onClick={() =>
            dispatch(
              openModal({
                status: true,
                component: "DeleteShow",
                data: { viewType: "venue", show: show },
              })
            )
          }
          className="border text-red-400 border-red-400"
          icon="close"
        >
          Delete
        </LabelButton>
        <LabelButton
          onClick={() =>
            dispatch(
              openModal({
                status: true,
                component: "ManageShow",
                data: { viewType: "venue", showID: show._key },
              })
            )
          }
          className="border text-blue-400 border-blue-400"
          icon="construction"
        >
          Manage
        </LabelButton>
        {!show?.published && (
          <LabelButton
            onClick={() =>
              dispatch(
                openModal({
                  status: true,
                  component: "PublishShow",
                  data: {
                    form: "publishShow",
                    showID: show._key,
                    venueID: show.venueID,
                    performers: show.performers,
                  },
                })
              )
            }
            className="border text-green-500 border-green-500"
            icon="check_circle_outline"
          >
            Publish
          </LabelButton>
        )}
      </div>
      {!past && props.showLineupBuilder && <LineupBuilder showID={show._key} />}
    </>
  ) : (
    <></>
  );
}
