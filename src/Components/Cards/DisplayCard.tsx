import React, { PropsWithChildren } from "react";
import Card from "../Layout/Card";
import ColorResponsiveText from "../ColorResponsiveText";

interface IDisplayCardProps {
  title: string;
  color?: string;
  titleColor?: string;
  topMargin?: string;
  contentPadding?: string;
  className?: string;
  containerClassName?: string;
}

export default function DisplayCard(
  props: PropsWithChildren<IDisplayCardProps>
) {
  return (
    <Card
      className={`rounded-md ${props.topMargin} ${
        props.containerClassName ? props.containerClassName : ""
      }`}
    >
      <div className="flex flex-col w-full">
        <div className="w-full border-b">
          <div className={`text-2xl p-2 ${props.color || "bg-white"}`}>
            <ColorResponsiveText className={`text-2xl font-black`}
              fontColor={props.titleColor}
            >
              {props.title}
            </ColorResponsiveText>
          </div>
        </div>
        <div
          className={`${props.contentPadding ? props.contentPadding : ""} ${
            props.className ? props.className : ""
          }`}
        >
          {props.children}
        </div>
      </div>
    </Card>
  );
}
