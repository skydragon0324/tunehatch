import React from "react";
import { Type } from "../../Helpers/shared/Models/Type";
import ArtistCategory from "./Categories/ArtistCategory";

export default function TargetCategory(props: {
  title: string;
  type: Type;
  conditionFn?: (val: any) => boolean;
  sortFn?: (val: any, val2: any) => number;
  maxLength?: number;
  minLength?: number;
  hideIfHatchy?: boolean;
}) {
  return (
    <>
      {props.type === "artist" && (
        <ArtistCategory
          title={props.title}
          conditionFn={props.conditionFn}
          sortFn={props.sortFn}
          maxLength={props.maxLength}
          minLength={props.minLength}
          hideIfHatchy={props.hideIfHatchy}
        />
      )}
    </>
  );
}
