import React, { useEffect, useState } from "react";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import ProfileView from "./ProfileView";
import {
  parseProfileData,
  renderPageTitle,
  sortShowsByDate,
} from "../../Helpers/HelperFunctions";
import { useAppSelector } from "../../hooks";
import LoadingWrapper from "../../Components/Layout/LoadingWrapper";
import { Show } from "../../Helpers/shared/Models/Show";

interface IVenueProfileProp {
  type: string;
  profileID: string;
}

export default function VenueProfile(props: IVenueProfileProp) {
  const displayUID = useAppSelector((state) => state.user.data.displayUID);
  const type = props.type;
  const venueID = props.profileID;
  const [profileData, setProfileData] = useState<any>();
  const user = useAppSelector((state) => state.user.data);
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[venueID];
  const shows = useGetAllShowsQuery();
  const showList = sortShowsByDate(shows ? shows.data! : {});
  const [upcomingShowsList, setUpcoming] = useState<any>();

  useEffect(() => {
    if (venue) {
      renderPageTitle(venue.name);
    }
  }, [venue]);

  useEffect(() => {
    if (venues.data?.[venueID!] && venueID !== profileData?.id) {
      setProfileData(parseProfileData("venue", venues?.data[venueID!]));
    }
  }, [venueID, venues.fulfilledTimeStamp]);

  useEffect(() => {
    if (shows?.data) {
      let upcomingShows = showList.filter((show) => {
        if (
          show.venueID === venueID &&
          show.published &&
          new Date(show.endtime).getTime() > Date.now()
        ) {
          return show;
        }

        return false;
      });
      setUpcoming(upcomingShows);
    }
  }, [shows?.data]);

  return (
    <LoadingWrapper queryResponse={[venues]}>
      <ProfileView
        user={user}
        venue={venue}
        type={type}
        self={displayUID === venueID}
        shows={upcomingShowsList}
        {...profileData}
        images={venue?.images || venue?.media}
      />
    </LoadingWrapper>
  );
}
