import React from "react";
import Form from "../Components/Inputs/Form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useCreateSRGMutation } from "../Redux/API/ShowrunnerAPI";
import { formAppend, formSplice } from "../Redux/User/UserSlice";

export default function CreateSRGForm() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.user.forms.createSRG);

  const [createSRG] = useCreateSRGMutation(); //add useCreateSRGMutation to API
  return (
    <Form
      name="createSRG"
      className="flex flex-wrap"
      fixedNav
      media
      keepOnDismount
      submitFn={createSRG}
      formMap={[
        [
          {
            fieldType: "title",
            className: "w-full flex-col text-center text-sm text-gray-400 mt-2",
            defaultValue:
              "Ready to get started? Tell us about your promoter group, and tell us which artists are on your roster. If a member is not on TuneHatch, you will have the option to invite them.",
          },
          {
            fieldType: "title",
            defaultValue: "New Group",
            className: "text-2xl font-black",
          },
          {
            field: "name",
            placeholder: "Group Name",
            label: "Group Name",
            large: true,
            required: true,
            containerClassName: "flex w-full",
          },
          {
            field: "bio",
            placeholder: "Group Description",
            fieldType: "textarea",
            containerClassName: "flex w-full",
          },
          {
            form: "createSRG",
            field: "roster",
            placeholder: "Search for an artist...",
            label: "Your Roster:",
            fieldType: "filterInput",
            filterType: "artist",
            className: "w-full",
            containerClassName: "w-full",
            value: form.roster || [],
            selectFn: (e: any) =>
              dispatch(
                formAppend({ form: "createSRG", field: "roster", value: e })
              ),
            removeFn: (e: any) =>
              dispatch(
                formSplice({
                  form: "createSRG",
                  field: "roster",
                  key: "name",
                  value: e,
                })
              ),
          },
          {
            field: "contact.name",
            placeholder: "Contact Name",
            label: "Manager Contact",
            required: true,
            containerClassName: "flex w-full",
          },
          {
            field: "contact.email",
            placeholder: "Contact Email",
            label: "Contact Email",
            type: "email",
            required: true,
            containerClassName: "flex w-1/2 pr-1",
          },
          {
            field: "contact.phone",
            placeholder: "Contact Phone",
            label: "Contact Phone *",
            type: "tel",
            required: true,
            containerClassName: "flex w-1/2 pr-1",
          },
        ],
        [
          {
            fieldType: "title",
            className: "w-full flex-col text-center text-2xl font-black mt-2",
            defaultValue: "Social Content",
          },
          {
            fieldType: "title",
            className: "w-full flex-col text-center text-sm text-gray-400 mt-2",
            defaultValue:
              "This will enable dynamic embeds on your profile. You can skip this step, and add them later.",
          },
          {
            field: "socials.instagram",
            label: "Instagram",
            placeholder: "Instagram Handle",
            containerClassName: "flex w-full pt-2",
            className: "text-xs",
          },
          {
            field: "socials.youtube",
            label: "Youtube",
            placeholder: "Featured Youtube Video",
            containerClassName: "flex w-full pt-2",
            className: "text-xs",
          },
          {
            field: "socials.spotify",
            label: "Spotify",
            placeholder: "Featured Spotify Album/Playlist",
            containerClassName: "flex w-full pt-2",
            className: "text-xs",
          },
          {
            field: "socials.tiktok",
            label: "TikTok",
            placeholder: "Featured TikTok Video",
            containerClassName: "flex w-full pt-2",
            className: "text-xs",
          },
        ],
      ]}
    />
  );
}
