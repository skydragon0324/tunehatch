import React from "react";
import { useNavigate } from "react-router-dom";
import { useEditProfileMutation } from "../../Redux/API/UserAPI";
import { useAppSelector, useAppDispatch } from "../../hooks";
import Form from "../../Components/Inputs/Form";
import { openModal } from "../../Redux/UI/UISlice";

export default function EditHostProfileForm() {
  const [editProfile] = useEditProfileMutation();
  const user = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleCheckItOutClick = () => {
    dispatch(openModal({ status: false }));
    navigate("/venues/manage");
  };

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
            fieldType: "title",
            defaultValue: "It's official!",
            className: "w-full flex-col text-center text-2xl font-black mt-2",
          },
          {
            fieldType: "title",
            defaultValue: "We're pumped to help your shows reach new heights.",
            className: "w-full flex-col text-center text-md mt-2",
          },
          {
            fieldType: "title",
            defaultValue:
              "To create or manage your venues at any time, click on your user icon on the top right hand corner of the page, and then click Manage Venues.\n" +
              "Once you've told us a bit about your space, you're ready to start posting ticketed shows right away. Bring your own talent, or find fresh faces right here. \n",
            className: "w-full flex-col text-center text-md mt-2",
          },
          {
            fieldType: "title",
            defaultValue: "Putting on great shows just got a lot easier.",
            className: "w-full flex-col text-center text-md font-black mt-2",
          },
          {
            fieldType: "button",
            field: "manage_venues",
            placeholder: "Check it out",
            clickFn: handleCheckItOutClick,
            containerClassName: "flex min-w-full flex-1 flex-grow mt-2",
          },
          {
            field: "type.host.enabled",
            placeholder: "Enable Venue Host Features",
            fieldType: "toggleSlider",
            required: false,
            defaultValue: user.type.host.enabled,
          },
        ],
      ]}
    />
  );
}
