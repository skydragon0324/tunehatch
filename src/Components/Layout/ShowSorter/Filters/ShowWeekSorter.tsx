import React, { useEffect, useState } from "react";
import { useGetAllShowsQuery } from "../../../../Redux/API/PublicAPI";
import dayjs from "dayjs";
import { Show } from "../../../../Helpers/shared/Models/Show";
import Card from "../../Card";

export default function ShowWeekSorter(props: { shows: any; updateFn: any; filtersActive: boolean }) {
  const shows = props.shows;
  type weekdayCounter = {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
  };

  const initialWeekdayCount: weekdayCounter = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  const [selectedDateObject, setSelectedDateObject] = useState(
    new Date(Date.now())
  );
  const [selectedDate, setSelectedDate] = useState(
    dayjs(Date.now()).format("MMMM YYYY")
  );
  const [selected, setSelected] = useState<string | null>(null);

  const [weekdayCount, setWeekdayCount] =
    useState<weekdayCounter>(initialWeekdayCount);

  const calculateWeekdayCount = () => {
    let availableShows: Array<Show> = [];
    if (shows) {
      Object.keys(shows).forEach((showKey) => {
        let show = shows[showKey];
        if (dayjs(show.starttime).format("MMMM YYYY") === selectedDate) {
          availableShows.push(show);
        }
      });
      let tWeekdayCount = { ...initialWeekdayCount };
      availableShows.map((show: Show) => {
        let starttime = dayjs(show.starttime);
        let weekday: any = starttime.format("dddd");
        tWeekdayCount[weekday as keyof weekdayCounter] =
          tWeekdayCount[weekday as keyof weekdayCounter] + 1;
      });
      console.log(tWeekdayCount);
      setWeekdayCount(tWeekdayCount);
    } else {
      return false;
    }
  };

  useEffect(() => {
    calculateWeekdayCount();
  }, [shows, selectedDate]);

  useEffect(() => {
    if(!props.filtersActive){
        setSelected(null);
    }
  }, [props.filtersActive])

  const changeMonth = (direction: string) => {
    console.log("changeMonth called");
    var newDate;
    console.log(selectedDateObject, "date");
    if (direction === "next") {
      newDate = new Date(selectedDateObject.setDate(1));
      newDate.setMonth(selectedDateObject.getMonth() + 1);
    } else {
      newDate = new Date(selectedDateObject.setDate(1));
      newDate.setMonth(selectedDateObject.getMonth() - 1);
    }
    setSelectedDateObject(newDate);
    setSelectedDate(dayjs(newDate).format("MMMM YYYY"));
    console.log(newDate, "newDate");
  };

  return (
    <>
      <div className="w-full">
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
            <h1 className="text-2xl font-black text-center ">{selectedDate}</h1>
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
        <div className="w-full p-4 overflow-x-scroll snap-x focus:scroll-auto">
          <div className="flex flex-row gap-3 min-w-full md:justify-center">
            {Object.keys(weekdayCount).map((weekday) => {
              if (!selected || selected === weekday) {
                return (
                  <Card
                    key={weekday}
                    className={`${
                      selected === weekday ? "border-2 border-orange" : ""
                    } rounded-xl gap-2 h-24 w-24 text-center border hover:shadow flex flex-col items-center justify-center transition-shadow hover:cursor-pointer`}
                    onClick={() => {
                      if (props.updateFn) {
                        props.updateFn(selected === weekday ? null : weekday);
                        setSelected(selected === weekday ? null : weekday);
                      } else {
                        return null;
                      }
                    }}
                  >
                    <p>{weekday}</p>
                    <div className={`p-4 rounded-full ${weekdayCount[weekday as keyof weekdayCounter] > 0 ? "bg-blue-500" : "bg-gray-300"} bg-blue-500 text-white w-12 h-12 flex items-center justify-center`}>
                      <p>
                        {String(weekdayCount[weekday as keyof weekdayCounter])}
                      </p>
                    </div>
                  </Card>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}
