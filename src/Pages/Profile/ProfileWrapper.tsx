import React from "react";
import { useParams } from "react-router-dom";
import VenueProfile from "./VenueProfile";
import ShowrunnerProfile from "./ShowrunnerProfile";
import UserProfile from "./UserProfile";

export default function ProfileWrapper(props: {
  profileID?: string;
  type?: string;
}) {
  var { profileID, type } = useParams();
  profileID = profileID || props.profileID;
  type = type || props.type?.[0];

  return (
    <>
      {type === "v" && <VenueProfile profileID={profileID} type={type} />}
      {(type === "g" || type === "s") && (
        <ShowrunnerProfile profileID={profileID} />
      )}
      {(type === "u" || type === "a") && <UserProfile profileID={profileID} />}
    </>
  );
}
