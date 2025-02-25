import React, { useMemo, useRef } from "react";
import useWindowDimensions, { useAppDispatch } from "../../hooks";
import { openTooltip } from "../../Redux/UI/UISlice";

export default function QuestionButton(props: {
  question: React.ReactNode | string;
  answer: React.ReactNode | string;
  label: React.ReactNode | string;
  onClick?: (e: React.MouseEvent) => void;
  icon?: string;
  className?: string;
  defaultWidth?: number;
}) {
  const dispatch = useAppDispatch();
  const target = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const { width: screenWidth } = useWindowDimensions();
  // const [targetWidth, setTargetWidth] = useState(props.defaultWidth || 300);

  const targetWidth = useMemo(
    () => props.defaultWidth || 300,
    [props.defaultWidth]
  );

  // [kevin] HIGHLY recommend using react-laag or other library like that
  // instead of this.
  const calculateTooltipPlacement = (width: number) => {
    if (content.current) {
      content.current.style.width = width + "px";
    }
    let rect = target.current.getBoundingClientRect();
    let x = rect.x - width / 2;
    if (rect.right > screenWidth) {
      x = screenWidth - width;
    }
    if (rect.x < 0) {
      x = 0;
    }
    return x;
  };

  const openFn = (width: number) => {
    let x = calculateTooltipPlacement(width);
    dispatch(
      openTooltip({
        status: true,
        data: (
          <>
            <h4 className="text-lg text-white font-black text-center">
              {props.question}
            </h4>
            {props.answer}
          </>
        ),
        width: width,
        height: content.current.scrollHeight + 10,
        x,
        y: target.current.getBoundingClientRect().y,
      })
    );
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          props.onClick && props.onClick(e);
        }}
        className={`${
          props.className
            ? props.className
            : "text-lg p-2 m-2 mx-auto flex items-center border-2  hover:bg-gray-100 rounded-full"
        }`}
      >
        <i className="material-symbols-outlined">{props.icon}</i>
        {props.label}
        <span className="flex items-center">
          <i
            className="material-symbols-outlined text-gray-400"
            ref={target}
            onClick={(e) => {
              e.stopPropagation();
              openFn(300);
            }}
          >
            help
          </i>
        </span>
      </button>
      <div
        className="h-0 max-h-0 absolute bottom-0 left-0 opacity-0"
        style={{ width: targetWidth + "px" }}
        ref={content}
      >
        <h4 className="text-lg text-white font-black">{props.question}</h4>
        {props.answer}
      </div>
    </>
  );
}
