import React from "react";
import { useAppSelector } from "../../hooks";
import dayjs from "dayjs";
import FormInput from "../../Components/Inputs/FormInput";
// dayjs.extend(weekday)

export default function RepeatingShowForm(props: { form: string }) {
  const form = useAppSelector((state) => state.user.forms[props.form]);
  const startdate = dayjs(form?.starttime);
  return (
    <>
      <div className="w-full col-span-6 rounded bg-gray-50 border p-2">
        <h3 className="text-center text-lg font-black">
          Repeating Show Options
        </h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <p>This show will repeat</p>
          <FormInput
            form={props.form}
            prerequisite={form?.["meta.repeatingShow"] === true}
            field="meta.repeatType"
            fieldType="dropdown"
            defaultValue={form?.["meta.repeatType"] || "weekly"}
            className="bg-orange rounded-full text-white p-1 pr-0"
            containerClassName="pt-0"
            label={false}
            optionMap={{
              weekly: "Weekly",
              monthly: "Monthly",
            }}
          />
          <p>on</p>
          <b>{startdate ? startdate.format("dddd") + "s" : ""}</b>
          <p>and will repeat</p>
          <FormInput
            form={props.form}
            field="meta.repeatNumber"
            prerequisite={form?.["meta.repeatingShow"] === true}
            defaultValue={form?.["meta.repeatNumber"] || 4}
            fieldType="dropdown"
            className="bg-orange rounded-full text-white p-1 pr-0"
            containerClassName="pt-0"
            label={false}
            optionMap={{
              1: "1",
              2: "2",
              3: "3",
              4: "4",
              5: "5",
              6: "6",
              7: "7",
              8: "8",
              9: "9",
              10: "10",
              11: "11",
              12: "12",
            }}
          />
          <p>times</p>
        </div>
      </div>
    </>
  );
}
