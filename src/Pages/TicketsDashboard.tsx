import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { useGetAllShowsQuery } from "../Redux/API/PublicAPI";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
// import { IMAGE_URL } from "../Helpers/configConstants";
// import SadHatchy from "../Images/SadHatchy.png";
// import { Link } from "react-router-dom";
import { useGetUserTicketsQuery } from "../Redux/API/UserAPI";
// import Img from "../Components/Images/Img";
// import ShowTile from "../Components/Tiles/ShowTile";
// import { updateView } from "../Redux/UI/UISlice";
import ShowCard from "../Components/Cards/ShowCard/ShowCard2";
import { renderPageTitle } from "../Helpers/HelperFunctions";

export default function TicketDashboard() {
  // const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const userTickets = useGetUserTicketsQuery({ SECRET_UID: user.uid });
  const tickets = userTickets.data;
  const currentView = useAppSelector(
    (state) => state.ui.views.ticketDashboard.view
  );
  // const selectedShow = useAppSelector((state) => state.user?.data?.shows[currentView]);
  const shows = useGetAllShowsQuery();

  const [showCount, setShowCount] = useState(0);
  const [sortedTickets, setSortedTickets] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [validTickets, setValidTickets] = useState(0);

  const sortTickets = () => {
    if (
      tickets &&
      !Object.keys(sortedTickets)?.length &&
      Object.keys(tickets)?.length
    ) {
      let validTickets = 0;
      let sortedTickets: { [key: string]: any[] } = {};
      Object.keys(tickets)?.forEach((ticketID) => {
        let ticket = tickets[ticketID];
        if (ticket) {
          let validShow = true;
          // console.log(ticket)
          let show = shows.data?.[ticket.showID || ticket.show];
          if (!show) {
            validShow = false;
          }
          if (validShow) {
            const ticketIdentifier = (ticket.showID ||
              ticket.show) as string;
            if (!sortedTickets[ticketIdentifier]) {
              sortedTickets[ticketIdentifier] = [ticket];
            } else {
              sortedTickets[ticketIdentifier].push(ticket);
            }
            validTickets++;
          }
        }
      });
      if (validTickets) {
        setSortedTickets(sortedTickets);
        setShowCount(Object.keys(sortedTickets).length);
        setValidTickets(validTickets);
      }
    }
  };

  useEffect(() => {
    renderPageTitle("Tickets");
  }, []);

  useEffect(() => {
    sortTickets();
  }, [tickets]);
  sortTickets();

  //TODO: selected show?
  return (
    <LoadingWrapper queryResponse={[shows, userTickets]}>
      <div className="flex flex-col pd-2">
        {!currentView ? (
          <div className="flex flex-col p-2 text-center">
            <h1 className={"text-4xl font-black"}>Your Tickets</h1>
            {/* <h2><i className="material-symbols-outlined">construction</i>Please excuse our appearance this page is currently under construction.</h2> */}
            {validTickets > 0 ? (
              <p className={"mt-2"}>
                You currently have {validTickets} ticket{validTickets && "s"} to{" "}
                {showCount && showCount} {showCount > 1 ? "shows" : "show"}
              </p>
            ) : (
              <p className={"mt-2"}>
                You don't have tickets for any upcoming shows! Check out any
                past tickets you've collected here, or{" "}
                <a href="/shows" className="text-blue-500">
                  find a show
                </a>
              </p>
            )}
            <div className="grid grid-flow-row gap-4">
              {validTickets ? (
                Object.keys(sortedTickets).map((showID, i) => {
                  let show = shows.data?.[showID];
                  const ticketIDs = sortedTickets[showID].map(
                    (ticket: any) => ticket.id
                  );

                  return (
                    <ShowCard
                      key={"ticketHolder/" + i}
                      type="ticket"
                      isGig={false}
                      show={show}
                      tickets={sortedTickets[showID]}
                      ticketIDs={ticketIDs}
                    />
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </LoadingWrapper>
  );
}
// return <div className="flex flex-col justify-center items-center w-full h-100 flex-grow">
// <h1 className="text-5xl p-4 font-black text-center">Coming Soon!</h1>
//   <Img className="w-64 h-64 mx-auto" localSrc={SadHatchy}/>
//   <h2><i className="material-symbols-outlined">construction</i>Please excuse our appearance this page is currently under construction.</h2>
//     <p className="absolute bottom-0 p-8 text-center">Still having issues? We're here to help. Send us an email at <a className="text-blue-500" href="mailto:info@tunehatch.com">info@tunehatch.com</a></p>
// </div>
// }
