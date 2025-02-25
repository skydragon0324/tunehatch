import React from "react";
import LabelButton from "../../../Buttons/LabelButton";
// import LineupBuilder from "../../../../Tools/Venue/LineupBuilder";
import { openModal, openSidebar } from "../../../../Redux/UI/UISlice";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { useGetAllShowsQuery } from "../../../../Redux/API/PublicAPI";
export default function ArtistManage(props: { showID: string; type?: string }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  // const [past, setPast] = useState(
  //   new Date(show?.endtime).getTime() < Date.now(),
  // );

  return show._key ? (
    <>
      <div className="w-full gap-2 m-1 justify-around flex flex-wrap">
        {props.type === "confirmed" && (
          <>
            <LabelButton
              onClick={() =>
                dispatch(
                  openSidebar({
                    status: true,
                    component: "RespondToShow",
                    data: {
                      viewType: "artist",
                      artistID: user.displayUID,
                      showID: props.showID,
                      intent: "cancel",
                      type: "performer",
                    },
                  })
                )
              }
              className="border text-red-400 border-red-400"
              icon="close"
            >
              Cancel Booking
            </LabelButton>
            {/* <LabelButton onClick={() => dispatch(openModal({ status: true, component: "DealVisualizer", data: { showID: show._key} }))} className="border text-green-400 border-green-400" icon="payments">Payouts</LabelButton> */}
            <LabelButton
              onClick={() =>
                dispatch(
                  openModal({
                    status: true,
                    component: "ManageShow",
                    data: {
                      viewType: "artist",
                      showID: show._key,
                      cohosted: show.cohosted,
                      show: show,
                      uid: user.uid,
                    },
                  })
                )
              }
              className="border text-blue-400 border-blue-400"
              icon="construction"
            >
              Manage
            </LabelButton>
          </>
        )}
        {props.type === "applied" && (
          <>
            <LabelButton
              onClick={() =>
                dispatch(
                  openSidebar({
                    status: true,
                    component: "RespondToShow",
                    data: {
                      viewType: "artist",
                      artistID: user.displayUID,
                      showID: props.showID,
                      intent: "cancel",
                      type: "invited",
                    },
                  })
                )
              }
              className="border text-red-400 border-red-400"
              icon="close"
            >
              Cancel Application
            </LabelButton>
          </>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
