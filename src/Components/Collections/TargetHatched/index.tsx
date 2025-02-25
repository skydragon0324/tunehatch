import React, { useEffect, useState } from "react";
import { Type } from "../../../Helpers/shared/Models/Type";
import {
  useGetAllArtistsQuery,
  useGetAllVenuesQuery,
  useGetSpotlightQuery,
} from "../../../Redux/API/PublicAPI";
import TargetHatchedDisplay from "./TargetHatchedDisplay";
import { parseProfileData } from "../../../Helpers/HelperFunctions";
// import { getSpotlightInfo } from "../../../../server/Services/DBServices/dbService";

export default function TargetHatched(props: {
  type: Type;
  id?: string;
  bioOverride?: string;
  showOverride?: string;
  videoOverride?: string;
}) {
  const spotlight = useGetSpotlightQuery(null, {
    skip: props.id !== undefined,
  });
  const spotlightID = props.id || spotlight?.data?.[props.type].id;
  const venues = useGetAllVenuesQuery(null, { skip: props.type !== "venue" });
  const artists = useGetAllArtistsQuery(null, {
    skip: props.type !== "artist",
  });
  const preTarget = venues.data?.[spotlightID] || artists.data?.[spotlightID];
  const target = preTarget && parseProfileData(props.type, preTarget);
  const [bio, setBio] = useState(
    spotlight.data?.[props.type]?.bio_override || target?.about,
  );
  const [show, setShow] = useState(spotlight.data?.[props.type]?.featured_show);
  const [video, setVideo] = useState(
    spotlight.data?.[props.type]?.video_override ||
      target?.socials?.youTubeLink ||
      "",
  );

  useEffect(() => {
    setBio(spotlight.data?.[props.type]?.bio_override || target?.about);
    setShow(spotlight.data?.[props.type]?.featured_show);
    setVideo(
      spotlight.data?.[props.type]?.video_override ||
        target?.socials?.youTubeLink ||
        "",
    );
  }, [target, spotlight]);

  return (
    <>
      <TargetHatchedDisplay
        type={props.type}
        target={target}
        bio={bio}
        show={show}
        video={video}
      />
    </>
  );
}
