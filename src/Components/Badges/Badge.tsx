import React, { PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { openTooltip } from "../../Redux/UI/UISlice";
import { prepTooltip } from "../../Helpers/HelperFunctions";
import { IBadge } from "../../Helpers/shared/badgesConfig";

interface Props {
  badge?: IBadge;
  limitBadge?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Badge({
  badge,
  children,
  limitBadge,
  onClick,
}: PropsWithChildren<Props>) {
  const dispatch = useDispatch();
  
  return (
    <>
      <span
        onClick={(e) =>
          badge
            ? dispatch(
                openTooltip(
                  prepTooltip(
                    true,
                    e.clientX,
                    e.clientY,
                    <>
                      <p className="text-xl font-black text-center">
                        {badge.label}
                      </p>{" "}
                      <p className="p-2 text-center">{badge.awardText}</p>
                    </>,
                    200,
                    200,
                  ),
                ),
              )
            : onClick && onClick(e)
        }
        className={`w-${limitBadge ? "9" : "14"} h-${
          limitBadge ? "9" : "14"
        } border flex rounded-full shadow-md flex-center relative justify-center`}
      >
        {badge?.icon && (
          <i className="material-symbols-outlined">{badge?.icon}</i>
        )}
        {badge?.image && (
          <img src={badge.image} className="w-full h-full rounded-full" alt="" />
        )}
        {children}
      </span>
    </>
  );
}
