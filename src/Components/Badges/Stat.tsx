import React from "react";
import { useAppDispatch } from "../../hooks";
import { openTooltip } from "../../Redux/UI/UISlice";
import { prepTooltip } from "../../Helpers/HelperFunctions";
import { IStat } from "../../Helpers/shared/statsConfig";

interface Props {
  onClick?: (e: React.MouseEvent) => void;
  stat?: IStat;
}

export default function Stat({ onClick, stat }: Props) {
  const dispatch = useAppDispatch();
  return (
    <span
      onClick={(e) =>
        stat
          ? dispatch(
              openTooltip(
                prepTooltip(
                  true,
                  e.clientX,
                  e.clientY,
                  <>
                    <p className="text-l font-black text-center">
                      {stat?.label}
                    </p>{" "}
                    <p className="p-2 text-sm text-center">
                      {stat?.description}
                    </p>
                  </>,
                  200,
                  125
                )
              )
            )
          : onClick && onClick(e)
      }
      className="shadow flex p-1 border rounded-full hover:bg-gray-200 items-center justify-center"
    >
      {stat?.icon && (
        <div className="flex items-center">
          <i className="material-symbols-outlined">{stat.icon}</i>
        </div>
      )}
      <div className="flex justify-center items-center">
        <p className={`text-center ${stat?.icon ? "pr-2" : ""}`}>
          {stat.value}
        </p>
      </div>
    </span>
  );
}
