import React, { useEffect, useState } from "react";
import { renderPageTitle } from "../Helpers/HelperFunctions";
import { useRespondToArtistPerformanceMutation } from "../Redux/API/ArtistAPI";
import { useAppSelector } from "../hooks";
import {
  useCookieLogInMutation,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import { useParams } from "react-router-dom";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import dayjs from "dayjs";

export default function QuickConfirm(props: {
  showID?: string;
  SECRET_UID?: string;
}) {
  var { showID, SECRET_UID } = useParams();
  showID = showID || props.showID;
  const user = useAppSelector((state) => state.user.data);
  const shows = useGetAllShowsQuery();
  const venues = useGetAllVenuesQuery();
  const show = shows.data?.[showID];
  const venue = venues.data?.[show?.venueID];
  const [status, setStatus] = useState<boolean>(null);

  const starttime = dayjs(show?.starttime);

  const [verifyUser] = useCookieLogInMutation();
  const [respondToPerformance] = useRespondToArtistPerformanceMutation();
  useEffect(() => {
    renderPageTitle("Performance Confirmation");
  }, []);

  useEffect(() => {
    if (!user.uid && SECRET_UID) {
      verifyUser(SECRET_UID);
    }
  }, [user.uid, SECRET_UID]);

  // useEffect(() => {
  //   const verifyUserAndRespond = async () => {
  //     let SECRET_UID = getCookie("SECRET_UID");
  //     console.log('secret?', SECRET_UID);
  //     if (SECRET_UID) {
  //       await verifyUser(SECRET_UID);
  //     }
  //   };
  //   verifyUserAndRespond();
  // }, [props.SECRET_UID, verifyUser]); // Add verifyUser as a dependency

  const handleAccept = async () => {
    // Handle accept logic here
    await respondToPerformance({
      SECRET_UID: user.uid,
      artistID: user.displayUID,
      showID: showID,
      venueID: show.venueID,
      status: "accepted",
    })
      .unwrap()
      .then(() => {
        setStatus(true);
      });
  };

  const handleReject = async () => {
    // Handle reject logic here
    await respondToPerformance({
      SECRET_UID: user.uid,
      artistID: user.displayUID,
      showID: showID,
      venueID: show.venueID,
      status: "rejected",
    })
      .unwrap()
      .then(() => {
        setStatus(false);
      });
  };

  return (
    <LoadingWrapper queryResponse={[shows, venues]}>
      <div className="flex flex-col text-center">
        {status === true && (
          <>
            <h1 className="text-5xl font-black text-center">
              You've been invited to perform at {show?.name}{" "}
            </h1>
            <h2>Show Details:</h2>
            <p className="text-2xl text-center font-black ">
              Date: {starttime.format("MM/DD/YYYY | HH:mma")}
            </p>
            <p className="text-s text-center"></p>
            <p className="text-xs text-center"></p>
            <div className="mx-auto w-full">
              <h1 className="text-2xl text-green-400 text-center font-black">
                Invite accepted!
              </h1>
              <p>
                The venue has been notified of your intent to play, and will
                reach out if they have any questions. Have a great show!
              </p>
            </div>
          </>
        )}
        {status === false && (
          <>
            <h1 className="text-5xl font-black text-center">
              You've been invited to perform at {show?.name}{" "}
            </h1>
            <h2>Show Details:</h2>
            <p className="text-2xl text-center font-black ">
              Date: {starttime.format("MM/DD/YYYY | HH:mma")}
            </p>
            <p className="text-s text-center"></p>
            <p className="text-xs text-center"></p>
            <div className="mx-auto w-full">
              <h1 className="text-2xl text-red-400 text-center font-black">
                Invite rejected.
              </h1>
            </div>
          </>
        )}
        {status === null && (
          <>
            <h1 className="text-5xl font-black text-center">
              You've been invited to perform at {show?.name}{" "}
            </h1>
            <h2>Show Details:</h2>
            <p className="text-2xl text-center font-black ">
              Date: {starttime.format("MM/DD/YYYY | HH:mma")}
            </p>
            <p className="text-s text-center"></p>
            <p className="text-xs text-center"></p>
            <div className="mx-auto w-full">
              <h2>
                Please click{" "}
                <a href="#" onClick={handleAccept}>
                  ACCEPT
                </a>{" "}
                or{" "}
                <a href="#" onClick={handleReject}>
                  REJECT
                </a>{" "}
                in order to notify {venue?.name}
              </h2>
            </div>
          </>
        )}
      </div>
    </LoadingWrapper>
  );
}
