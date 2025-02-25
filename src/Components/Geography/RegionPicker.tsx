import React from "react";
import { useGetActiveRegionsQuery } from "../../Redux/API/RegionAPI";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  resetCurrentRegion,
  setCurrentRegion,
} from "../../Redux/User/UserSlice";
import Img from "../Images/Img";

export default function RegionPicker() {
  const currentRegion = useAppSelector(
    (state) => state.user.location.currentRegion
  );
  const currentRegionLocations = useAppSelector(
    (state) => state.user.location.currentRegionLocations
  );
  const dispatch = useAppDispatch();
  const activeRegions = useGetActiveRegionsQuery();
  const regions = activeRegions?.data?.filter((region) => region.active);
  return regions && regions.length > 0 ? (
    <>
      {/* <div className="mx-auto w-4/5 m-5 border border-red-600 rounded p-2"><p>
            <h1 className="font-black text-xl text-red-500">DEBUG MODE</h1>
            Active Region: {currentRegion}<br/>
            Region Locations: {currentRegionLocations.map((location: string, i: number) => {
                return <span>{location}{i < currentRegionLocations.length-1 ? ", " : ""}</span>
            })}
        </p>
        </div> */}
      <div className="flex gap-2 pl-8 relative overflow-auto">
        {regions?.map((region) => {
          let selected = currentRegion === region.label;
          return (
            <>
              <div
                onClick={(e) => {
                  console.log(region);
                  dispatch(
                    setCurrentRegion({
                      region: region.label,
                      locations: region.locations,
                      featured: region.featured,
                    })
                  );
                }}
                className={`flex bg-${region.color} p-2 rounded-full relative ${
                  region.featured ? "rounded-tr-none mr-12 rounded-br-none" : ""
                } pl-4 pr-4 text-${region.fontColor || "white"}`}
              >
                {selected ? <i className="bg-white material-symbols-outlined h-10 w-10 absolute left-0 top-0 rounded-full text-green-300 flex items-center justify-center font-black border">done</i> : region.icon ? 
                <Img hideHatchy className="h-10 w-10 absolute left-0 top-0 rounded-full bg-white" localSrc={region.icon} /> 
                : null}
                <p className={`${region.icon ? "pl-8" : ""}`} style={{width: String(region.label.length*.69 + "rem")}}>{region.label}</p>
                {region.featured && (
                  <span
                    className={`bg-gray-50 border border-${region.color} h-full absolute top-0 -right-12 rounded-tr-full rounded-br-full p-2 text-${region.color}`}
                  >
                    NEW
                  </span>
                )}
              </div>
            </>
          );
        })}
        {currentRegion && (
          <span
            onClick={() => {
              dispatch(resetCurrentRegion());
            }}
            className="bg-gray-50 border border-gray-200 w-10 h-10 rounded-full text-red-400 flex items-center justify-center"
          >
            <i className="material-symbols-outlined">close</i>
          </span>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
