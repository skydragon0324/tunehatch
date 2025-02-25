import React, { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { removeStatusMessage } from "../Redux/UI/UISlice";

export default function StatusMessage(props: {
  index?: number;
  message?: string | React.ReactNode;
  timeout_duration?: number;
  type?: string;
}) {
  const dispatch = useAppDispatch();
  const removeFn = () => {
    dispatch(removeStatusMessage(props.index));
  };
  useEffect(() => {
    if (props.message) {
      setTimeout(() => {
        removeFn();
      }, props.timeout_duration);
    }
  }, []);
  return props.message ? (
    <div
      className={`${props.type === "error" ? "bg-red-400" : ""}${
        props.type === "success" ? "bg-green-400" : ""
      }${
        props.type === "info" ? "bg-gray-700" : ""
      } p-4 rounded-md min-w-min text-white`}
      style={{
        animation: `${
          props.timeout_duration / 1000
        }s linear notificationJumper`,
      }}
    >
      <p>{props.message}</p>
    </div>
  ) : (
    <></>
  );
}
