import React from "react";
import { Type } from "../../Helpers/shared/Models/Type";
import TargetProfileButton from "../Buttons/TargetProfileButton";

export default function TargetProfileButtonCollection(props: {
  type: Type;
  ids: any[];
  large?: boolean;
  className?: string;
}) {
  return (
    <>
      {props.ids.map((id, i) => {
        return (
          <TargetProfileButton
            type={props.type}
            className={props.className}
            large={props.large}
            id={id}
            key={i}
          />
        );
      })}
    </>
  );
}
