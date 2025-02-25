import React from "react";
import Form from "../../Components/Inputs/Form";
import { useAppSelector } from "../../hooks";
import { useEditProfileMutation } from "../../Redux/API/UserAPI";

export default function EditAccountProfileForm() {
  const [editProfile] = useEditProfileMutation();

  const user = useAppSelector((state) => state.user.data);
  return (
    <Form
      name="editProfile"
      media
      submitFn={editProfile}
      doneLabel="Save"
      doneIcon="done"
      fixedNav
      formMap={[
        [
          {
            field: "firstname",
            placeholder: "First Name",
            large: true,
            required: true,
            classes: "flex-1",
            defaultValue: user.firstname,
          },
          {
            field: "lastname",
            placeholder: "Last Name",
            large: true,
            required: true,
            classes: "flex-1",
            defaultValue: user.lastname,
          },
          {
            field: "email",
            type: "email",
            placeholder: "Email Address",
            classes: "w-full",
            required: true,
            defaultValue: user.email,
          },
          {
            clickToEnable: true,
            type: "password",
            field: "password",
            placeholder: "Change Password",
            containerClassName: "w-full",
          },
          {
            clickToEnable: true,
            type: "password",
            field: "confirmPassword",
            placeholder: "Confirm New Password",
            containerClassName: "w-full",
          },
        ],
      ]}
    />
  );
}
