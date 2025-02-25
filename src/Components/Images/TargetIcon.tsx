import React from "react";
import Img from "./Img";

export default function TargetIcon(props: {
  className?: string;
  large?: boolean | string;
  color?: string;
  src?: string;
}) {
  return (
    <Img
      className={`${
        props.className
          ? props.className
          : props.large
          ? "rounded-full w-16 h-16 border"
          : "rounded-full w-8 h-8 border"
      } ${props.color || "border-orange"}`}
      src={props.src}
    />
  );
}
