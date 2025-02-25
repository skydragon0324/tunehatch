import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { openDrawer, resetDrawer } from "../../Redux/UI/UISlice";
import DayView from "../../Pages/Drawers/DayView";
import { Show } from "../../Helpers/shared/Models/Show";

interface Props {
  active: boolean;
  data: {
    keepOnClose?: boolean;
    shows?: Show[];
    venueID?: string;
    date?: Date;
  };
}

export default function Drawer({ active, data }: Props) {
  const dispatch = useAppDispatch();
  const component = useAppSelector((state) => state.ui.drawer.component);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [active]);

  return (
    <div
      onClick={() => setOpen(true)}
      className={`transition-all fixed z-30 w-full bottom-0 border-t shadow-xl rounded-tl rounded-tr ${
        active ? (open ? "h-3/4" : "h-1/2") : "h-0"
      } bg-white`}
      style={{ animation: ".2s slide-up ease-in-out" }}
    >
      <div className="p-4 pt-0 min-w-full h-full z-30 overflow-auto">
        <div className="border-2 m-2 mb-4 border-gray-400 rounded-full w-20 mx-auto"></div>
        <button
          className="right-1 top-1 absolute z-50"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              data.keepOnClose ? openDrawer({ status: false }) : resetDrawer()
            );
          }}
        >
          <i className="material-symbols-outlined p-2 text-gray-400">close</i>
        </button>
        {component === "DayView" && (
          <DayView shows={data.shows} date={data.date} venueID={data.venueID} />
        )}
      </div>
    </div>
  );
}
