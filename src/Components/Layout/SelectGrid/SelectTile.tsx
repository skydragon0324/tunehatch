import React from "react";
import Img from "../../Images/Img";

export default function SelectTile(props: {
  onClick: any;
  label: string;
  sublabel?: string;
  src?: string;
  selected?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-12 gap-4 items-center pl-2 w-full h-auto p-1 pt-2 pb-2 border-b ${
        props.selected ? "bg-orange text-white" : ""
      }`}
      onClick={() => props.onClick()}
    >
      <div className="col-span-3">
        <Img src={props.src} className="rounded-full"/>
      </div>
      <div className="col-span-9">
        <h3 className="font-semibold">{props.label}</h3>
        <p className="text-sm text-gray-400">{props.sublabel}</p>
      </div>
    </div>
  );
}
