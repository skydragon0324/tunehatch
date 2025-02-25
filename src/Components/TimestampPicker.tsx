import React, { useCallback, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useAppDispatch, useAppSelector } from "../hooks";
import { FormKeys, formUpdate } from "../Redux/User/UserSlice";
import { addStatusMessage } from "../Redux/UI/UISlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
// import LoadingSpinner from "./LoadingSpinner";

export default function TimestampPicker(props: {
  form?: FormKeys;
  field: string;
  className?: string;
  label?: string;
  allowPast?: boolean;
  defaultValue?: Date | string; // update this
  mustBeAfter?: string;
  mustBeBefore?: string;
  offset?: string;
  timezone?: string;
  // onChange?: (e: React) => void;
  error?: boolean;
}) {
  const form = useAppSelector((state) => state.user.forms[props.form]);
  const dispatch = useAppDispatch();
  // var [defaultDate, setDefaultDate] = useState<Date>();

  const getLocalTimeWithUTCOffset = useCallback((time: number) => {
    return dayjs(new Date(time)).tz(props.timezone || "America/Chicago").format("YYYY-MM-DDTHH:mm:ssZ");
  }, []);

  const checkForConflicts = () => {
    if (form?.[props.mustBeAfter!] && props.mustBeAfter) {
      let mustBeAfterDate = new Date(form?.[props.mustBeAfter]);
      let currentDate = new Date(form?.[props.field]);
      if (mustBeAfterDate.getTime() > currentDate.getTime()) {
        let newDate = new Date(mustBeAfterDate);
        newDate.setHours(mustBeAfterDate.getHours() + 2);
        dispatch(
          formUpdate({
            form: props.form,
            field: props.field,
            // value: new Date(newDate.getTime()).toISOString(),
            value: getLocalTimeWithUTCOffset(newDate.getTime()),
          })
        );
      }
    }
  };

  useEffect(() => {
    checkForConflicts();
  }, [form?.[props.mustBeAfter!], form?.[props.field]]);

  const updateDate = (date: Date) => {
    if (new Date(date).getTime() < Date.now() && !props.allowPast) {
      dispatch(
        addStatusMessage({
          type: "info",
          message: "You must use a future date when creating a show.",
        })
      );
    } else {
      dispatch(
        formUpdate({
          form: props.form,
          field: props.field,
          // value: new Date(date.getTime()).toISOString(),
          value: getLocalTimeWithUTCOffset(date.getTime()),
        })
      );
    }
  };

  useEffect(() => {
    var date = new Date();
    console.log("set initial date", props.defaultValue);
    if (props.defaultValue) {
      date = new Date(props.defaultValue);
    } else {
      date = new Date(date.setDate(date.getDate() + 7));

      if (!props.mustBeAfter) {
        date.setHours(18, 0, 0, 0);
      } else {
        date.setHours(20, 0, 0, 0);
      }
    }

    updateDate(date);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Remind after 8 hours */}
      <div
        className={`transition-all rounded ${
          props.mustBeBefore &&
          new Date(form?.[props.mustBeBefore]).getTime() -
            new Date(form?.[props.field]).getTime() >=
            28800000
            ? "m-1 p-2 bg-gray-50 border"
            : "h-0 p-0 m-0"
        }`}
      >
        {props.mustBeBefore &&
          new Date(form?.[props.mustBeBefore]).getTime() -
            new Date(form?.[props.field]).getTime() >=
            28800000 && (
            <>
              <p className="text-sm font-bold text-center">
                This is a pretty long show!
              </p>
              <p className="text-center text-xs">
                This show is currently set to be{" "}
                {Math.trunc(
                  (new Date(form?.[props.mustBeBefore]).getTime() -
                    new Date(form?.[props.field]).getTime()) /
                    3600000
                )}{" "}
                hours long. <br />
                If this is intentional, please continue normally. Otherwise,
                double-check your start and end dates and double-check that they
                are entered correctly.
              </p>
            </>
          )}
      </div>
      {form?.[props.field] ? (
        <DatePicker
          wrapperClassName="w-full react-datepicker-override"
          className={`text-lg border-b-2 p-0 max-w-full w-full rounded focus:border-orange peer 
      ${props.error ? "border-red-400" : ""}
      ${props.className ? props.className : ""}`}
          showIcon
          onChange={(date) => {
            // console.log(date)
            if (date) {
              updateDate(new Date(date));
            }
          }}
          selected={new Date(form?.[props.field])}
          showTimeSelect
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      ) : (
        <input />
      )}
    </div>
  );
}
