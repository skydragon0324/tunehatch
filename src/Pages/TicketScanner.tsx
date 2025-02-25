import axios from "axios";
import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { APIURL } from "../Helpers/configConstants";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import { useAppDispatch, useAppSelector } from "../hooks";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import { setFullscreen } from "../Redux/UI/UISlice";
import Button from "../Components/Buttons/Button";

function TicketScanner() {
  const dispatch = useAppDispatch();
  const { venueID, showID, ticketID } = useParams();
  const [status, setStatus] = useState(null);
  const user = useAppSelector((state) => state.user.data);
  const venues = useGetAllVenuesQuery();
  const shows = useGetAllShowsQuery();
  const venue = venues.currentData?.[venueID];
  const show = shows.currentData?.[showID];
  useEffect(() => {
    dispatch(setFullscreen({ status: true }));
    return () => {
      dispatch(setFullscreen({ status: false }));
    };
  }, []);

  const verifyTicket = async () => {
    const result = await axios.post(APIURL + "venue/redeem-ticket", {
      venueID,
      showID,
      ticketID,
      SECRET_UID: user.uid,
    });
    console.log(result);
    setStatus(result.data);
  };

  useEffect(() => {
    if (user?.type?.host?.venues?.includes(venueID)) {
      verifyTicket();
    } else {
      setStatus("login_needed");
    }
  }, [user]);

  return (
    <div className="TicketScanner sm-pad">
      <LoadingWrapper requiredData={[status]}>
        <div className="flex flex-col items-center justify-center mt-10 gap-5">
          <h1 className="text-4xl font-black">{show?.name}</h1>
          {status === true && (
            <>
              <i className="material-symbols-outlined text-green-400 text-9xl text-center font-black">
                check_circle_outline
              </i>
              <h1 className="text-3xl text-center font-black">Success!</h1>
              <p className="text-center">Ticket redeemed successfully.</p>
            </>
          )}
          {status === "recheck" && (
            <>
              <i className="material-symbols-outlined text-orange text-9xl text-center font-black">
                error_outline
              </i>
              <h1 className="text-3xl text-center font-black">
                Ticket Already Redeemed
              </h1>
              <p className="text-center">
                This is a valid TuneHatch ticket, but it has already been
                scanned. Ensure that this is an authorized re-entry or that the
                correct ticket was presented.
              </p>
            </>
          )}
          {status === false && (
            <>
              <i className="material-symbols-outlined text-red-500 text-9xl text-center font-black">
                cancel
              </i>
              <h1 className="text-3xl text-center font-black">
                Invalid Ticket
              </h1>
              <p className="text-center">
                This is not a TuneHatch ticket for this show. <br />
                Please manually check the guestlist.
              </p>
            </>
          )}
          {status === "login_needed" && (
            <>
              <h1>Not Logged in as Venue</h1>
              <p className="center">
                You must be logged in as a manager of{" "}
                {venue?.name || "this venue"} to accept tickets for{" "}
                {show?.name || "this show"}.
              </p>
              <Button link="/login">Log In</Button>
            </>
          )}
          {status !== "login_needed" && status !== "loading" && (
            <Button link={"/e/guestlist/" + showID}>To Guest List</Button>
          )}
        </div>
      </LoadingWrapper>
    </div>
  );
}

export default TicketScanner;
