import React, { useEffect } from "react";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import { useParams } from "react-router-dom";
import ShowCalendar from "../Tools/ShowCalendar";
import ManageShowsList from "../Tools/Venue/ManageShowsList";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import LabelButton from "../Components/Buttons/LabelButton";
import { openModal } from "../Redux/UI/UISlice";
import { FilterByShowTime } from "../Helpers/FilterFunctions/ShowFilterFunctions";
import Button from "../Components/Buttons/Button";
import { renderPageTitle } from "../Helpers/HelperFunctions";

export default function VenueDashboard() {
  const { venueID } = useParams();
  const venues = useGetAllVenuesQuery();
  const shows = useGetAllShowsQuery();
  const venue = venues.data?.[venueID!];

  useEffect(() => {
    if (venue) {
      renderPageTitle("Manage " + venue.name);
    }
  }, [venue]);

  return (
    <LoadingWrapper queryResponse={[venues, shows]}>
      {venue && (
        <>
          <div>
            <h1 className="text-2xl font-black text-center">{venue.name}</h1>
            <h2 className="text-sm font-black text-center">
              {venue?.location?.address}, <br />
              {venue?.location?.city} {venue?.location?.state}
            </h2>
            <div className="flex flex-row justify-center mt-2 gap-2">
              <Button
                className="text-xs text-white border bg-amber-400"
                action={openModal({
                  status: true,
                  component: "EditVenueProfile",
                  data: { venueID },
                })}
              >
                Edit Venue
              </Button>
              <Button
                className="text-xs text-white border bg-red-400"
                action={openModal({
                  status: true,
                  component: "EditVenueToolbox",
                  data: { venueID },
                })}
              >
                Venue Toolbox
              </Button>
              <Button
                inline
                className="text-xs text-white border bg-blue-400"
                link={"/venues/" + venueID}
              >
                Venue Page
              </Button>
            </div>
            <div className="flex justify-center m-2">
              <LabelButton
                className="text-sm text-gray-500 border border-gray-500"
                iconClassName="text-base"
                icon="add"
                action={openModal({
                  status: true,
                  component: "CreateShow",
                  data: { venueID },
                })}
              >
                New Show
              </LabelButton>
            </div>
          </div>
          <ShowCalendar
            venueID={venueID}
            viewType="venue"
            filterFn={FilterByShowTime}
          />
          <ManageShowsList venueID={venueID} />
        </>
      )}
    </LoadingWrapper>
  );
}
