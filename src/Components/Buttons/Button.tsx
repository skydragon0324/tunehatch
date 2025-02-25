import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../hooks";
import { AnyAction } from "@reduxjs/toolkit";

interface IButtonProps {
  name?: string;
  pendingState?: string;
  ref?: React.RefObject<any>;
  link?: string;
  newTab?: boolean;
  action?: AnyAction;
  clickFn?: (e: React.MouseEvent) => any;
  clickPromise?: any;
  onClick?: (e: React.MouseEvent) => Promise<any> | any;
  useScroll?: boolean;
  flow?: boolean;
  secondary?: boolean;
  icon?: string;
  noIcon?: boolean;
  stopPropagation?: boolean;
  iconClassName?: string;
  disabled?: boolean;
  inline?: boolean;
  full?: boolean;
  className?: string;
  active?: boolean;
  orange?: boolean;
  animateWide?: boolean;
}
/**
 * Standard Button
 * Allows for clickFns or actions to be dispatched on click, or link.
 */
export default function Button(props: PropsWithChildren<IButtonProps>) {
  const dispatch = useAppDispatch();
  const [pending, setPending] = useState("false");
  // const [buttonElement, setButtonElement] = useState(<></>);

  useEffect(() => {
    setPending(props.pendingState);
  }, [props.pendingState]);

  const clickFn = (e: React.MouseEvent) => {
    if (!props.link && (props.action || props.clickFn || props.onClick)) {
      e.preventDefault();
    }
    if (props.stopPropagation) {
      e.stopPropagation();
    }
    if (props.action) {
      let action = dispatch(props.action);
      if (action && typeof action.then == "function") {
        setPending("true");
        action.finally(() => {
          setTimeout(() => setPending("completed"));
          setTimeout(() => {
            if (pending !== "pending") {
              setPending("false");
            }
          });
        });
      }
    } else if (props.clickFn || props.onClick) {
      var callableFn = props.clickFn || props.onClick;
      var fn = callableFn(e);
      if ((fn && typeof fn.then == "function") || props.clickPromise) {
        setPending("true");
        fn.finally(() => {
          setTimeout(() => setPending("completed"));
          setTimeout(() => {
            if (pending !== "pending") {
              setPending("false");
            }
          });
        });
      }
    }
  };

  const buttonElement = useMemo(
    () => (
      <>
        {(props.flow && props.secondary) || props.useScroll === true ? (
          <></>
        ) : (
          <p className="font-bold text">{props.children}</p>
        )}
        <span
          className={`transition-all items-center flex justify-center ${
            !props.icon && !props.flow
              ? pending === "false" || !pending
                ? "w-0"
                : "w-8"
              : ""
          }`}
        >
          <i
            className={`material-symbols-outlined ${
              props.iconClassName ? props.iconClassName : "font-bold text-3xl"
            } ${!props.flow ? "ml-3" : ""} ${
              pending === "true" ? "animate-spin" : ""
            }`}
          >
            {pending === "false" && !props.icon && !props.noIcon
              ? props.flow
                ? props.secondary
                  ? "arrow_back"
                  : props.useScroll === true
                  ? "arrow_downward"
                  : "arrow_forward"
                : props.icon
              : props.icon}
            {pending === "true" && "progress_activity"}
            {pending === "completed" && "done"}
            {props.flow &&
              props.secondary &&
              !props.icon &&
              !props.noIcon &&
              "arrow_back"}
          </i>
        </span>
      </>
    ),
    [pending, props.children, props.flow, props.icon, props.iconClassName, props.noIcon, props.secondary, props.useScroll]
  );

  // useEffect(() => {
  //   let buttonElement = ;
  //   setButtonElement(buttonElement);
  // }, [pending, props.children, props.useScroll]);

  return (
    <button
      ref={props.ref}
      disabled={props.disabled}
      onClick={(e) => clickFn(e)}
      className={`flex justify-center transition-all text-center items-center ${
        !props.secondary ? "disabled:bg-gray-400" : ""
      } ${props.inline ? "" : "bg-orange gap-1 p-4"}
        ${
          props.flow && !props.secondary
            ? `${props.useScroll === true ? "w-16" : "w-36"} h-16`
            : ""
        }
        ${
          props.flow
            ? props.secondary
              ? `rounded-full ${props.full ? "flex-grow" : "w-16"} h-16`
              : `${props.full ? "w-full" : ""} rounded-full animate-expand-wide`
            : `rounded-md min-w-max ${props.full ? "flex-grow" : "w-28"} h-11`
        }
        ${
          props.secondary
            ? `bg-white ${
                props.orange ? "border-orange text-orange" : "text-gray-400"
              } ${props.inline ? "" : "border-2 text-gray-400"}`
            : props.inline
            ? props.className
              ? ""
              : "text-orange"
            : "text-white border-gray-300"
        }
        ${props.inline && props.active ? "bg-gray-200" : ""} 
        ${props.animateWide ? "animate-expand-wide" : ""}
        filter hover:brightness-105
        cursor-pointer
        ${props.secondary ? "hover:bg-gray-200" : ""}
        ${props.className}`}
    >
      {props.link ? (
        <a href={props.link} target={props.newTab && "_blank"} rel="noreferrer">
          {buttonElement}
        </a>
      ) : (
        buttonElement
      )}
    </button>
  );
}
