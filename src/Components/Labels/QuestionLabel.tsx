import React, { PropsWithChildren } from "react";
import InfoLabel from "./InfoLabel";

export default function QuestionLabel(
  props: PropsWithChildren<{
    question: string | React.ReactNode;
    className?: string;
    label?: string | React.ReactNode;
    // onClick?: any;
  }>
) {
  return (
    <InfoLabel
      className={props.className}
      label={
        <>
          {props.label}{" "}
          <i className="material-symbols-outlined text-gray-400">help</i>
        </>
      }
    >
      {props.question ? (
        <p className="text-center font-bold">{props.question}</p>
      ) : (
        ""
      )}
      {props.children}
    </InfoLabel>
  );
}
