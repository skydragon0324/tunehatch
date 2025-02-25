import React from "react";
import { useGetAllShowrunnerGroupsQuery } from "../../../Redux/API/PublicAPI";
import DisplayTargetProfileButton from "./DisplayTargetProfileButton";

interface Props {
  id: string;
  large: boolean;
  className: string;
}

export default function ShowrunnerTargetProfileButton({
  id,
  large,
  className,
}: Props) {
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const showrunner = showrunners?.data?.[id];

  return (
    showrunner && (
      <DisplayTargetProfileButton
        type="showrunner"
        large={large}
        className={className}
        avatar={showrunner.avatar}
        id={id}
      />
    )
  );
}
