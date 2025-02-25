import React from "react";
import { useGetAllArtistsQuery } from "../../../Redux/API/PublicAPI";
import DisplayTargetProfileButton from "./DisplayTargetProfileButton";

interface Props {
  id: string;
  large?: boolean;
  className?: string;
}

export default function ArtistTargetProfileButton({
  id,
  large,
  className,
}: Props) {
  const artists = useGetAllArtistsQuery();
  const artist = artists?.data?.[id];

  return (
    artist && (
      <DisplayTargetProfileButton
        type="artist"
        large={large}
        className={className}
        avatar={artist.avatar}
        id={id}
      />
    )
  );
}
