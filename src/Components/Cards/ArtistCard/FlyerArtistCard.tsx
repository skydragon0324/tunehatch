import React, { useEffect, useState } from "react";
import Card from "../../Layout/Card";
import Img from "../../Images/Img";
import { getArtistName } from "../../../Helpers/HelperFunctions";
import {
  useGetAllArtistsQuery,
  useGetUsersQuery,
} from "../../../Redux/API/PublicAPI";

export default function FlyerArtistCard(props: {
  id: string;
  scale?: number;
  // style?: any;
  baseWidth?: number;
}) {
  const artists = useGetAllArtistsQuery();
  const [skip, setSkip] = useState(true);
  const user = useGetUsersQuery([props.id], { skip: skip });
  const artist = artists?.data?.[props.id] || user?.data?.[props.id];
  useEffect(() => {
    if (!artist && artists.isSuccess) {
      setSkip(false);
    }
  }, [artists.isSuccess]);

  return artist ? (
    <Card
      className="bg-white relative transition-none"
      style={{
        width: props.baseWidth * props.scale + "px",
        minHeight: props.baseWidth * props.scale + "px",
        borderRadius: "5px",
      }}
    >
      <div className="flex flex-grow flex-col justify-center items-center w-full">
        <Img
          src={artist.avatar}
          style={{
            width: props.baseWidth * props.scale + "px",
            height: props.baseWidth * props.scale + "px",
            objectFit: "cover",
          }}
        />
        <div className="flex flex-col w-full flex-grow flex-shrink-0 p-1 justify-center items-center">
          <h1
            className="font-black justify-center text-center"
            style={{ fontSize: (props.baseWidth / 10) * props.scale + "px" }}
          >
            {getArtistName(artist)}
          </h1>
        </div>
      </div>
    </Card>
  ) : (
    <></>
  );
}
