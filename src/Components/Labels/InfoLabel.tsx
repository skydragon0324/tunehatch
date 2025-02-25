import React, { PropsWithChildren, useRef } from "react";
import useWindowDimensions, { useAppDispatch } from "../../hooks";
import { openTooltip } from "../../Redux/UI/UISlice";

export default function InfoLabel(
  props: PropsWithChildren<{
    label?: string | React.ReactNode;
    className?: string;
  }>
) {
  const dispatch = useAppDispatch();
  const { width: screenWidth } = useWindowDimensions();
  const calculateTooltipPlacement = (width: number) => {
    let rect = target.current.getBoundingClientRect();
    let x = rect.x - width / 4;
    if (rect.right > screenWidth) {
      x = screenWidth - width;
    }
    if (rect.x < 0) {
      x = 0;
    }
    return x;
  };
  const openFn = (width: number) => {
    dispatch(
      openTooltip({
        status: true,
        data: props.children,
        width: width,
        height: content.current.scrollHeight,
        x: calculateTooltipPlacement(width),
        y: target.current.getBoundingClientRect().y,
      })
    );
  };
  const target = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  return (
    <span
      ref={target}
      className="relative"
      onClick={() => {
        openFn(200);
      }}
    >
      {React.isValidElement(props.label) ? (
        props.label
      ) : (
        <p className={props.className}>
          <span className="flex items-center">{props.label}</span>
        </p>
      )}
      <div className="bg-slate-700 rounded text-white p-2 absolute z-0 pointer-events-none opacity-0 mx-1">
        <div ref={content}>{props.children}</div>
      </div>
    </span>
  );
}
