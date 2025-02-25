import React, { useEffect } from "react";
import { useAppSelector } from "../hooks";
import { useGetAllVenuesQuery } from "../Redux/API/PublicAPI";
import ManageVenueCard from "../Components/Cards/ManageVenueCard";
import Button from "../Components/Buttons/Button";
import { openModal } from "../Redux/UI/UISlice";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import { renderPageTitle } from "../Helpers/HelperFunctions";

export default function ManageVenues() {
  const userVenues = useAppSelector((state) => state.user.data.venues);
  const venues = useGetAllVenuesQuery();

  useEffect(() => {
    renderPageTitle("Venues");
  }, []);

  return (
    <div className="flex min-w-full h-full min-h-full max-h-full justify-center flex-col flex-grow">
      <LoadingWrapper queryResponse={[venues]}>
        <div className="flex justify-center mb-2">
          <h1 className="text-5xl font-black text-center">Your Venues</h1>
        </div>
        <div className="flex justify-center">
          <Button
            inline
            className="bg-amber-500 text-white"
            action={openModal({
              status: true,
              component: "CreateVenue",
              data: {},
            })}
          >
            New Venue
          </Button>
        </div>

        <div className="flex overflow-auto w-full flex-fix gap-4 pl-8 my-8">
          {userVenues.map((venueID: string) => {
            return <ManageVenueCard venueID={venueID}></ManageVenueCard>;
          })}
        </div>
      </LoadingWrapper>
    </div>
  );
}
