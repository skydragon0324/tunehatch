import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import BROKEN_IMAGE from "../../Images/ChickLogo.png";
import {
  useGetAllArtistsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import Img from "../Images/Img";
import dayjs from "dayjs";
import { ParsedNotifications } from "../../Helpers/shared/Models/Notifications";

interface Props extends ParsedNotifications {
  closeFunction?: (e: React.MouseEvent) => void;
}

export default function DynamicNotification({
  data,
  multiple,
  timestamp,
  read,
  closeFunction,
  type,
}: Props) {
  const venues = useGetAllVenuesQuery();
  const artists = useGetAllArtistsQuery();
  const shows = useGetAllShowsQuery();
  // const [notification, setNotification] = useState(null);
  // const [image, setImage] = useState(null);
  // const [destination, setDestination] = useState(null);
  // const [time, setTime] = useState(null);

  // const determineNotificationContent = () => {
  //   /*
  //       Data Object Reminder:
  //       TICKETS_SOLD: showID, quantity
  //       NEW_APPLICATION: showID, artistID
  //       APPLICATION_ACCEPTED: showID,
  //       APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION: showID, venueID
  //       INVITE_ACCEPTED: showID, artistID
  //       NEW_INVITE: showID, venueID
  //       SHOW_RESCHEDULED: showID, newTime
  //       */

  //   setNotification(tempNotif);
  //   setDestination(tempDestination);
  //   setImage(tempImage);
  //   setTime(dayjs(timeStamp).format("MM.D.YY | h:mmA"));
  // };

  const { notification, destination, image, time } = useMemo(() => {
    let tempNotif;
    let tempDestination;
    let tempImage;
    let timeStamp = timestamp || "";
    let showID = data?.showID;
    let show = shows?.data?.[data?.showID];
    let showName = show?.name || "a show";
    let artist = artists?.data?.[data?.artistID];
    let venue = venues?.data?.[show?.venueID];
    let venueName = venue?.name || "a venue";
    let artistName =
      artist?.stagename || artist?.firstname
        ? artist.firstname + " " + artist.lastname
        : "An artist";

    //add logic fo retrieving the venue when we have the showID
    switch (type) {
      case "TICKETS_SOLD":
        tempDestination = show?.venueID
          ? "/venues/manage/" + show?.venueID
          : "/venues/manage";
        tempNotif = (
          <p>
            You sold {data.quantity} ticket{data.quantity > 1 && "s"} to{" "}
            {showName}!
          </p>
        );
        tempImage = venue?.avatar || BROKEN_IMAGE;
        break;
        case "SET_UP_PAYOUTS":
        tempDestination = "/profile"
        tempNotif = (
          <p>
            Please visit your profile to enable payouts for future shows!
          </p>
        );
        tempImage = BROKEN_IMAGE;
        break;
      case "NEW_APPLICATION":
        tempDestination = show?.venueID
          ? "/venues/manage/" + show?.venueID
          : "/venues/manage";
        tempNotif = multiple ? (
          <p>
            {multiple} artists applied to perform at {showName}.
          </p>
        ) : (
          <p>
            {artistName} applied to perform at {showName}.
          </p>
        );
        tempImage = artist?.avatar || BROKEN_IMAGE;
        break;
      case "APPLICATION_ACCEPTED":
        tempDestination = "/artist/manage-shows";
        tempNotif = (
          <p>
            {venueName} accepted your application to perform at {showName}!
          </p>
        );
        tempImage = venue?.avatar || BROKEN_IMAGE;
        break;
      case "APPLICATION_ACCEPTED_REQUIRES_CONFIRMATION":
        tempDestination = `/qc/${showID}`;
        tempNotif = (
          <p>
            {venueName} accepted your application to perform at {showName} and
            requires a text confirmation!
          </p>
        );
        tempImage = venue?.avatar || BROKEN_IMAGE;
        break;
      case "INVITE_ACCEPTED":
        tempDestination = show?.venueID
          ? "/venues/manage/" + show?.venueID
          : "/venues/manage";
        tempNotif = multiple ? (
          <p>
            {multiple} artists accepted your invite to perform at {showName}.
          </p>
        ) : (
          <p>
            {artistName} accepted your invite to perform at {showName}.
          </p>
        );
        tempImage = artist?.avatar || BROKEN_IMAGE;
        break;
      case "NEW_INVITE":
        tempDestination = "/artist/manage-shows";
        tempNotif = multiple ? (
          <p>{multiple} venues invited you to perform at upcoming shows!</p>
        ) : (
          <p>
            {venueName} invited you to perform at {showName}.
          </p>
        );
        tempImage = venue?.avatar || BROKEN_IMAGE;
        break;
      case "SHOW_RESCHEDULED":
        tempDestination = showID ? "/shows/" + showID : "/shows";
        tempNotif = (
          <p>
            {showName} has been rescheduled. The new time is {data.newTime}
          </p>
        );
        tempImage = venues?.data[show?.venueID]?.avatar || BROKEN_IMAGE;
        break;
      case "SHOW_PUBLISHED":
        tempDestination = showID ? "/shows/" + showID : "/shows";
        tempNotif = <p>{showName} has been published.</p>;
        tempImage = venues?.data[show?.venueID]?.avatar || BROKEN_IMAGE;
        break;
      default:
        break;
    }

    return {
      notification: tempNotif,
      destination: tempDestination,
      image: tempImage,
      time: dayjs(timeStamp).format("MM.D.YY | h:mmA"),
    };
  }, [
    artists?.data,
    data?.artistID,
    data.newTime,
    data.quantity,
    data?.showID,
    multiple,
    shows?.data,
    timestamp,
    type,
    venues?.data,
  ]);

  // useEffect(() => {
  //   if (!notification && shows && artists && venues) {
  //     determineNotificationContent();
  //   }
  // }, [
  //   shows,
  //   artists,
  //   venues,
  //   data,
  //   multiple,
  //   read,
  //   timestamp,
  //   closeFunction,
  //   type,
  // ]);

  // useEffect(() => {
  //   if (shows.data) {
  //     determineNotificationContent();
  //   }
  // }, [shows.data]);

  return notification && destination && image ? (
    <div className="flex flex-col">
      <Link to={destination}>
        <div
          className={`${!read ? "bg-gray-200" : ""} flex flex-row`}
          onClick={closeFunction}
        >
          <div className="h-14 w-14 mt-2">
            <Img src={image} className="h-14 w-14" />
          </div>
          <div className="w-full p-2">
            {notification}
            <div className="text-gray-400 text-xs">{time}</div>
          </div>
        </div>
      </Link>
    </div>
  ) : (
    <></>
  );
}
