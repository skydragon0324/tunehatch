import React, { useEffect, useState } from "react";
// import Card from "../Layout/Card";
import dayjs from "dayjs";
import {
  displayAgeLabel,
  displayTicketPrice,
} from "../../Helpers/HelperFunctions";

import { useGetAllVenuesQuery } from "../../Redux/API/PublicAPI";
import IconLabel from "../Labels/IconLabel";
import Img from "../Images/Img";
import { IMAGE_URL } from "../../Helpers/configConstants";
import BROKEN_IMAGE from "../../Images/ChickLogo.png";
import Button from "../Buttons/Button";
import { Showrunner } from "../../Helpers/shared/Models/Showrunner";
import { Show } from "../../Helpers/shared/Models/Show";
// import LabelButton from "../Buttons/LabelButton";
// import { openModal } from "../../Redux/UI/UISlice";
export default function ShowTile(props: {
  show: Show;
  venueID?: string;
  showrunner?: Showrunner[];
  calTag?: object;
  name?: string;
  type?: string;
  past?: boolean;
  _key?: string;
  performing?: boolean;
  invited?: boolean;
}) {
  const [showDate, setShowDate] = useState(null);
  const [showStartTime, setShowStartTime] = useState(null);
  const ticketPrice = displayTicketPrice(props.show);
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[props.venueID!];

  useEffect(() => {
    if (props.show) {
      const humanTimestamp = dayjs(props.show.starttime);
      const month = humanTimestamp.format("MMMM");
      const date = humanTimestamp.format("D");
      const hour = humanTimestamp.format("hA");

      setShowStartTime(hour);
      setShowDate(month + " " + date);
    }
  }, [props.show]);

  return (
    <>
      <div className="justify-self-start w-1/4 mt-2 ">
        <IconLabel
          className="text-sm font-black"
          icon="schedule"
        >{`${showDate}\n at ${showStartTime}`}</IconLabel>
      </div>
      <div className="flex flex-col w-full border-b items-center">
        <div className="p-3">
          {venue && (
            <Img
              src={venue?.avatar ? IMAGE_URL + venue.avatar : BROKEN_IMAGE}
              className="w-48 h-48 mx-auto mb-2 bg-white rounded-full"
            />
          )}
          {props.show && (
            <h1 className="text-lg text-center font-black">
              {props.show.name}
            </h1>
          )}
          <IconLabel className="text-xs" icon="location_on">
            {venue?.name}
          </IconLabel>
        </div>
        <div className="flex flex-row">
          <IconLabel className="text-xs pr-2" icon="local_activity">
            {ticketPrice}
          </IconLabel>
          <IconLabel className="text-xs" icon="universal_currency">
            {displayAgeLabel({ ...props.show })}
          </IconLabel>
        </div>
        <div className="flex p-2 ">
          <Button className="" link={"/shows/" + props._key}>
            Details
          </Button>
        </div>
        {/* add conditional for showing this */}
        {/* <div className="flex p-2 ">
    <LabelButton onClick={openModal({ status: true, component: "ManageShow" })} className="border text-blue-400 border-blue-400" icon="construction">Manage</LabelButton>
    </div> */}
        {/* update components in these modals */}
        <div className="flex p-2 ">
          {/* <LabelButton onClick={openModal({ status: true, component: "ManageShow" })} className="border text-red-400 border-red-400" icon="construction">Cancel Application</LabelButton> */}
          {/* <LabelButton onClick={openModal({ status: true, component: "ManageShow" })} className="border text-amber-400 border-amber-400" icon="construction">Edit Show</LabelButton> */}
        </div>
      </div>
    </>
  );
}
