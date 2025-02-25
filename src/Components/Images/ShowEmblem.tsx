import React from "react";
import Img from "./Img";

export default function ShowEmblem(props: {
  venueEmblem?: string;
  showrunnerEmblem?: string;
}) {
  return (
    <div className="w-28 h-28 relative">
      <Img
        className={`${
          props.showrunnerEmblem
            ? "w-[4.5rem] h-[4.5rem] border-orange border"
            : "w-28 h-28"
        } object-cover absolute bg-white rounded-full`}
        src={props.venueEmblem}
      />
      {props.showrunnerEmblem && (
        <Img
          className="absolute w-[4.5rem] h-[4.5rem] bg-white bottom-0 border border-purple-400 right-0 rounded-full"
          src={props.showrunnerEmblem}
        />
      )}
    </div>
  );
}
