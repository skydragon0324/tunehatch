import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { asyncDataSubmit } from "../../Helpers/HelperFunctions";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useDeleteShowMutation } from "../../Redux/API/VenueAPI";
import { openModal } from "../../Redux/UI/UISlice";
import { Show } from "../../Helpers/shared/Models/Show";

export default function DeleteShow(props: { show: Show; venueID: string }) {
  const show = props.show;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.data);
  const [pendingState, setPendingState] = useState<boolean | string>(false);
  const [deleteShow] = useDeleteShowMutation();

  const redirectOnDelete = () => {
    dispatch(openModal({ status: false }));
    navigate(`/venues/manage/${show.venueID}`);
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className="font-black text-2xl m-2">
        Are you sure you want to delete {show.name}?
      </h1>
      <p className="text-md text-gray-300 m-2">
        Deleting a show is a permanent action all show details will be
        permanently deleted.
      </p>
      <button
        className="border text-red-400 border-red-400 p-1 pl-2 pr-2 flex items-center rounded-full"
        onClick={() =>
          asyncDataSubmit(
            user.uid,
            user.displayUID,
            { showID: show._key, venueID: props.venueID, showName: show.name },
            setPendingState,
            null,
            deleteShow,
            "Show Deleted",
            dispatch,
            true,
            redirectOnDelete
          )
        }
      >
        Delete {show.name}
      </button>
    </div>
  );
}
