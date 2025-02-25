import React, { useEffect, useState } from "react";
import {
  // useGetAllArtistsQuery,
  useGetAllShowrunnerGroupsQuery,
} from "../../../../Redux/API/PublicAPI";
import FilterInputDisplay from "./FilterInputDisplay";
import { FormKeys } from "../../../../Redux/User/UserSlice";

export default function ShowrunnerFilterInput(props: {
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
  const showrunners = useGetAllShowrunnerGroupsQuery();
  const [showrunnersArray, setShowrunnersArray] = useState([]);

  useEffect(() => {
    let showrunnersArray: { [key: string]: any }[] = [];
    if (!showrunners.isLoading) {
      Object.keys(showrunners.data).forEach((SRID) => {
        const showrunner = showrunners.data[SRID];
        showrunnersArray.push(showrunner);
      });
    }
    setShowrunnersArray(showrunnersArray);
  }, [showrunners.data]);

  return (
    <FilterInputDisplay
      type="showrunner"
      limit={props.limit}
      placeholder={props.placeholder}
      className={props.className ? props.className : ""}
      data={showrunnersArray}
      searchParams={props.searchParams || ["name"]}
      selectFn={props.selectFn}
      field={props.field}
      removeFn={props.removeFn}
      value={props.value}
      form={props.form}
      defaultValue={props.defaultValue}
      dataObject={showrunners.data}
    />
  );
}
