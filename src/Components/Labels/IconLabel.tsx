import React, { PropsWithChildren } from "react";

export default function IconLabel(
  props: PropsWithChildren<{
    className?: string;
    iconClassName?: string;
    icon?: string | React.ReactNode;
  }>
) {
  return (
    <span className={`${props.className} flex items-center`}>
      <i className={`material-symbols-outlined ${props.iconClassName}`}>
        {props.icon}
      </i>
      <p className="pl-1">{props.children}</p>
    </span>
  );
}
