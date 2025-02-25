import React, { useEffect, useState } from "react";
// import TargetIcon from "../Images/TargetIcon";
import Img from "../Images/Img";

export default function TargetLabel(props: {
  name?: string;
  canCancel?: boolean;
  src?: string;
  className?: string;
  cancelFn?: () => void;
  onClick?: () => void;
  selectOnClick?: boolean;
  selected?: boolean;
}) {
  const [selected, select] = useState(props.selected || false);
  const clickFn = () => {
    if (props.selectOnClick) {
      select(!selected);
    }
    if (props.onClick) {
      props.onClick();
    }
  };

  useEffect(() => {
    select(props.selected || false);
  }, [props.selected]);

  return (
    <span
      onClick={() => clickFn()}
      className={
        `flex mt-1 flex-shrink items-center flex-grow-0 border rounded-full overflow-hidden pr-2 ${
          selected && "bg-orange text-white"
        } ` + props.className
      }
    >
      <Img
        className="w-8 h-8 mr-1 border border-orange rounded-full"
        src={props.src}
      />{" "}
      <p>{props.name}</p>
      {props.canCancel && (
        <i
          onClick={(e) => {
            e.stopPropagation();
            props.cancelFn && props.cancelFn();
          }}
          className="material-symbols-outlined text-red-400 text-base pl-1"
        >
          close
        </i>
      )}
    </span>
  );
}
