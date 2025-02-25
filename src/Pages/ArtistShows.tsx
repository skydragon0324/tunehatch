import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { useGetAllShowsQuery } from "../Redux/API/PublicAPI";
import { getArtistShows, sortShowsByDate } from "../Helpers/HelperFunctions";
// import ShowTile from "../Components/Tiles/ShowTile";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import { Navigate } from "react-router-dom";
import ShowTileCollection from "../Components/Collections/ShowTileCollection";

export default function ArtistShows() {
  const user = useAppSelector((state) => state.user.data);
  const shows = useGetAllShowsQuery();
  const [artistShows, setArtistShows] = useState<any>();

  useEffect(() => {
    if (shows.isSuccess) {
      setArtistShows(getArtistShows(shows.data, user.displayUID, true, true));
    }
  }, [shows]);
  return (
    <LoadingWrapper queryResponse={[shows]}>
      {user && !user.uid && <Navigate replace to="/shows" />}
      <div className="flex flex-col">
        <div className="p-2">
          <p className="text-xs text-gray-400 text-center">
            Looking to manage payouts for performances? <br />
            <a className="text-blue-400" href={"/profile/u/" + user.displayUID}>
              Head to your profile
            </a>{" "}
            and press "manage payouts".
            <br />
            Once a payment account is connected, payments will generally be made
            3-5 days after the show concludes.
          </p>
        </div>
        <div className="px-2 flex flex-col">
          <ShowTileCollection
            viewType="artist"
            type="confirmed"
            manageView
            title="Upcoming Shows"
            containerClassName="mt-2"
            shows={sortShowsByDate(artistShows?.performing) || []}
          />
          <ShowTileCollection
            viewType="artist"
            type="invited"
            title="Pending Invites"
            containerClassName="mt-2"
            shows={sortShowsByDate(artistShows?.invited) || []}
          />
          <ShowTileCollection
            viewType="artist"
            type="applied"
            manageView
            title="Applications"
            containerClassName="mt-2"
            shows={sortShowsByDate(artistShows?.applied) || []}
          />
          <ShowTileCollection
            viewType="artist"
            type="past"
            manageView
            title="Past Shows"
            containerClassName="mt-2"
            shows={sortShowsByDate(artistShows?.past) || []}
          />
        </div>
        {artistShows?.applied?.length === 0 &&
          artistShows?.invited?.length === 0 && (
            <>
              <div className="bg-amber-400 w-50 rounded mt-2 justify-center m-2">
                <h1 className="text-2xl text-center text-white pb-2 font-bold">
                  Want more gigs?
                </h1>
                <p className="text-sm text-center text-white p-2">
                  You currently don't have any pending invites or applications.
                  Check out the{" "}
                  <a href="/apply" className="text-blue-400">
                    Apply page
                  </a>{" "}
                  for gigs you may be interested in playing.
                </p>
              </div>
            </>
          )}
      </div>
    </LoadingWrapper>
  );
}
