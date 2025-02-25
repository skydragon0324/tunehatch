import React from "react";
import Form from "../Components/Inputs/Form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useInviteArtistsMutation } from "../Redux/API/IndustryAPI";
import { resetModal } from "../Redux/UI/UISlice";
import { FormKeys } from "../Redux/User/UserSlice";

export default function InviteArtistsForm(props: {
  form?: FormKeys;
  showID?: any;
  venueID?: any;
}) {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.user.forms[props.form]);
  const [inviteArtists] = useInviteArtistsMutation();

  return (
    <Form
      name={props.form}
      separateFormObject={true}
      locked={form.invites.length < 1}
      submitFn={inviteArtists}
      successStatusMessage="Artists invited successfully"
      doneLabel="Send Invites"
      completedLabel="Invites Sent!"
      onComplete={() => dispatch(resetModal())}
      clearOnComplete={true}
      formMap={[
        [
          {
            fieldType: "hidden",
            field: "showID",
            defaultValue: props.showID,
          },
          {
            fieldType: "hidden",
            field: "venueID",
            defaultValue: props.venueID,
          },
          {
            fieldType: "component",
            component: "ArtistInviteSelection",
            componentProps: { form: props.form },
            key: "artistInvite",
          },
        ],
      ]}
      fixedNav
    />
  );
}
