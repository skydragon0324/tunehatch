import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { APIURL } from "../../../Helpers/configConstants";
// import FullLogo from "../../Images/TextLogo.png";
import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
import {
  useGetAllShowrunnerGroupsQuery,
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
  useGetShowsQueryState,
} from "../../../Redux/API/PublicAPI";
import { EmbedStyle } from "../../../Helpers/shared/Models/EmbedStyles";
import PoweredByTuneHatch from "../../../Components/Labels/PoweredByTuneHatch";
import FlyerCard from "./FlyerCard";
// import FlyerCard from "../../Components/Tiles/FlyerCard.js";
// import AltCard from "../../Components/Tiles/AltCard.js";
import { setFullscreen } from "../../../Redux/UI/UISlice";
import { useAppDispatch } from "../../../hooks";
import AltCard from "./AltTile";
import { Show } from "../../../Helpers/shared/Models/Show";
import { Venue } from "../../../Helpers/shared/Models/Venue";
import { getShowData } from "../../../../server/Services/DBServices/dbShowService";
import { Showrunner } from "../../../Helpers/shared/Models/Showrunner";

export default function UpcomingShowsEmbed(props: {
  venueID?: string;
  SRID?: string;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setFullscreen({ status: true }));
  });
  const venues = useGetAllVenuesQuery();
  const showrunners = useGetAllShowrunnerGroupsQuery();
  var { venueID, SRID, styleOptions } = useParams();
  venueID = props.venueID || venueID;
  SRID = props.SRID || SRID;
  const venue: Venue | null | undefined = venues.data?.[venueID];
  const showrunner: Showrunner | null | undefined = showrunners.data?.[SRID];

  const { data } = useGetAllShowsQuery();

  const filteredShows = useMemo(() => {
    if (data == null) return null;

    const apiSliceShows = Object.values(data || {});

    if (apiSliceShows?.length) {
      return apiSliceShows
        .filter(
          (show: any) =>
            ((show.venueID != null && show.venueID == venueID) ||
              (SRID != null &&
                show.showrunner?.find(
                  (sr: Showrunner) => (sr.id || sr.uid || sr._key) === SRID
                ))) &&
                !show.private && show.published &&
            Date.now() <= new Date(show.endtime).getTime()
        )
        .sort(
          (a: any, b: any) =>
            new Date(a.starttime).getTime() - new Date(b.starttime).getTime()
        );
    }

    return [];
  }, [data, props]);

  const [styles, setStyles] = useState<EmbedStyle>({});

  const parseStyles = () => {
    if (styleOptions) {
      let ts: { [key: string]: any } = {};
      let tso = styleOptions.split("&");
      tso.forEach((style) => {
        try {
          let styleValue: string | boolean = "";
          let [styleKey, tValue] = style.split("=");
          if (tValue === "true") {
            styleValue = true;
          } else if (tValue === "false") {
            styleValue = false;
          } else {
            styleValue = tValue;
          }
          ts[styleKey] = styleValue;
          console.log(ts[styleKey]);
        } catch (err) {
          console.log(err);
        }
      });
      setStyles(ts);
    }
  };

  useEffect(() => {
    parseStyles();
  }, []);

  return filteredShows ? (
    <div
      className={`${
        styles.altTiles
          ? "flex flex-row flex-wrap justify-center gap-4 top-4 relative"
          : "flex-col"
      } ${styles.darkMode ? "darkMode dark" : ""}`}
    >
      {venue && !styles.altTiles && (
        <h1 className="text-center font-black text-xl">
          Upcoming Shows at {venue.name}
        </h1>
      )}
      {showrunner && !styles.altTiles && (
        <h1 className="text-center font-black text-xl">
          Upcoming Shows by {showrunner.name}
        </h1>
      )}
      {filteredShows != null && filteredShows?.length < 1 ? (
        <h1 className="centered font-black text-2xl">
          This {SRID != null ? "showrunner" : "venue"} does not have any shows
          listed on TuneHatch right now. Check back soon!
        </h1>
      ) : (
        filteredShows?.map((show) => {
          if (!show.private) {
            return styles.altTiles ? (
              <div className="flex">
                <AltCard key={show._key} showID={show._key} />
              </div>
            ) : (
              <div className="flyerCardContainer">
                <FlyerCard
                  key={show._key}
                  showID={show._key}
                  darkMode={styles.darkMode}
                />
              </div>
            );
          } else {
            return null;
          }
        })
      )}
      <div className="w-full">
        <PoweredByTuneHatch />
      </div>
    </div>
  ) : null;
}
