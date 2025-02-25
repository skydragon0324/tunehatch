import React, { useEffect, useState } from "react";
import {
  useGetAllArtistsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import {
  useCancelBookingMutation,
  useRespondToPerformanceMutation,
} from "../../Redux/API/IndustryAPI";
import { useRespondToArtistPerformanceMutation } from "../../Redux/API/ArtistAPI";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Type } from "../../Helpers/shared/Models/Type";
import {
  asyncDataSubmit,
  getArtistName,
  getShowDate,
} from "../../Helpers/HelperFunctions";
import { resetSidebar } from "../../Redux/UI/UISlice";
import Form from "../../Components/Inputs/Form";
import DealVisualizer from "../../Components/Collections/DealVisualizer";
import ShowDetails from "../ShowDetails";
import { ShowFormType, ShowIntent } from "../../Redux/User/UserSlice";

export default function RespondToShow(props: {
  type?: ShowFormType;
  viewType: Type;
  artistID: string;
  artistName?: string;
  showID: string;
  intent: ShowIntent;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const artists = useGetAllArtistsQuery();
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[show?.venueID];
  const artist = artists.data?.[props.artistID];
  const [pendingState, setPendingState] = useState<boolean | string>(false);
  const [expanded, expand] = useState(false);
  const [showDate] = useState(
    show &&
      getShowDate(show?.starttime || show?.starttime, {
        abbreviateMonth: true,
      })
  );
  const [respondToPerformance] = useRespondToArtistPerformanceMutation();
  const [venueRespondToPerformance] = useRespondToPerformanceMutation();
  const [cancelBooking] = useCancelBookingMutation();

  const artistCancelConfirmationText =
    props.intent === "cancel" && props.type === "performer"
      ? "Are you sure you want to cancel this performance?"
      : "Are you sure you want to cancel this application?";

  const artistCancelButtonText =
    props.intent === "cancel" && props.type === "performer"
      ? "Yes, Cancel My Performance"
      : "Yes, Cancel My Application";

  const [performanceAgreementForm, setPerformanceAgreementForm] = useState([]);

  useEffect(() => {
    const performanceAgreement = venue?.performanceAgreement?.agreement || [];

    const performanceAgreementForm: {
      fieldType: string;
      placeholder: string;
      required: boolean;
      containerClassName: string;
      className: string;
      field: string;
    }[] = [];
    performanceAgreement.forEach((agreementItem: string, i: number) => {
      performanceAgreementForm.push({
        fieldType: "toggleSlider",
        placeholder: `${agreementItem}`,
        required: true,
        containerClassName: "flex flex-col w-full mb-2 items-center",
        className: "",
        field: `performanceAgreement.${i}`,
      });
    });
    setPerformanceAgreementForm(performanceAgreementForm);
  }, [venue]);

  return (
    <div className="items-center mt-10">
      {/* Venue Options */}
      {props.viewType === "venue" && (
        <>
          {props.intent === "reject" && (
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-black text-center pt-2">
                Confirm Rejection
              </h1>
              <p className="text-center p-2">Reject this application?</p>
              <button
                className="border text-red-400 border-red-400 p-1 pl-2 pr-2 flex items-center rounded-full"
                onClick={() =>
                  asyncDataSubmit(
                    user.uid,
                    user.displayUID,
                    {
                      SECRET_UID: user.uid,
                      artistID: props.artistID,
                      showID: props.showID,
                      venueID: show.venueID,
                      status: "rejected",
                    },
                    (state) => setPendingState(state),
                    null,
                    venueRespondToPerformance,
                    "Applicant rejected",
                    dispatch,
                    false,
                    () => dispatch(resetSidebar()),
                    show.venueID,
                    show._key,
                    false,
                    false,
                    null
                  )
                }
              >
                Reject
              </button>
            </div>
          )}
          {props.intent === "cancel" && (
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-black text-center pt-2">
                Confirm Cancellation
              </h1>
              <p className="text-center p-2">
                Are you sure you would like to cancel this booking?
              </p>
              <button
                className="border text-red-400 border-red-400 p-1 pl-2 pr-2 flex items-center rounded-full"
                onClick={() =>
                  asyncDataSubmit(
                    user.uid,
                    user.displayUID,
                    {
                      SECRET_UID: user.uid,
                      displayUID: user.displayUID,
                      artistID: props.artistID,
                      showID: props.showID,
                      venueID: show.venueID,
                      artistName: artist
                        ? getArtistName(artist)
                        : props.artistName,
                    },
                    setPendingState,
                    null,
                    cancelBooking,
                    "Booking cancelled",
                    dispatch,
                    false,
                    () => dispatch(resetSidebar()),
                    show.venueID,
                    show._key,
                    false,
                    false,
                    null
                  )
                }
              >
                Cancel Booking
              </button>
            </div>
          )}
          {props.intent === "accept" && (
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-black text-center pt-2">
                Confirm Accept
              </h1>
              <p className="text-center p-2">Accept this artist?</p>
              <button
                className="border text-green-400 border-green-400 p-1 pl-2 pr-2 flex items-center rounded-full"
                onClick={() =>
                  asyncDataSubmit(
                    user.uid,
                    user.displayUID,
                    {
                      SECRET_UID: user.uid,
                      artistID: props.artistID,
                      artistName: getArtistName(artist),
                      contactNumber: artist.contactNumber || null,
                      showID: props.showID,
                      showDate: showDate,
                      venueID: show.venueID,
                      venuePhone: venue.phone || venue.contact.phone,
                      status: "accepted",
                      hasTextContactEnabled:
                        venue.hasTextContactEnabled || false,
                    },
                    setPendingState,
                    null,
                    venueRespondToPerformance,
                    "Applicant accepted",
                    dispatch,
                    false,
                    () => dispatch(resetSidebar()),
                    show.venueID,
                    show._key,
                    false,
                    false,
                    null
                  )
                }
              >
                Accept
              </button>
            </div>
          )}
        </>
      )}
      {/* Artist Options */}
      {props.viewType === "artist" && (
        <>
          {props.intent === "reject" && (
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-black text-center pt-2">
                Confirm Rejection
              </h1>
              <p className="text-center p-2">Reject this invitation?</p>
              <button
                onClick={() =>
                  asyncDataSubmit(
                    user.uid,
                    user.displayUID,
                    {
                      SECRET_UID: user.uid,
                      artistID: props.artistID,
                      showID: props.showID,
                      venueID: show.venueID,
                      status: "rejected",
                    },
                    setPendingState,
                    null,
                    respondToPerformance,
                    "Applicant rejected",
                    dispatch,
                    false,
                    () => dispatch(resetSidebar()),
                    show.venueID,
                    show._key,
                    false,
                    false,
                    null
                  )
                }
              >
                Reject
              </button>
            </div>
          )}
          {props.intent === "cancel" && (
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-black text-center pt-2">
                Confirm Cancellation
              </h1>
              <p className="text-center p-2">
                {artistCancelConfirmationText}
                <br></br>You will have to reapply if you change your mind.
              </p>{" "}
              {/*Cancel your performance? */}
              <button
                className="border text-red-400 border-red-400 p-1 pl-2 pr-2 flex items-center rounded-full"
                onClick={() =>
                  asyncDataSubmit(
                    user.uid,
                    user.displayUID,
                    {
                      SECRET_UID: user.uid,
                      displayUID: user.displayUID,
                      artistID: props.artistID,
                      showID: props.showID,
                      venueID: show.venueID,
                      artistName: getArtistName(artist),
                    },
                    setPendingState,
                    null,
                    cancelBooking,
                    "Booking cancelled",
                    dispatch,
                    false,
                    () => dispatch(resetSidebar()),
                    show.venueID,
                    show._key,
                    false,
                    false,
                    null
                  )
                }
              >
                {artistCancelButtonText}
              </button>
            </div>
          )}
          {props.intent === "accept" && (
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-black text-center pt-2">
                Confirm Accept
              </h1>
              <p className="text-center p-2">Accept this artist?</p>
              <button
                className="border text-green-400 border-green-400 p-1 pl-2 pr-2 flex items-center rounded-full"
                onClick={() =>
                  asyncDataSubmit(
                    user.uid,
                    user.displayUID,
                    {
                      SECRET_UID: user.uid,
                      artistID: props.artistID,
                      showID: props.showID,
                      venueID: show.venueID,
                      status: "accepted",
                    },
                    setPendingState,
                    null,
                    respondToPerformance,
                    "Applicant accepted",
                    dispatch,
                    false,
                    () => dispatch(resetSidebar()),
                    show.venueID,
                    show._key,
                    false,
                    false,
                    null
                  )
                }
              >
                Accept
              </button>
            </div>
          )}
          {props.intent === "info" && (
            <div className="flex flex-col relative">
              <h1 className="text-2xl font-black text-center pt-2">
                View Show
              </h1>
              <DealVisualizer showID={props.showID} />
              <div
                className="flex flex-col w-full p-2 items-center"
                onClick={() => expand(!expanded)}
              >
                <div className="text-center flex flex-row">
                  <h2 className="font-black text-xl text-center">
                    Show Details
                  </h2>
                  <i
                    className={`material-symbols-outlined ${
                      expanded ? "-rotate-180" : ""
                    } text-gray-400 text-md pl-2`}
                  >
                    expand_more
                  </i>
                </div>
                {expanded && (
                  <ShowDetails
                    showID={props.showID}
                    applicationDetails={true}
                  />
                )}
              </div>
              <Form
                name="performanceAgreement"
                className="p-4 text-center"
                doneLabel="Accept Invite"
                completedLabel="Accepted!"
                locked={!performanceAgreementForm.length}
                successStatusMessage="Invitation accepted! See you at the show!"
                submitFn={() =>
                  respondToPerformance({
                    SECRET_UID: user.uid,
                    artistID: props.artistID,
                    showID: props.showID,
                    venueID: show.venueID,
                    status: "accepted",
                  })
                } //() => asyncDataSubmit(user.uid, user.displayUID, { SECRET_UID: user.uid, artistID: props.artistID, showID: props.showID, venueID: show.venueID, status: "accepted" }, setPendingState, null, respondToPerformance, "Invitation accepted! See you at the show!", dispatch, false, dispatch(resetSidebar()), show.venueID, false, false, null)}
                clearOnComplete={false}
                onComplete={() => dispatch(resetSidebar())}
                formMap={[
                  [
                    {
                      fieldType: "title",
                      defaultValue: "Review & Confirm",
                      className: "text-2xl font-black flex-col mb-3",
                    },
                    {
                      fieldType: "title",
                      defaultValue:
                        "In order to accept this invitation please read and agree to the following:",
                      className:
                        "text-sm text-gray-500 font-black flex-col mb-3",
                    },
                    ...performanceAgreementForm,
                  ],
                ]}
              />
              <button
                className="justify-center border text-white bg-red-400 border-red-400 w-36 p-4 mb-2 flex rounded-full font-black absolute -bottom-10 right-7"
                onClick={() =>
                  asyncDataSubmit(
                    user.uid,
                    user.displayUID,
                    {
                      SECRET_UID: user.uid,
                      artistID: props.artistID,
                      showID: props.showID,
                      venueID: show.venueID,
                      status: "rejected",
                    },
                    setPendingState,
                    null,
                    respondToPerformance,
                    "Invitation declined",
                    dispatch,
                    false,
                    () => dispatch(resetSidebar()),
                    show.venueID,
                    show._key,
                    false,
                    false,
                    null
                  )
                }
              >
                Reject Invite
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
