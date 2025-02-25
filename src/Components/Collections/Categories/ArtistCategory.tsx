import React, { useMemo } from "react";
import { useGetAllArtistsQuery } from "../../../Redux/API/PublicAPI";
import ArtistCard from "../../Cards/ArtistCard/ArtistCard";

export default function ArtistCategory(props: {
  title?: string;
  conditionFn?: (val: any) => boolean;
  sortFn?: (val: any, val2: any) => number;
  maxLength?: number;
  minLength?: number;
  hideIfHatchy?: boolean;
}) {
  const artists = useGetAllArtistsQuery();
  // const [minLength, setMinLength] = useState(props.minLength || 0);
  const minLength = useMemo(() => props.minLength || 0, [props.minLength]);
  // const [artistArray, setArtistArray] = useState([]);

  // const refreshCategory = () => {};

  const artistArray = useMemo(() => {
    let tArray: { [key: string]: any }[] = [];
    if (artists.data) {
      Object.keys(artists.data)?.forEach((artist) => {
        tArray.push(artists.data[artist]);
      });
    }
    if (props.conditionFn && props.conditionFn !== undefined) {
      tArray = tArray.filter(props.conditionFn);
    } else if (props.sortFn) {
      tArray = tArray.sort(props.sortFn);
    }
    return tArray;
  }, [artists.data, props.conditionFn, props.sortFn]);

  // useEffect(() => {
  //   refreshCategory();
  // }, [artists.data]);

  // useEffect(() => {
  //   refreshCategory();
  // }, []);
  return (
    <>
      {artistArray.length && artistArray.length >= minLength ? (
        <div className="w-full">
          <h1 className="text-2xl pl-2 mb-1 font-black">{props.title}</h1>
          <div
            className={"w-full flex flex-nowrap overflow-auto gap-2 pl-4 pr-6"}
          >
            {artistArray.map((artist, i) => {
              if (!props.maxLength || i <= props.maxLength) {
                return (
                  <ArtistCard hideIfHatchy={props.hideIfHatchy} key={artist._key + "/" + i} id={artist._key} />
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
