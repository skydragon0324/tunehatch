import React, { useEffect, useState } from "react";
import {
  useGetAllArtistsQuery,
  // useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import InfoLabel from "./InfoLabel";
import Img from "../Images/Img";
import { getSocialStats } from "../../Helpers/shared/statsConfig";

export default function SocialStatsLabel(props: { id: string | number }) {
  const artists = useGetAllArtistsQuery();
  // const venues = useGetAllVenuesQuery();
  const artist = artists.data?.[props.id];

  const [socialStats, refreshSocialStats] = useState<
    { [key: string]: any }[] | null
  >(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (artist) {
      refreshSocialStats(getSocialStats("artist", artist));
    }
  }, [artist]);

  useEffect(() => {
    if (socialStats?.length) {
      socialStats.forEach((stat) => {
        if (stat.value && stat.value !== "Coming Soon!" && !visible) {
          setVisible(true);
        }
      });
    }
  }, socialStats);

  return socialStats ? (
    <InfoLabel
      label={
        <div className="flex items-center relative">
          <div className="flex">
            {socialStats.map((stat, i) => {
              if (stat.value && stat.value !== "Coming Soon!") {
                return (
                  <div className="w-3 h-5" key={"historyIcon/" + i}>
                    <Img
                      key={"historyIcon/" + i}
                      className={`w-5 h-5 bg-white rounded-full absolute ${
                        i ? `left-${i * 5}` : ""
                      }`}
                      src={stat.image}
                    />
                  </div>
                );
              }
            })}
            <div className="w-3 h-5"></div>
          </div>
          <p className="text-sm font-medium">Socials</p>
        </div>
      }
    >
      <div>
        <p className="text-xs font-medium">Socials</p>
        {socialStats.map((stat, i) => {
          if (stat.value && stat.value !== "Coming Soon!") {
            return (
              <p className="text-xs" key={"performanceCount/" + i}>
                {stat.label}: {stat.value}
              </p>
            );
          }
        })}
      </div>
    </InfoLabel>
  ) : (
    <></>
  );
}
