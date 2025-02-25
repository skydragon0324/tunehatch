import React, { useState } from "react";
import ShowTile from "../Tiles/ShowTile";
import { Type } from "../../Helpers/shared/Models/Type";
import { Show } from "../../Helpers/shared/Models/Show";

export default function ShowTileCollection(props: {
  title?: string;
  className?: string;
  type?: string;
  detailsOnClick?: boolean;
  useModal?: boolean;
  canApply?: boolean;
  viewType?: Type;
  manageView?: boolean;
  containerClassName?: string;
  shows: Show[];
  limit?: number;
  hideDate?: boolean;
  self?: boolean;
}) {
  const [limit, setLimit] = useState(props.limit || 5);

  return (
    <>
      <div
        className={
          "flex-col " + props.containerClassName ? props.containerClassName : ""
        }
      >
        <h1 className="font-black text-3xl w-full text-center">
          {props.title}
        </h1>
        <div className={`${props.className ? props.className : "border"}`}>
          {props.shows.map((show, i) => {
            if (i < limit) {
              return (
                <ShowTile
                  showID={typeof show !== "object" ? show : show._key}
                  type={props.type}
                  detailsOnClick={props.detailsOnClick}
                  useModal={props.useModal}
                  viewType={props.viewType}
                  key={typeof show !== "object" ? show : show._key}
                  manageView={props.manageView}
                />
              );
            } else {
              return null;
            }
          })}
          {props.shows?.length > limit && (
            <button
              className="p-3 self-end hover:bg-gray-100 w-full bg-white text-blue-400"
              onClick={() => setLimit(limit + (props.limit || 5))}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </>
  );
}
