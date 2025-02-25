import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { openCover } from "../../Redux/UI/UISlice";
import MobileNav from "../../Pages/Covers/MobileNav";
import EditProfile from "../../Pages/Modals/EditProfile";

interface Props {
  data: { links?: { [key: string]: { label?: React.ReactNode | string } } };
}

export default function Cover({ data }: Props) {
  const dispatch = useAppDispatch();
  const component = useAppSelector((state) => state.ui.cover.component);

  return (
    <div
      className="absolute z-50 w-full h-full bg-white"
      style={{ animation: ".2s slide-down ease-in-out" }}
    >
      <button
        className="float-right"
        onClick={() => dispatch(openCover({ status: false }))}
      >
        <i className="material-symbols-outlined p-2 text-gray-400">close</i>
      </button>
      <div className="p-6 min-w-full min-h-full">
        {component === "MobileNav" && <MobileNav links={data.links} />}
        {component === "EditProfile" && <EditProfile />}
      </div>
    </div>
  );
}
