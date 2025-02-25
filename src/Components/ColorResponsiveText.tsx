import React, { PropsWithChildren } from "react";

export default function ColorResponsiveText(
  props: PropsWithChildren<{
    className?: string;
    fontColor?: string;
  }>
) {
  return (
    <h2
      className={`${props.fontColor ? props.fontColor : "text-color-responsive"} ${
        props.className ? props.className : ""
      }`}
    >
      {props.children}
    </h2>
  );
}
