import React, { PropsWithChildren } from "react";
import Img from "./Img";

export default function BannerImage(
  props: PropsWithChildren<{
    height?: string;
    gradientAlt?: boolean;
    src?: string;
    imageStyle?: React.CSSProperties;
    imageClassName?: string;
    localSrc?: string;
    blackAlt?: boolean;
    hideHatchy?: boolean;
  }>
) {
  return (
    <div
      className={`w-full ${
        props.height ? props.height : "h-1/2-screen"
      } relative ${
        props.gradientAlt ? "bg-gradient-to-b from-blue-400 to-transparent" : ""
      }`}
    >
      <Img
        style={props.imageStyle}
        autoremove
        hideHatchy
        src={props.src}
        localSrc={props.localSrc}
        blackAlt={props.blackAlt}
        gradientAlt={props.gradientAlt}
        fallback={null}
        className={`w-full h-full absolute ${
          props.imageClassName ? props.imageClassName : ""
        }`}
      />
      <div className="h-full p-3 relative">{props.children}</div>
    </div>
  );
}
