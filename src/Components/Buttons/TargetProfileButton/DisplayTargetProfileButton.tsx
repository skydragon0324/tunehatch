import React from "react";
import Img from "../../Images/Img";
import { Type } from "../../../Helpers/shared/Models/Type";
import { useAppDispatch } from "../../../hooks";
import { openSidebar } from "../../../Redux/UI/UISlice";

export default function DisplayTargetProfileButton(props: {
  type: Type;
  id: string;
  avatar: string;
  className?: string;
  large?: boolean;
}) {
  const dispatch = useAppDispatch();
  return (
    <Img
      key={props.id}
      stopPropagation
      onClick={() =>
        dispatch(
          openSidebar({
            status: true,
            component: "ViewProfile",
            data: { type: props.type, profileID: props.id },
          }),
        )
      }
      className={`${
        props.className
          ? props.className
          : props.large
            ? "w-32 h-32 rounded-full shadow-2xl border hover:shadow-3xl"
            : "w-16 h-16 rounded-full shadow-2xl border hover:shadow-3xl"
      }`}
      src={props?.avatar}
    />
  );
}
