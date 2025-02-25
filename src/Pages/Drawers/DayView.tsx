import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useAppDispatch } from "../../hooks";
import { openModal } from "../../Redux/UI/UISlice";
import ManageShowTile from "../../Components/Tiles/ShowTile";
import { Show } from "../../Helpers/shared/Models/Show";

export default function DayView(props: {
  date: Date;
  shows: Show[];
  venueID: string;
}) {
  const dispatch = useAppDispatch();
  const [day, setDay] = useState(dayjs(props.date).format("MMMM D"));
  const [year, setYear] = useState(dayjs(props.date).format("YYYY"));
  const currentYear = String(new Date().getFullYear());
  const [past, setPast] = useState(Date.now() > new Date(props.date).getTime());

  useEffect(() => {
    setDay(dayjs(props.date).format("MMMM D"));
    setYear(dayjs(props.date).format("YYYY"));
    setPast(Date.now() > new Date(props.date).getTime());
  }, [props.date]);

  return (
    <>
      <h1 className="flex items-center">
        {day}
        {year === currentYear ? "" : ", " + year}
        {!past && (
          <span
            className="text-sm flex items-center border ml-2 pr-2 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                openModal({
                  status: true,
                  component: "CreateShow",
                  data: {
                    defaultDate: new Date(props.date),
                    venueID: props.venueID,
                  },
                }),
              );
            }}
          >
            <i className="material-symbols-outlined font-light text-base pl-1 text-gray-500">
              add
            </i>
            Quick Show
          </span>
        )}
      </h1>
      {props.shows.length} show{props.shows.length === 1 ? "" : "s"} scheduled.
      <div className="border">
        {props.shows?.map((show) => {
          return (
            <ManageShowTile
              showID={show._key}
              manageView
              hideDate
              viewType="venue"
            />
          );
        })}
      </div>
    </>
  );
}
