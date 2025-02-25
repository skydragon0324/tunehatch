import React from "react";
import ArtistTargetProfileButton from "./ArtistTargetProfileButton";
import { Type } from "../../../Helpers/shared/Models/Type";
import VenueTargetProfileButton from "./VenueTargetProfileButton";
import ShowrunnerTargetProfileButton from "./ShowrunnerTargetProfileButton";

export default function TargetProfileButton(props: {
  type: Type;
  id: string;
  className?: string;
  large?: boolean;
}) {
  return (
    <>
      {props.type === "artist" && (
        <ArtistTargetProfileButton
          large={props.large}
          className={props.className}
          id={props.id}
        />
      )}
      {props.type === "venue" && (
        <VenueTargetProfileButton
          large={props.large}
          className={props.className}
          id={props.id}
        />
      )}
      {props.type === "showrunner" && (
        <ShowrunnerTargetProfileButton
          large={props.large}
          className={props.className}
          id={props.id}
        />
      )}
    </>
  );
}
