import React from "react";
import TargetCard from "../Cards/TargetCard";
import { Type } from "../../Helpers/shared/Models/Type";

export default function TargetCardCollection(props: {
  type: Type;
  ids: string[];
  backgroundColor?: string;
}) {
  return (
    <div
      className={`w-full overflow-auto flex gap-3 p-2 ${
        props.backgroundColor ? props.backgroundColor : ""
      }`}
    >
      {props.ids?.map((id, i) => {
        return <TargetCard key={"targetCard/" + i} id={id} type={props.type} />;
      })}
    </div>
  );
}
