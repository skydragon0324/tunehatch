import React from "react";
import Form from "../Components/Inputs/Form";
import { useAppDispatch } from "../hooks";
import { usePublishShowMutation } from "../Redux/API/IndustryAPI";
import { resetModal } from "../Redux/UI/UISlice";
import TargetCardCollection from "../Components/Collections/TargetCardCollection";
import { Performer } from "../Helpers/shared/Models/Show";

export default function PublishShowForm(props: {
  form?: string;
  performers: Performer[];
  venueID: string;
  showID: string;
}) {
  const dispatch = useAppDispatch();
  // const form = useAppSelector(
  //   (state) => state.user.forms[props.form || "publishShow"],
  // );
  const [publishShow] = usePublishShowMutation();

  return (
    <div className="flex flex-col">
      <div className="w-full p-4">
        <Form
          name={props.form || "publishShow"}
          className="flex flex-col w-full p-4"
          separateFormObject={true}
          submitFn={publishShow}
          successStatusMessage="Show published successfully"
          doneLabel="Publish Show"
          completedLabel="Show Published!"
          additionalAuthParams={{
            showID: props.showID,
            venueID: props.venueID,
          }}
          onComplete={() => dispatch(resetModal())}
          clearOnComplete={true}
          fixedNav
          formMap={[
            [
              {
                fieldType: "hidden",
                field: "eventID",
                defaultValue: props.showID,
              },
              {
                fieldType: "hidden",
                field: "venueID",
                defaultValue: props.venueID,
              },
              {
                fieldType: "title",
                defaultValue: "Publish Show",
                className: "text-2xl w-full font-black col-span-6",
              },
              {
                fieldType: "title",
                className: "w-full col-span-6",
                defaultValue:
                  "Publishing your show will lock your lineup. Please unlock your lineup from Manage Shows if you want to make changes.",
              },
            ],
          ]}
        />
      </div>
      <div className="flex flex-col w-full p-4">
        <h1 className="text-xl w-full font-black col-span-6 p-2">
          Confirmed Artists:
        </h1>
        <TargetCardCollection
          type={"artist"}
          ids={props.performers.map((performer) => performer.uid.toString())}
        />
      </div>
    </div>
  );
}
