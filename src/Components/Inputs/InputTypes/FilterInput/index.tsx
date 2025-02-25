import React from "react";
import { Type } from "../../../../Helpers/shared/Models/Type";
import ArtistFilterInput from "./ArtistFilterInput";
import ShowrunnerFilterInput from "./ShowrunnerFilterInput";
import { FormKeys } from "../../../../Redux/User/UserSlice";
import VenueFilterInput from "./VenueFilterInput";

export default function FilterInput(props: {
  type: Type;
  className?: string;
  placeholder?: string;
  selectFn?: any;
  limit?: number;
  removeFn?: any;
  value: any[];
  defaultValue?: any[];
  form?: FormKeys;
  field?: string;
}) {
  return (
    <>
      {props.type === "artist" && (
        <ArtistFilterInput
          limit={props.limit}
          placeholder={props.placeholder}
          className={props.className ? props.className : ""}
          selectFn={props.selectFn}
          removeFn={props.removeFn}
          value={props.value}
          defaultValue={props.defaultValue}
          form={props.form}
          field={props.field}
        />
      )}
      {props.type === "showrunner" && (
        <ShowrunnerFilterInput
          limit={props.limit}
          placeholder={props.placeholder}
          className={props.className ? props.className : ""}
          selectFn={props.selectFn}
          removeFn={props.removeFn}
          value={props.value}
          defaultValue={props.defaultValue}
          form={props.form}
          field={props.field}
        />
      )}
      {props.type === "venue" && (
        <VenueFilterInput
          limit={props.limit}
          placeholder={props.placeholder}
          className={props.className ? props.className : ""}
          selectFn={props.selectFn}
          removeFn={props.removeFn}
          value={props.value}
          defaultValue={props.defaultValue}
          form={props.form}
          field={props.field}
        />
      )}
    </>
  );
}
