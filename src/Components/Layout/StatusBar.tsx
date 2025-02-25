import React from "react";
import { useAppSelector } from "../../hooks";
import StatusMessage from "../StatusMessage";

export default function StatusBar() {
  const statusMessages = useAppSelector((state) => state.ui.statusMessages);
  return statusMessages?.length ? (
    <div
      className={`pointer-events-none absolute z-50 bottom-0 flex flex-shrink right-0 w-1/4 flex-col items-end p-8 gap-2`}
    >
      {statusMessages.map((status, i) => {
        return (
          <StatusMessage
            type={status!.type}
            message={status!.message}
            timeout_duration={status!.timeout_duration}
            key={i}
            index={i}
          />
        );
      })}
    </div>
  ) : null;
}
