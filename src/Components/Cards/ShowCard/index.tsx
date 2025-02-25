import React, { useState, useMemo } from "react";
import Card from "../../Layout/Card";
import { useAppSelector } from "../../../hooks";
import UserIcon from "../../Images/TargetIcon";
import Button from "../../Buttons/Button";
import ShowEmblem from "../../Images/ShowEmblem";
import BackgroundAbstractor from "../../Images/BackgroundAbstractor";
import {
  useGetAllArtistsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import {
  // addStatusMessage,
  openModal,
  openSidebar,
} from "../../../Redux/UI/UISlice";
import { getShowDate } from "../../../Helpers/HelperFunctions";
// import { useDispatch } from "react-redux";
// import Img from "../../Images/Img";
import TargetProfileButton from "../../Buttons/TargetProfileButton";

interface ShowCardProps {
  showID: string;
  square?: boolean;
  isGig?: boolean;
}

export default function ShowCard(props: ShowCardProps) {
  //todo: refactor for better loading
  const shows = useGetAllShowsQuery();
  const venues = useGetAllVenuesQuery();
  const user = useAppSelector((state) => state.user.data);
  const displayUID = user.displayUID;
  const artists = useGetAllArtistsQuery();
  const show = shows?.data?.[props.showID];
  const venue = venues?.data?.[show.venueID];
  const starttime = getShowDate(show.starttime);
  const [expanded, setExpanded] = useState(false);

  const gigLabel = useMemo(() => {
    if (!user.type?.artist?.enabled) {
      return (
        <Button
          full
          inline
          disabled
          className={"disabled:bg-white"}
          icon={"lock"}
          iconClassName="text-base font-medium"
        >
          Apply
        </Button>
      );
    }

    if (show.performers.some((performer) => performer.uid === displayUID)) {
      return (
        <Button full inline>
          Performing
        </Button>
      );
    }

    if (show.applications.some((performer) => performer.uid === displayUID)) {
      return (
        <Button full inline>
          Applied
        </Button>
      );
    }

    if (show.invites.some((performer) => performer.uid === displayUID)) {
      return (
        <Button full inline>
          Invited
        </Button>
      );
    }

    return (
      <Button
        full
        inline
        action={openSidebar({
          status: true,
          component: "Apply",
          data: { showID: props.showID },
        })}
      >
        Apply
      </Button>
    );
  }, [user.type?.artist?.enabled, show.performers, show.applications, show.invites, props.showID, displayUID]);

  return show ? (
    <Card square={props.square}>
      <div className="md:p-2 flex min-w-full relative flex-wrap">
        <div
          className={`peer relative transition filter w-full ${
            expanded ? "blur-3xl" : ""
          }`}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex flex-col h-48 md:h-auto overflow-hidden w-full flex-fix min-w-1/4 items-center justify-center text-center p-2">
            <BackgroundAbstractor src={show?.flyer}>
              <ShowEmblem venueEmblem={venues.data?.[show?.venueID]?.avatar} />
            </BackgroundAbstractor>
          </div>
          <div className="flex-col p-4 flex-grow min-w-full md:min-w-max">
            <h2 className="text-3xl font-black text-center">
              {show?.name} <br></br> @ {venue.name}
            </h2>
            <h3 className="text-lg text-center">
              {starttime.month} {starttime.day} | {starttime.time}
            </h3>
            <h3 className="text-lg text-center">
              Age: {Number(show.min_age) > 0 ? show.min_age + "+" : "All-Ages"}
            </h3>
            <div className="flex gap-1 mt-2 mb-2">
              {show?.performers?.map((performer, i) => {
                return (
                  <UserIcon
                    key={Number(performer.uid) + i}
                    src={artists.data?.[performer.uid]?.avatar}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={`absolute top-0 left-0 p-2 w-full h-full flex flex-col ${
            expanded ? "block" : "hidden"
          } w-full`}
          onClick={() => setExpanded(!expanded)}
        >
          <h1 className="text-center font-black text-2xl">Meet The Artists</h1>
          <div className="flex p-2 flex-wrap gap-3 justify-center">
            {show?.performers?.map((performer, i) => {
              return (
                <TargetProfileButton
                  key={Number(performer.uid) + i}
                  type="artist"
                  id={performer.uid.toString()}
                />
              );
            })}
          </div>
          <h1 className="text-center font-black text-2xl">
            Peep The Venue{show.showrunner ? "s" : ""}
          </h1>
          <div className="flex p-2 flex-wrap gap-3 justify-center">
            <TargetProfileButton type="venue" id={show.venueID} />
          </div>
        </div>
        <div className="flex flex-row gap-2 flex-grow md:flex-grow-0">
          {props.isGig ? (
            gigLabel
          ) : (
            <Button
              full
              inline
              action={openModal({
                status: true,
                component: "TicketPurchase",
                data: { showID: show._key },
              })}
            >
              Tickets
            </Button>
          )}
          <Button secondary inline full link={`/shows/${props.showID}`}>
            Details
          </Button>
        </div>
      </div>
    </Card>
  ) : null;
}
