import React from "react";
import Img from "../../Images/Img";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { openCover } from "../../../Redux/UI/UISlice";

interface Props {
  links: { [key: string]: any };
}

export default function NavDropdown({ links }: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  return (
    <div
      className="flex items-center"
      onClick={() =>
        dispatch(
          openCover({
            status: true,
            data: { links },
            component: "MobileNav",
          })
        )
      }
    >
      {user.uid ? (
        <Img className="w-8 h-8 rounded-full" src={user.avatar} />
      ) : (
        <i className="text-2xl material-symbols-outlined">menu</i>
      )}
    </div>
  );
}
