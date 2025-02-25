import React from "react";
import Chick from "../../Images/ChickLogo.png";
import FullLogo from "../../Images/TextLogo.png";

export default function PoweredByTuneHatch() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-gray-400">Powered by</p>
      {/* <a href="https://tunehatch.com/" target="_blank" rel="noreferrer"> */}
      <div className="flex">
        <img src={Chick} className="w-7 h-5" alt="" />
        <img src={FullLogo} className="h-5" alt="" />
      </div>
      {/* </a> */}
    </div>
  );
}
