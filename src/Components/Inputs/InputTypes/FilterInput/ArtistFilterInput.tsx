import React, { useEffect, useState } from "react";
import { useGetAllArtistsQuery } from "../../../../Redux/API/PublicAPI";
import FilterInputDisplay from "./FilterInputDisplay";
import { FormKeys } from "../../../../Redux/User/UserSlice";

export default function ArtistFilterInput(props: {
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
  const artists = useGetAllArtistsQuery();
  const [artistsArray, setArtistsArray] = useState([]);

  useEffect(() => {
    let artistsArray: { [key: string]: any }[] = [];
    if (!artists.isLoading) {
      Object.keys(artists.data).forEach((artistID) => {
        const artist = artists.data[artistID];
        artistsArray.push(artist);
      });
    }
    setArtistsArray(artistsArray);
  }, [artists.data]);

  return (
    <FilterInputDisplay
      type="artist"
      limit={props.limit}
      placeholder={props.placeholder}
      className={props.className ? props.className : ""}
      data={artistsArray}
      searchParams={
        props.searchParams || ["firstname", "lastname", "stagename"]
      }
      selectFn={props.selectFn}
      field={props.field}
      removeFn={props.removeFn}
      value={props.value}
      defaultValue={props.defaultValue}
      form={props.form}
      dataObject={artists.data}
    />
  );
}
