import React from "react";
import Form from "../../Components/Inputs/Form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { formAppend, formSplice } from "../../Redux/User/UserSlice";
import { useAddConfirmedArtistsMutation } from "../../Redux/API/IndustryAPI";
import { resetSidebar } from "../../Redux/UI/UISlice";

interface IAddConfirmedArtistsProps {
  showID: string;
  venueID: string;
  form?: string;
}

export default function AddConfirmedArtists(props: IAddConfirmedArtistsProps) {
  const dispatch = useAppDispatch();
  const form = useAppSelector(
    (state) => state.user.forms[props.form || "addConfirmedArtists"]
  );

  const [addConfirmedArtists] = useAddConfirmedArtistsMutation();

  return (
    <>
      <div className="p-4">
        <h1 className="text-center font-black text-2xl">
          Add Confirmed Artists
        </h1>
        <p className="text-center mb-4">
          Add artists who you have already confirmed to be performing at your
          show here.
        </p>
        <Form
          name={props.form || "addConfirmedArtists"}
          className="h-full"
          submitFn={addConfirmedArtists}
          successStatusMessage="Artists confirmed!"
          onComplete={() => dispatch(resetSidebar())}
          additionalAuthParams={{
            showID: props.showID,
            venueID: props.venueID,
          }}
          formMap={[
            [
              {
                field: "performers",
                placeholder: "Add Confirmed Performers...",
                className: "w-full",
                fieldType: "filterInput",
                filterType: "artist",
                value: form?.performers || [],
                selectFn: (e: any) =>
                  dispatch(
                    formAppend({
                      form: props.form || "addConfirmedArtists",
                      field: "performers",
                      value: e,
                    })
                  ),
                removeFn: (e: any) =>
                  dispatch(
                    formSplice({
                      form: props.form || "addConfirmedArtists",
                      field: "performers",
                      key: "name",
                      value: e,
                    })
                  ),
              },
            ],
          ]}
        />
      </div>
    </>
  );
}
