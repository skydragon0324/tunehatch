import React, { PropsWithChildren, useCallback, useMemo } from "react";
import { useAppDispatch } from "../../hooks";
import { AnyAction } from "@reduxjs/toolkit";

interface Props {
  icon?: string;
  className?: string;
  containerClassName?: string;
  iconClassName?: string;
  link?: string;
  action?: AnyAction;
  onClick?: () => void;
  newTab?: boolean;
}

export default function LabelButton(props: PropsWithChildren<Props>) {
  const dispatch = useAppDispatch();

  const clickFn = useCallback(() => {
    if (props.action) {
      dispatch(props.action);
    } else if (props.onClick) {
      props.onClick();
    }
  }, [dispatch, props]);

  const { buttonElement } = useMemo(() => {
    let baseElement = (
      <div
        onClick={clickFn}
        className={`${
          props.containerClassName ? props.containerClassName : "flex"
        }`}
      >
        <span
          className={`p-1 pl-2 pr-4 flex items-center rounded-full ${
            props.className || "text-sm text-gray-500 border border-gray-500"
          }`}
        >
          {props.icon && (
            <i className={`material-symbols-outlined ${props.iconClassName}`}>
              {props.icon}
            </i>
          )}
          <p>{props.children}</p>
        </span>
      </div>
    );

    if (props.link) {
      return {
        buttonElement: (
          <a
            href={props.link}
            target={props.newTab && "_blank"}
            rel="noreferrer"
          >
            {baseElement}
          </a>
        ),
      };
    } else {
      return { buttonElement: baseElement };
    }
  }, [
    clickFn,
    props.children,
    props.className,
    props.containerClassName,
    props.icon,
    props.iconClassName,
    props.link,
    props.newTab,
  ]);

  // useEffect(() => {
  //   generateButtonElement();
  // }, [props]);

  return buttonElement;
}
