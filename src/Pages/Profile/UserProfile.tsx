import React, { useEffect, useState } from "react";
import {
  useGetAllArtistsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
  useGetUsersQuery,
} from "../../Redux/API/PublicAPI";
import ProfileView from "./ProfileView";
import {
  getArtistShows,
  parseProfileData,
} from "../../Helpers/HelperFunctions";
import { useAppSelector } from "../../hooks";
import LoadingWrapper from "../../Components/Layout/LoadingWrapper";
import { sortByShowDate } from "../../Helpers/SortingFunctions/ShowSortingFunctions";
import { Type } from "../../Helpers/shared/Models/Type";

interface IUserProfile {
  profileID: string;
  venue?: string[];
}

export default function UserProfile(props: IUserProfile) {
  const artists = useGetAllArtistsQuery();
  const [skip, setSkip] = useState(true);
  const [type, setType] = useState<Type>("artist");
  const user = useGetUsersQuery([props.profileID], { skip: skip });
  const artist =
    artists?.data?.[props.profileID] || user?.data?.[props.profileID];
  useEffect(() => {
    if (!artist && artists.isSuccess) {
      setType("user");
      setSkip(false);
    }
  }, [artists.fulfilledTimeStamp]);
  const displayUID = useAppSelector((state) => state.user.data.displayUID);
  const { profileID } = props;
  const viewingUser = useAppSelector((state) => state.user.data);
  const venues = useGetAllVenuesQuery();
  const shows = useGetAllShowsQuery();
  const [profileData, setProfileData] = useState<any>();
  const [upcomingShows, setUpcomingShows] = useState<any>();

  useEffect(() => {
    if (shows.isSuccess) {
      let artistShows = getArtistShows(shows.data, profileID, true, true)[
        "performing"
      ];
      artistShows.sort(sortByShowDate);
      setUpcomingShows(artistShows);
    }
  }, [shows, profileID, artists.fulfilledTimeStamp]);

  useEffect(() => {}, [profileData]);

  useEffect(() => {
    if (artist && profileID) {
      setProfileData(parseProfileData(type, artist, venues.data));
    }
  }, [profileID, artists.fulfilledTimeStamp, artist]);
  return (
    <LoadingWrapper queryResponse={[artists]}>
      <ProfileView
        user={viewingUser}
        venue={props.venue}
        self={displayUID === profileID}
        shows={upcomingShows}
        {...profileData}
      />
    </LoadingWrapper>
  );
}
