import React from "react";
import { useGetAllShowsQuery } from "../../Redux/API/PublicAPI";

export default function DealVisualizer(props: { showID: string }) {
  const shows = useGetAllShowsQuery();
  const show = shows.data?.[props.showID];
  const deal = show?.deal;

  return deal ? (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="w-full rounded justify-center text-white items-center bg-orange flex-col">
          <div className="flex-shrink filter rounded-tl rounded-tr bg-orange brightness-110">
            <p className="text-center font-bold flex items-center justify-center gap-1 p-1">
              <i className="material-symbols-outlined font-normal">payments</i>
              Payment Type
            </p>
          </div>
          <div className="p-4">
            <p className="text-center capitalize">
              {deal.type?.replace("_", " ")}
            </p>
          </div>
        </div>
        {deal.guarantee ? (
          <div className="w-full rounded justify-center text-white items-center bg-green-500 flex-col">
            <div className="flex-shrink filter rounded-tl rounded-tr bg-green-500 brightness-110">
              <p className="text-center font-bold flex items-center justify-center gap-1 p-1">
                <i className="material-symbols-outlined font-normal">
                  payments
                </i>
                Guarantee Amount
              </p>
            </div>
            <div className="p-4">
              <p className="text-center capitalize">${deal.guarantee}</p>
            </div>
          </div>
        ) : (
          <></>
        )}
        {deal.production_fee ? (
          <div className="w-full rounded justify-center text-white items-center bg-purple-500 flex-col">
            <div className="flex-shrink filter rounded-tl rounded-tr bg-purple-500 brightness-110">
              <p className="text-center font-bold flex items-center justify-center gap-1 p-1">
                <i className="material-symbols-outlined font-normal">
                  payments
                </i>
                Production Fee
              </p>
            </div>
            <div className="p-4">
              <p className="text-center capitalize">${deal.production_fee}</p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <div className="w-full rounded justify-center text-white items-center bg-orange flex-col">
      <div className="flex-shrink filter rounded-tl rounded-tr bg-orange brightness-110">
        <p className="text-center font-bold flex items-center justify-center gap-1 p-1">
          <i className="material-symbols-outlined font-normal">payments</i>
          Payment Type
        </p>
      </div>
      <div className="p-4">
        <p className="text-center">Tips</p>
      </div>
    </div>
  );
}
