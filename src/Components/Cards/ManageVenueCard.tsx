import React from "react";
import Card from "../Layout/Card";
import Button from "../Buttons/Button";
import { useGetAllVenuesQuery } from "../../Redux/API/PublicAPI";
import Img from "../Images/Img";
import { Link } from "react-router-dom";

export default function ManageVenueCard(props: { venueID: string }) {
  //todo: refactor for better loading
  const venues = useGetAllVenuesQuery();
  const venue = venues?.data?.[props.venueID];
  return venue?.name ? (
    <Card className="w-64 flex-fix">
      <div className="md:p-2 flex min-w-full flex-wrap">
        <div className="flex flex-col overflow-hidden w-full flex-fix min-w-1/4 items-center justify-center text-center ">
          <Img className="w-full h-64" src={venue.avatar} />
        </div>
        <div className="flex-col p-4 flex-grow min-w-full">
          <h2 className="text-2xl font-black text-center truncate-2 h-20">
            {venue.name}
          </h2>
        </div>
        <div className="flex  md:flex-col gap-2 flex-grow md:flex-grow-0 ">
          <Link to={props.venueID} className="min-w-full flex justify-content">
            <Button full inline>
              Manage
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  ) : (
    <></>
  );
}
