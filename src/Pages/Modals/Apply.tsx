import React from "react";
import ApplyForm from "../../Forms/ApplyForm";

export default function CreateShow(props: { showID?: string; }) {
  return (
    <>
      <ApplyForm showID={props.showID} />
    </>
  );
}
