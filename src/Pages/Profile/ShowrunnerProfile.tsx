import React, { useEffect, useState } from "react";
import ProfileView from "./ProfileView";
import {
  parseProfileData,
  sortShowsByDate,
  upcomingSRApps,
} from "../../Helpers/HelperFunctions";
import { useAppSelector } from "../../hooks";
import {
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
} from "../../Redux/API/PublicAPI";
import LoadingWrapper from "../../Components/Layout/LoadingWrapper";
import { Show } from "../../Helpers/shared/Models/Show";

interface IShowrunnerProfileProps {
  // type?: any;
  profileID: string;
}

export default function ShowrunnerProfile(props: IShowrunnerProfileProps) {
  const displayUID = useAppSelector((state) => state.user.data.displayUID);
  const user = useAppSelector((state) => state.user.data);
  const [profileData, setProfileData] = useState<any>();
  const [upcomingShowsList, setUpcoming] = useState<any>();
  const [upcomingApps, setUpcomingApps] = useState<any>();
  const showRunnerID = props.profileID;
  const showRunnerGroups = useGetAllShowrunnerGroupsQuery();
  const shows = useGetAllShowsQuery();
  const showList = sortShowsByDate(shows ? shows.data! : {});
  useEffect(() => {
    if (showRunnerGroups.data?.[showRunnerID!]) {
      setProfileData(
        parseProfileData("showrunner", showRunnerGroups?.data[showRunnerID!])
      );
    }
  }, [showRunnerID, showRunnerGroups.fulfilledTimeStamp]);

  useEffect(() => {
    if (shows?.data) {
      let upcomingApps = upcomingSRApps(shows, showRunnerID);
      let upcomingShows = showList.filter((show) => {
        if (
          show?.showrunner?.[0]?.id === showRunnerID &&
          show.published &&
          new Date(show.endtime).getTime() > Date.now()
        ) {
          return show;
        }

        return false;
      });
      setUpcoming(upcomingShows);
      setUpcomingApps(
        sortShowsByDate(
          upcomingApps.reduce((acc, curr, index) => {
            return { ...acc, [index]: curr };
          }, {})
        )
      );
    }
  }, [shows?.data]);

  return (
    <LoadingWrapper queryResponse={[showRunnerGroups]}>
      <ProfileView
        user={user}
        self={
          displayUID === showRunnerID ||
          user.sr_groups.hasOwnProperty(showRunnerID)
        }
        shows={upcomingShowsList}
        applications={upcomingApps}
        {...profileData}
      />
    </LoadingWrapper>
  );
}
