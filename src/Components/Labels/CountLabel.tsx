import React from "react";

export default function CountLabel(props: {
  className?: any;
  count?: string | number;
  label?: string | React.ReactNode;
  small?: boolean;
  color?: string;
  hideCount?: boolean;
}) {
  return (
    <div className="flex items-center">
      <h1
        className={`${props.className} ${
          Number(props.count) <= 0 ? " text-gray-400" : ""
        } capitalize`}
      >
        {props.label}
      </h1>
      {!props.hideCount && (
        <span
          className={`relative flex items-center justify-center text-white rounded-full ${
            props.small
              ? "text-xs font-bold w-5 h-5 left-1"
              : "text-sm font-bold w-6 h-6"
          } bg-${
            Number(props.count) <= 0 ? "gray-200" : props.color || "blue-400"
          }`}
        >
          <p>{Number(props.count) > 99 ? "+" : props.count}</p>
        </span>
      )}
    </div>
  );
}
