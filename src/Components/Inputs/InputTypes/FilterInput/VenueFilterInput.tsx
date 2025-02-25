import React, { useEffect, useState } from "react";
import { useGetAllVenuesQuery } from "../../../../Redux/API/PublicAPI";
import FilterInputDisplay from "./FilterInputDisplay";
import { FormKeys } from "../../../../Redux/User/UserSlice";

export default function VenueFilterInput(props: {
  searchParams?: string[];
  className?: string;
  limit?: number;
  placeholder?: string;
  selectFn?: any;
  removeFn?: any;
  value: any[];
  defaultValue?: any[];
  form?: FormKeys;
  field?: string;
}) {
  const venues = useGetAllVenuesQuery();
  const [venuesArray, setVenuesArray] = useState([]);

  useEffect(() => {
    let v: { [key: string]: any }[] = [];

    if (!venues.isLoading) {
      Object.keys(venues.data).forEach((id) => {
        const showrunner = venues.data[id];
        v.push(showrunner);
      });
    }

    setVenuesArray(v);
  }, [venues.isLoading, venues.data]);

  return (
    <FilterInputDisplay
      type="venue"
      limit={props.limit}
      placeholder={props.placeholder}
      className={props.className ? props.className : ""}
      data={venuesArray}
      searchParams={props.searchParams || ["name"]}
      selectFn={props.selectFn}
      field={props.field}
      removeFn={props.removeFn}
      value={props.value}
      form={props.form}
      defaultValue={props.defaultValue}
      dataObject={venues.data}
    />
  );
}
