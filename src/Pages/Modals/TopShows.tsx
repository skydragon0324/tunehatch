import React from "react";
import {
  useGetAllShowsQuery,
  useGetSpotlightQuery,
} from "../../Redux/API/PublicAPI";
import LoadingWrapper from "../../Components/Layout/LoadingWrapper";
// import ShowCard from "../../Components/Cards/ShowCard/ShowCard2";
import ShowTileCollection from "../../Components/Collections/ShowTileCollection";

export default function TopShows() {
  const spotlight = useGetSpotlightQuery();
  const shows = useGetAllShowsQuery();
  const topShows = spotlight?.data?.shows?.filter(
    (showID: string) =>
      new Date(shows?.data?.[showID]?.endtime).getTime() > Date.now()
  );
  // const limit = props.limit || 3;
  return (
    <LoadingWrapper queryResponse={[shows]} requiredData={[topShows]}>
      <ShowTileCollection limit={3} useModal detailsOnClick shows={topShows} />
    </LoadingWrapper>
  );
}
