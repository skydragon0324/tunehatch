import React from "react";
import { useGetAllVenuesQuery } from "../../../Redux/API/PublicAPI";
import DisplayTargetProfileButton from "./DisplayTargetProfileButton";

interface Props {
  id: string;
  large: boolean;
  className: string;
}

export default function VenueTargetProfileButton({
  id,
  large,
  className,
}: Props) {
  const venues = useGetAllVenuesQuery();
  const venue = venues?.data?.[id];

  return (
    venue && (
      <DisplayTargetProfileButton
        type="venue"
        large={large}
        className={className}
        avatar={venue.avatar}
        id={id}
      />
    )
  );
}
