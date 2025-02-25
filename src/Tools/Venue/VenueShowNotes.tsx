import React from "react";
import {
  useEditShowNotesMutation,
  useGetShowNotesQuery,
} from "../../Redux/API/VenueAPI";
import { useAppSelector } from "../../hooks";
import Form from "../../Components/Inputs/Form";

export default function VenueShowNotes(props: {
  showID: string;
  venueID: string;
}) {
  const user = useAppSelector((state) => state.user.data);
  const notes = useGetShowNotesQuery({
    SECRET_UID: user.uid,
    showID: props.showID,
    venueID: props.venueID,
  });
  const [editShowNotes] = useEditShowNotesMutation();
  return notes.data ? (
    <>
      <Form
        submitFn={editShowNotes}
        media
        additionalAuthParams={{ venueID: props.venueID, showID: props.showID }}
        name="editShowNotes"
        formMap={[
          [
            {
              fieldType: "title",
              className: "p-2 text-center",
              defaultValue: (
                <>
                  <span className="text-sm text-center text-gray-400">
                    Keep notes about your upcoming show here. These will be
                    visible to anyone who has access to your venue, but not
                    performing artists.
                  </span>
                </>
              ),
            },
            {
              fieldType: "textarea",
              containerClassName: "p-2",
              placeholder: "Show Notes",
              field: "notes",
              defaultValue: notes.data?.notes,
            },
            {
              fieldType: "file",
              name: "Attachments",
              field: "attachments",
              defaultValue: notes?.data?.attachments || [],
            },
          ],
        ]}
      />
    </>
  ) : (
    <></>
  );
}
