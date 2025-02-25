import React from "react";
import { useGetAllVenuesQuery } from "../../Redux/API/PublicAPI";
import Card from "../Layout/Card";
import Img from "../Images/Img";
import Button from "../Buttons/Button";
import { openSidebar } from "../../Redux/UI/UISlice";
// import InfoLabel from "../Labels/InfoLabel";

export default function VenueCard(props: { id: string }) {
  const venues = useGetAllVenuesQuery();
  const venue = venues?.data?.[props.id];
  return venue ? (
    <>
      <Card className="w-48">
        <div className="flex flex-col justify-center items-center w-full">
          <Img src={venue.avatar} className="w-36 h-36 p-4 rounded-full" />
          <div className="flex flex-col w-full flex-grow p-4">
            <h1 className="text-xl font-black justify-center text-center">
              {venue.name}
            </h1>
          </div>
          <Button
            inline
            className="bg-blue-500 w-full text-white rounded-tr-none rounded-tl-none"
            action={openSidebar({
              status: true,
              component: "ViewProfile",
              data: { profileID: props.id, type: "venue" },
            })}
          >
            Venue Page
          </Button>
        </div>
      </Card>
    </>
  ) : (
    <></>
  );
}
