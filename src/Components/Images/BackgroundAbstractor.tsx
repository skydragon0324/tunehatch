import React, { PropsWithChildren } from "react";
import { IMAGE_URL } from "../../Helpers/configConstants";

export default function BackgroundAbstractor(
  props: PropsWithChildren<{
    src?: string;
    className?: string;
  }>
) {
  return (
    <div className="relative w-full min-h-full">
      <div className="absolute w-full min-h-full inset-0 filter blur-total">
        <img
          alt=""
          src={IMAGE_URL + props.src}
          className="transform scale-150 absolute min-w-full min-h-full"
        />
      </div>
      <div
        className={`relative flex justify-center h-full items-center ${props.className}`}
      >
        {props.children}
      </div>
    </div>
  );
}
