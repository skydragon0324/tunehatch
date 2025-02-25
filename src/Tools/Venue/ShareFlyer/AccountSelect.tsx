import React from "react";
import Img from "../../../Components/Images/Img";
import Instagram from "../../../Images/Icons/Instagram.png";
import Facebook from "../../../Images/Icons/Facebook.png";

interface IPage {
  name: string | React.ReactNode;
  fbid?: string | boolean;
  igid?: string | boolean;
}

export default function AccountSelect(props: {
  pages: IPage[];
  onClick: (option: IPage) => void;
}) {
  return (
    <>
      {props.pages ? (
        props.pages.length > 0 ? (
          <>
            <p className="text-center mb-2">
              {props.pages.length > 1
                ? "You have multiple accounts with sharing features enabled. Please select the Page you would like to share to."
                : "Please confirm the page you would like to share to."}
            </p>
            <div className="border w-11/12 mx-auto">
              {props.pages.map((pageOption, i) => {
                console.log(pageOption);
                return (
                  <div
                    className={`p-4 ${i !== 0 ? "border-t" : ""}`}
                    onClick={() => props.onClick(pageOption)}
                  >
                    <h1 className="font-black text-xl mb-1">
                      {pageOption.name}
                    </h1>
                    <div className="flex gap-2 pl-2">
                      {pageOption.fbid && (
                        <Img src={Facebook} className="w-6 h-6" />
                      )}
                      {pageOption.igid && (
                        <Img localSrc={Instagram} className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                );
              })}{" "}
            </div>
          </>
        ) : (
          <p>You do not have any pages we can share to.</p>
        )
      ) : (
        <></>
      )}
    </>
  );
}
