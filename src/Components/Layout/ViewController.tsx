import React, { useRef } from "react";
import Button from "../Buttons/Button";
import useOnScreen from "../../Hooks/isOnScreen";

export default function ViewController(props: {
  changeFn?: (val: number) => void;
  currentView?: number;
  fixed?: boolean;
  locked?: boolean;
  displayErrors?: () => void;
  navClassName?: string;
  totalViews?: number;
  useScroll?: boolean;
  submitFn?: () => void;
  clickPromise?: any;
  pendingState?: string;
  doneLabel?: string;
  completedLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);

  const changeView = (direction: "back" | "next") => {
    if (direction === "back") {
      props.changeFn(props.currentView - 1);
    } else {
      props.changeFn(props.currentView + 1);
    }
  };

  return (
    <>
      {props.fixed ? <div ref={ref}></div> : <></>}
      <div
        ref={props.fixed ? null : ref}
        onClick={(e) => {
          props.locked && props.displayErrors && props.displayErrors();
        }}
        className={`flex pointer-events-none ${
          props.fixed ? "relative bottom-0 right-0 left-0 " : ""
        } ${
          props.navClassName
            ? props.navClassName
            : "flex justify-between mx-3 relative h-20 items-center"
        }`}
      >
        {props.currentView > 0 ? (
          <Button
            className="pointer-events-auto"
            name="back"
            clickFn={() => {
              changeView("back");
            }}
            flow
            secondary
          ></Button>
        ) : (
          <div></div>
        )}
        {props.currentView < props.totalViews && (
          <Button
            name="next"
            className={`relative pointer-events-auto`}
            clickFn={
              props.locked
                ? () => props.displayErrors()
                : () => changeView("next")
            }
            disabled={props.locked}
            flow
            useScroll={props.useScroll && !isVisible}
          >
            Next
          </Button>
        )}
        {props.currentView === props.totalViews && (
          <Button
            name="done"
            className={`pointer-events-auto`}
            clickFn={() => props.submitFn()}
            disabled={props.locked}
            flow
            useScroll={props.useScroll && !isVisible}
            clickPromise={props.clickPromise}
            pendingState={props.pendingState}
            noIcon
          >
            {props.pendingState !== "completed"
              ? props.doneLabel || "Done"
              : props.completedLabel || "Saved"}
          </Button>
        )}
      </div>
    </>
  );
}
