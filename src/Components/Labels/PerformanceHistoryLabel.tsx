import React from "react";
import {
  useGetAllArtistsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import InfoLabel from "./InfoLabel";
import Img from "../Images/Img";

export default function PerformanceHistoryLabel(props: {
  id: string | number;
}) {
  const artists = useGetAllArtistsQuery();
  const venues = useGetAllVenuesQuery();
  const artist = artists.data?.[props.id];
  const performances = artist?.performances;

  return performances ? (
    <InfoLabel
      label={
        <div className="flex items-center relative">
          <div className="flex">
            {performances.map((performance, i) => {
              let venue = venues.data?.[performance.venueID];
              if (i < 5 && venue) {
                return (
                  <div className="w-3 h-5" key={"historyIcon/" + i}>
                    <Img
                      key={"historyIcon/" + i}
                      className={`w-5 h-5 bg-white rounded-full absolute ${
                        i ? `left-${i * 5}` : ""
                      }`}
                      src={venue.avatar}
                    />
                  </div>
                );
              } else {
                return null;
              }
            })}
            <div className="w-3 h-5"></div>
          </div>
          <p className="text-sm font-medium">Performances</p>
        </div>
      }
    >
      <div>
        <p className="text-xs font-medium">Performances</p>
        {performances.map((performance, i) => {
          let venue = venues.data?.[performance.venueID];
          if (venue) {
            return (
              <p className="text-xs" key={"performanceCount/" + i}>
                {performance.count}x {venue.name}
              </p>
            );
          }

          return <></>;
        })}
      </div>
    </InfoLabel>
  ) : (
    <></>
  );
}
