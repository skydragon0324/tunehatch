import React, { useEffect, useState } from "react";
import CalendarDay from "../Components/CalendarDay";
import { useGetAllShowsQuery } from "../Redux/API/PublicAPI";
import { MONTH_LABELS } from "../Helpers/configConstants";
// import { useGetShowPayoutStatusQuery } from "../Redux/API/VenueAPI";
// import useWindowDimensions, { useAppSelector } from "../hooks";
import { Type } from "../Helpers/shared/Models/Type";
import { Show } from "../Helpers/shared/Models/Show";

export default function ShowCalendar(props: {
  filterFn?: (val: Show, startDate: number, endDate: number) => boolean;
  venueID?: string;
  showrunnerID?: string;
  viewType?: Type;
}) {
  const shows = useGetAllShowsQuery();
  // const user = useAppSelector((state) => state.user.data);
  const [date, setDate] = useState(new Date());
  const [showsArray, setShowsArray] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    MONTH_LABELS[date.getMonth()]
  );
  const [currentYear, setCurrentYear] = useState(date.getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [daysInMonth, setDaysInMonth] = useState<number[]>();
  const [startDaysOfMonth, setStartDaysOfMonth] = useState<number[]>();
  const [remainderDays, setRemainderDays] = useState<number[]>();
  console.log(showsArray);
  const getCalendarGrid = () => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let currentMonth = new Date(year, month, 0);
    const numberOfDaysInMonth = currentMonth.getDate();
    currentMonth.setDate(1);
    var beginningDayOfMonth = currentMonth.getDay();
    var daysInMonth = Array.from(Array(numberOfDaysInMonth).keys());
    var startDaysOfMonth = Array.from(Array(beginningDayOfMonth).keys());
    const remainderMath = Math.abs(
      ((beginningDayOfMonth + numberOfDaysInMonth) % 7) - 7
    );
    const remainderDays = Array.from(Array(remainderMath).keys());
    daysInMonth.push(daysInMonth.length);
    daysInMonth.shift();
    setDaysInMonth(daysInMonth);
    setStartDaysOfMonth(startDaysOfMonth);
    setRemainderDays(remainderDays);
  };

  const changeMonth = (direction: "next" | "back") => {
    console.log("changeMonth called");
    var newDate;
    console.log(date, "date");
    if (direction === "next") {
      newDate = new Date(date.setDate(1));
      newDate.setMonth(date.getMonth() + 1);
    } else {
      newDate = new Date(date.setDate(1));
      newDate.setMonth(date.getMonth() - 1);
    }
    setDate(newDate);
    console.log(newDate, "newDate");
  };

  useEffect(() => {
    if (shows.data && props.filterFn) {
      let showsArray: Show[] = [];
      Object.keys(shows.data)?.forEach((showID) => {
        let show = shows.data[showID];
        if (show) {
          showsArray.push(show);
        }
      });
      setShowsArray(showsArray);
    }
  }, [shows.data]);
  useEffect(() => {
    console.log(date);
    console.log(date.getMonth());
    setCurrentMonth(MONTH_LABELS[date.getMonth()]);
    setCurrentYear(date.getFullYear());
    getCalendarGrid();
  }, [date]);
  return (props.venueID || props.showrunnerID) && remainderDays ? (
    <>
      <div className="flex justify-center items-center">
        <div className="flex items-center">
          <i
            className="material-symbols-outlined"
            onClick={(e) => changeMonth("back")}
          >
            chevron_left
          </i>
        </div>
        <div className="w-52">
          <h1 className="text-2xl font-black text-center ">
            {currentMonth} {currentYear}
          </h1>
        </div>
        <div className="flex items-center">
          <i
            className="material-symbols-outlined"
            onClick={(e) => changeMonth("next")}
          >
            chevron_right
          </i>
        </div>
      </div>
      <div className="w-full m-1 md:w-11/12 md:mx-auto h-full border grid grid-cols-7 rounded-md">
        <div>
          <p className="text-xs md:text-base font-bold text-center">Sun</p>
        </div>
        <div>
          <p className="text-xs md:text-base font-bold text-center">Mon</p>
        </div>
        <div>
          <p className="text-xs md:text-base font-bold text-center">Tue</p>
        </div>
        <div>
          <p className="text-xs md:text-base font-bold text-center">Wed</p>
        </div>
        <div>
          <p className="text-xs md:text-base font-bold text-center">Thu</p>
        </div>
        <div>
          <p className="text-xs md:text-base font-bold text-center">Fri</p>
        </div>
        <div>
          <p className="text-xs md:text-base font-bold text-center">Sat</p>
        </div>
        {startDaysOfMonth.map((day) => {
          return <CalendarDay key={"startOffset/" + day} offset />;
        })}
        {daysInMonth.map((day) => {
          return (
            <CalendarDay
              viewType={props.viewType || "user"}
              key={"calendarDay/" + day}
              openDrawer
              shows={showsArray}
              filterFn={props.filterFn}
              venueID={props.venueID}
              showrunnerID={props.showrunnerID}
              selected={day === selectedDay}
              date={new Date(date).setDate(day)}
              onClick={() => setSelectedDay(day)}
              day={day}
            />
          );
        })}
        {remainderDays.map((day) => {
          return <CalendarDay key={"endOffset/" + day} offset />;
        })}
      </div>
    </>
  ) : (
    <></>
  );
}
