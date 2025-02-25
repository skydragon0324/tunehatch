import React from "react";
import ArtistCard from "./ArtistCard/ArtistCard";
import VenueCard from "./VenueCard";
import ShowrunnerCard from "./ShowrunnerCard";
import { Type } from "../../Helpers/shared/Models/Type";

export default function TargetCard(props: { type: Type; id: string }) {
  switch (props.type) {
    case "user":
    case "artist":
      return <ArtistCard id={props.id} />;
    case "venue":
      return <VenueCard id={props.id} />;
    case "showrunner":
      return <ShowrunnerCard id={props.id} />;
  }
}
