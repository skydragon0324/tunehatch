import React, { useEffect, useMemo, useState } from "react";
import ArtistCard from "../../../Components/Cards/ArtistCard/ArtistCard";
import { useGetAllArtistsQuery } from "../../../Redux/API/PublicAPI";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  formAppend,
  // formArrayUpdate,
  formSplice,
  // formUpdate,
  // removeFormArray,
} from "../../../Redux/User/UserSlice";
import { getArtistName, objToArray } from "../../../Helpers/HelperFunctions";
import { Performer } from "../../../Helpers/shared/Models/Show";

export default function ArtistInviteSelection(props: {
  form: string;
  venueID: string;
  showID: string;
}) {
  const form = useAppSelector(
    (state) => state.user.forms[props.form as keyof typeof state.user.forms]
  );
  const artists = useGetAllArtistsQuery();
  const [artistList, setArtistList] = useState(objToArray(artists.data));
  const [search, setSearch] = useState("");

  const formInvites = useMemo(
    () => form["invites" as keyof typeof form],
    [form]
  );

  const handleSelect = (artist: any) => {
    let index = formInvites.findIndex(
      (performer: Performer) => performer?.id === artist._key
    );
    if (index === -1) {
      dispatch(
        formAppend({
          form: props.form,
          field: "invites",
          value: {
            id: artist._key,
            name: getArtistName(artist),
          },
        })
      );
    } else {
      dispatch(
        formSplice({ form: props.form, field: "invites", index: index })
      );
    }
  };

  useEffect(() => {
    if (search) {
      let searchFilter = new RegExp(search, "gi");
      let searchResults = artistList.filter((artist) => {
        if (
          artist.firstname.match(searchFilter) ||
          artist.lastname.match(searchFilter) ||
          getArtistName(artist).match(searchFilter)
        ) {
          return artist;
        }
      });
      setArtistList(searchResults);
    } else {
      setArtistList(objToArray(artists.data));
    }
  }, [search]);

  const dispatch = useAppDispatch();
  return (
    <>
      <div className="fixed w-full flex box-border justify-center items-center flex-col top-0 h-24 bg-white max-w-viewport z-10">
        <p className="text-center">
          {String(formInvites.length)} artists selected.
        </p>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-3/4 border box-border text-center p-2 text-xl rounded-lg font-black focus:border-orange"
          placeholder="Search..."
        />
      </div>
      <div className="flex flex-wrap gap-2 items-center mt-14">
        {artists.data ? (
          artistList.map((artist) => {
            return (
              <div>
                <ArtistCard
                  id={artist._key}
                  selected={
                    formInvites.findIndex(
                      (performer: Performer) => performer?.id === artist._key
                    ) !== -1
                  }
                  onClick={() => {
                    handleSelect(artist);
                  }}
                />
              </div>
            );
          })
        ) : (
          <></>
        )}
        {/* <ViewController fixed
                doneLabel="Send Invites"
                locked={(formInvites).length < 1}/> */}
      </div>
    </>
  );
}
