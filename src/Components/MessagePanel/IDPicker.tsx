import React, { useEffect, useState } from "react";
import MessagePanel from "./MessagePanel";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getDisplayName } from "../../Helpers/HelperFunctions";
import {
  useGetAllArtistsQuery,
  useGetAllShowrunnerGroupsQuery,
  useGetAllVenuesQuery,
} from "../../Redux/API/PublicAPI";
import { updateResponseID } from "../../Redux/User/UserSlice";
import { Type } from "../../Helpers/shared/Models/Type";

export default function IDPicker(props: {
  participants?: Array<string>;
  selected?: string;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const userSRGs = user.sr_groups;
  const userVenues = user.venues;

  const responseID = user.responseID;
  const artistsQuery = useGetAllArtistsQuery();
  const venuesQuery = useGetAllVenuesQuery();
  const showrunnersQuery = useGetAllShowrunnerGroupsQuery();
  const [responseOptions, setResponseOptions] = useState<
    Array<{ id: string; type: Type; label?: string }>
  >([]);
  const [open, setOpen] = useState(false);
  const artists = artistsQuery?.data;
  const venues = venuesQuery?.data;
  const showrunners = showrunnersQuery?.data;

  const getResponseOptions = () => {
    console.log(responseID, "responseID");
    let tResponseOptions: Array<{ id: string; type: Type; label?: string }> =
      [];
    if (artists && venues && showrunners && !responseID) {
      if (artists[user.displayUID]) {
        tResponseOptions.push({
          label: getDisplayName("artist", artists[user.displayUID]),
          id: user.displayUID,
          type: "artist",
        });
      }
      Object.keys(userSRGs)?.forEach((SRID) => {
        let group = userSRGs?.[SRID];
        if (group && group.type === "admin") {
          tResponseOptions.push({
            label: getDisplayName("showrunner", showrunners[SRID]),
            id: SRID,
            type: "showrunner",
          });
        }
      });
      userVenues.forEach((venueID: string) => {
        let venue = venues?.[venueID];
        if (venue && venue.name) {
          tResponseOptions.push({
            label: getDisplayName("venue", venues[venueID]),
            id: venueID,
            type: "venue",
          });
        }
      });
      setResponseOptions(tResponseOptions);
    }
    let existingSelf;
    if (props.participants) {
      existingSelf = (tResponseOptions || responseOptions).filter((value) =>
        props.participants.includes(value.id)
      )?.[0];
    } else {
      existingSelf = { ...(tResponseOptions[0] || responseOptions[0]) };
    }

    console.log(existingSelf, "existing self");
    console.log(responseOptions, "responseOptions");
    if (!responseID) {
      dispatch(updateResponseID(existingSelf || responseOptions[0]));
    }
  };

  useEffect(() => {
    if (responseID && props.participants) {
      dispatch(updateResponseID(null));
    }
  }, [props.selected]);

  useEffect(() => {
    getResponseOptions();
  }, [artists, venues, showrunners, props.participants, responseID]);

  useEffect(() => {
    getResponseOptions();
  }, []);
  return (
    <>
      <div onClick={() => setOpen(!open)} className="mx-auto">
        {responseID && responseID.type && responseID.id && (
          <span className="flex items-center text-center relative mx-auto bg-orange p-1 text-white text-sm pl-2 pr-2 rounded-full">
            Responding as{" "}
            {getDisplayName(
              responseID?.type,
              (responseID.type === "artist"
                ? artists
                : responseID.type === "venue"
                ? venues
                : showrunners)[responseID?.id]
            )}
            <i
              className={`transition-all ${
                open ? "rotate-180" : ""
              } ml-auto material-symbols-outlined text-sm pl-2`}
            >
              expand_more
            </i>
          </span>
        )}
        <div
          className={`${
            open
              ? "block overflow-auto max-h-48 border rounded-lg -mt-5 pt-5"
              : "hidden"
          }`}
        >
          {responseOptions.map((option) => {
            return (
              <p
                className="text-center p-2 border-b"
                key={option?.id}
                onClick={() =>
                  dispatch(
                    updateResponseID({ id: option?.id, type: option?.type })
                  )
                }
              >
                {option.label}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
