import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";

export default function ToggleSlider(props: {
  value?: any;
  clickFn?: (val: boolean) => void;
  className?: any;
  label?:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal;
}) {
  const active = props.value;

  const toggle = (value: boolean) => {
    props.clickFn(value);
  };

  return (
    <div
      className={`flex gap-2 items-center ${
        props.className ? props.className : ""
      }`}
    >
      <div
        onClick={(e) => toggle(!active)}
        className={`flex rounded-2xl p-1 border-2 w-16 h-8 transition-all ${
          active ? "bg-orange" : "bg-white"
        } items-center flex-row flex-shrink-0 transition ${
          props.className ? props.className : ""
        }`}
      >
        <div
          className={`rounded-full w-6 h-6  toggle-transition ${
            active ? "translate-x-7 bg-white" : "bg-gray-200"
          }`}
        ></div>
      </div>
      <p className="my-auto font-medium">{props.label}</p>
    </div>
  );
}
