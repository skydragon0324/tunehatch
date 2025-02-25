import React, { useCallback, useEffect, useState } from "react";
import CalendarDay from "../../../Components/CalendarDay";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import { MONTH_LABELS, PUBLIC_URL } from "../../../Helpers/configConstants";
import { EmbedStyle } from "../../../Helpers/shared/Models/EmbedStyles";
import { useParams } from "react-router-dom";
import { FilterByShowTime } from "../../../Helpers/FilterFunctions/ShowFilterFunctions";
import dayjs from "dayjs";
import {
  getShowDate,
} from "../../../Helpers/HelperFunctions";
import { getVenueLocationCode } from "../../../Helpers/shared/getVenueLocationCode";
import PoweredByTuneHatch from "../../../Components/Labels/PoweredByTuneHatch";
import { useAppDispatch } from "../../../hooks";
import { setFullscreen } from "../../../Redux/UI/UISlice";
import { Show } from "../../../Helpers/shared/Models/Show";
import { useGetActiveRegionsQuery } from "../../../Redux/API/RegionAPI";
import calculateEventTime from "../../../Helpers/shared/calculateEventTime";
import { Showrunner } from "../../../Helpers/shared/Models/Showrunner";

export default function ShowCalendarEmbed(props: {
  venueID?: string;
  SRID?: string;
}) {
  var { venueID, SRID, styleOptions } = useParams();
  const dispatch = useAppDispatch();
  venueID = props.venueID || venueID;
  SRID = props.SRID || SRID;
  const [styles, setStyles] = useState<EmbedStyle>({});
  const shows = useGetAllShowsQuery();
  const [date, setDate] = useState(new Date());
  const [showsArray, setShowsArray] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    MONTH_LABELS[date.getMonth()]
  );
  const venues = useGetAllVenuesQuery();
  const venue = venues?.data?.[props.venueID];

  const activeRegions = useGetActiveRegionsQuery();
  const regions = activeRegions.data;
  const regionCode = getVenueLocationCode(venue);
  const [timezone, setTimezone] = useState("America/Chicago");
  useEffect(() => {
    if (regions && regionCode) {
      regions.forEach((region) => {
        if (region.locations.includes(regionCode)) {
          setTimezone(region.timezone);
        }
      });
    }
  }, [regions, regionCode]);
  const getDisplayTime = useCallback((show: object, timezone: string) => {
    return calculateEventTime(show, timezone);
  }, []);

  const [selectedShows, setSelectedShows] = useState([]);
  const [currentYear, setCurrentYear] = useState(date.getFullYear());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>();
  const [startDaysOfMonth, setStartDaysOfMonth] = useState<number[]>();
  const [remainderDays, setRemainderDays] = useState<number[]>();
  useEffect(() => {
    dispatch(setFullscreen({ status: true }));
  });
  const parseStyles = () => {
    if (styleOptions) {
      let ts: { [key: string]: any } = {};
      let tso = styleOptions.split("&");
      tso.forEach((style) => {
        try {
          let styleValue: string | boolean = "";
          let [styleKey, tValue] = style.split("=");
          if (tValue === "true") {
            styleValue = true;
          } else if (tValue === "false") {
            styleValue = false;
          } else {
            styleValue = tValue;
          }
          ts[styleKey] = styleValue;
          console.log(ts[styleKey]);
        } catch (err) {
          console.log(err);
        }
      });
      setStyles(ts);
    }
  };

  useEffect(() => {
    parseStyles();
  }, []);

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

  const isShowFit = useCallback(
    (show: Show) => {
      return (
        (venueID != null && show.venueID === venueID) ||
        (SRID != null &&
          show.showrunner?.find(
            (showrunner: { uid?: string; id?: string; _key?: string }) =>
              showrunner.id === SRID ||
              showrunner.uid === SRID ||
              showrunner._key === SRID
          ) != null)
      );
    },
    [venueID, SRID]
  );

  const changeMonth = (direction: string) => {
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
    if (shows.data) {
      let showsArray: Show[] = [];
      Object.keys(shows.data)?.forEach((showID) => {
        let show = shows.data[showID];

        if (show?.published && isShowFit(show)) {
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
  useEffect(() => {
    if (selectedDay && showsArray.length) {
      let selectedDate = new Date(date).setDate(selectedDay);
      let newStartDate = new Date(selectedDate).setHours(0, 0, 0, 0);
      let newEndDate = new Date(selectedDate).setHours(23, 59, 59, 59);
      setSelectedDate(dayjs(selectedDate));
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      if (showsArray) {
        setSelectedShows(
          showsArray.filter((show) =>
            FilterByShowTime(show, newStartDate, newEndDate)
          )
        );
      }
    }
  }, [selectedDay, showsArray]);
  console.log(selectedShows, "selectedShows");
  return (venueID || SRID) && remainderDays ? (
    <div className={`${styles.darkMode ? "dark" : ""}`}>
      <div className={`flex justify-center items-center dark:text-white`}>
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
      <div className="w-full m-1 md:w-11/12 md:mx-auto h-full grid grid-cols-7 rounded-md dark:text-white">
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
          return (
            <CalendarDay
              circle={!styles.classic}
              key={"startOffset/" + day}
              offset
            />
          );
        })}
        {daysInMonth.map((day) => {
          // console.log(showsArray)
          return (
            <CalendarDay
              circle={!styles.classic}
              key={"calendarDay/" + day}
              shows={showsArray}
              filterFn={(show: Show, startDate: number, endDate: number) =>
                isShowFit(show) && FilterByShowTime(show, startDate, endDate)
              }
              venueID={venueID}
              showrunnerID={SRID}
              selected={day === selectedDay}
              date={new Date(date).setDate(day)}
              onClick={() => setSelectedDay(day)}
              day={day}
              external
            />
          );
        })}
        {remainderDays.map((day) => {
          return (
            <CalendarDay
              circle={!styles.classic}
              key={"endOffset/" + day}
              offset
            />
          );
        })}
      </div>
      {!styles.classic && selectedDate && (
        <>
          <p className="text-center">
            Shows for {selectedDate.format("MMMM DD")}
          </p>
          <div className="flex flex-col items-center">
            {selectedShows.length ? (
              selectedShows.map((show) => {
                let showDate = getDisplayTime(show, timezone);
                return (
                  <a
                    className="dark:text-white text-center text-lg underline underline-offset-2"
                    target="_blank"
                    rel="noreferrer"
                    href={PUBLIC_URL + "/shows/" + show._key}
                  >
                    {showDate.startdate.fragments.hour} - {show.name} - Tickets
                  </a>
                );
              })
            ) : (
              <p>No shows</p>
            )}
          </div>
        </>
      )}
      <PoweredByTuneHatch />
    </div>
  ) : (
    <></>
  );
}
