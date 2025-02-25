import React from "react";

export default function LoadingSpinner(props: {
  color?: string;
  className?: string;
}) {
  return (
    <>
      <i
        className={`material-symbols-outlined font-bold text-3xl animate-spin ${
          props.color || "text-orange"
        } ${props.className ? props.className : ""}`}
      >
        progress_activity
      </i>
    </>
  );
}
