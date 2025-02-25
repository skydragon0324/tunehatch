import React, { PropsWithChildren } from "react";

export default function Card(
  props: PropsWithChildren<{
    onClick?: () => void;
    square?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }>
) {
  return (
    <div
      onClick={props.onClick ? () => props.onClick() : null}
      className={`transition-all flex flex-wrap border border-gray-300 card shadow-sm overflow-hidden rounded-3xl
        ${
          props.square
            ? "min-w-64 flex-shrink-0 w-64 h-64 flex-col"
            : "max-w-full flex-shrink-0"
        } ${props.className}
        `}
      style={props.style ? props.style : {}}
    >
      {props.children}
    </div>
  );
}
