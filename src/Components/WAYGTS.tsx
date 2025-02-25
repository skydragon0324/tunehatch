import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import {
  useGetAllArtistsQuery,
  useGetAllShowsQuery,
  useSetWAYGTSMutation,
} from "../Redux/API/PublicAPI";
import { getDisplayName } from "../Helpers/HelperFunctions";
// import TargetIcon from "./Images/TargetIcon";
import TargetLabel from "./Buttons/TargetLabel";

export default function WAYGTS(props: { showID: string }) {
  const uid = useAppSelector((state) => state.user.data.uid);
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const artistsQuery = useGetAllArtistsQuery();
  const artists = artistsQuery?.data;
  const performers = (show?.performers || []).filter(
    (performer) =>
      (performer?.uid || performer?.id) &&
      performer?.id !== 0 &&
      performer?.uid !== 0
  );
  console.log(show?.performers);
  console.log(performers);
  const newTickets = useAppSelector((state) => state.user.tickets.generated);
  const [showID, setShowID] = useState(props.showID);
  const [tickets, setTickets] = useState([]);
  const [updateTimer, resetUpdateTimer] = useState(null);
  const [selectedArtists, selectArtists] = useState([]);
  const [setWAYGTS] = useSetWAYGTSMutation();

  useEffect(() => {
    if (newTickets?.length) {
      let tTix: { [key: string]: any }[] = [];
      newTickets.forEach((ticket: any) => {
        tTix.push(ticket?.id);
        if (ticket?.showID && props !== ticket?.showID) {
          setShowID(ticket?.showID);
        }
      });
      setTickets(tTix);
    }
  }, [newTickets]);

  const triggerWAYGTS = async (performerID: string | number) => {
    clearTimeout(updateTimer);
    let tSelectedArtists = [...selectedArtists];
    let index = tSelectedArtists?.indexOf(performerID);
    if (index > -1) {
      tSelectedArtists?.splice(index);
    } else {
      tSelectedArtists?.push(performerID);
    }
    selectArtists(tSelectedArtists);
    resetUpdateTimer(
      setTimeout(async () => {
        try {
          setWAYGTS({
            ticketIDs: tickets,
            artistIDs: tSelectedArtists,
            showID,
            SECRET_UID: uid,
          });
        } catch (err) {
          console.log(err);
        }
      }, 2000)
    );
  };

  return performers?.length > 0 && tickets ? (
    <>
      <h2 className="text-center">
        Support your favorite artists. Tell us who you're coming out to see
      </h2>
      <p className="text-xs text-gray-400 text-center">
        Tap an artist's name to select. Changes will be saved automatically.
      </p>
      <div className="flex flex-wrap gap-2">
        {performers.map((performer) => {
          console.log(performer);
          let artist = artists?.[performer?.uid];
          if (artist) {
            let name = getDisplayName("artist", artist);
            return name ? (
              <TargetLabel
                selectOnClick
                onClick={() => triggerWAYGTS(performer?.uid)}
                name={getDisplayName("artist", artist)}
                src={artist?.avatar}
              />
            ) : null;
          } else {
            return null;
          }
        })}
      </div>
    </>
  ) : null;
}
