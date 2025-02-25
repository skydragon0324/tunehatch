import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import LabelButton from "../Components/Buttons/LabelButton";
import { updateView } from "../Redux/UI/UISlice";
import EmbedCenter from "./Embeds/EmbedCenter";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import { useGetAllShowrunnerGroupsQuery } from "../Redux/API/PublicAPI";
import GenerateHatchcode from "../Tools/Venue/GenerateHatchcode";

interface IShowrunnerToolboxProps {
  SRID?: string;
}

export default function ShowrunnerToolbox({ SRID }: IShowrunnerToolboxProps) {
  const dispatch = useAppDispatch();
  const srGroups = useGetAllShowrunnerGroupsQuery();
  const showrunner = srGroups.data?.[SRID!];

  const currentView = useAppSelector(
    (state) => state.ui.views.showrunnerToolbox.view
  );

  return (
    <LoadingWrapper queryResponse={[srGroups]}>
      <>
        {currentView === 0 ? (
          <>
            <div className="">
              <h2 className="text-2xl font-black text-center p-2">
                Showrunner Toolbox
              </h2>
              <p className="text-center">
                Welcome to the toolbox: all of the tools you need to make your
                showrunner experience smoother than ever are now all available
                in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col items-center p-12">
                <h1 className="text-2xl font-black text-center">
                  Embed Center
                </h1>
                <p className="text-center">
                  We provide fast, simple, and mobile-responsive embeds for your
                  own website; that means when you update TuneHatch, your
                  website is updated automatically. We offer step-by-step guides
                  and personal support to help you get up and running no matter
                  what hosting service you use.
                </p>
                <div>
                  <LabelButton
                    className="bg-amber-500 text-white mt-5 cursor-pointer"
                    onClick={() =>
                      dispatch(
                        updateView({
                          target: "showrunnerToolbox",
                          category: "documents",
                          view: "embedCenter",
                        })
                      )
                    }
                  >
                    Embed Center
                  </LabelButton>
                </div>
              </div>

              <div className="flex flex-col items-center p-12">
                <h1 className="text-2xl font-black text-center">HatchCode</h1>
                <p className="text-center">
                  HatchCode is the fastest and easiest way to transform a
                  cash-only venue into one that can take credit cards and Apple
                  Pay at the door, with no additional equipment required;
                  increasing turnout and lowering wait times.
                </p>
                <LabelButton
                  className="bg-amber-500 text-white mt-5 cursor-pointer"
                  onClick={() =>
                    dispatch(
                      updateView({
                        target: "showrunnerToolbox",
                        category: "documents",
                        view: "hatchcodeGenerator",
                      })
                    )
                  }
                >
                  Embed Center
                </LabelButton>
              </div>
            </div>
          </>
        ) : (
          <div className="p-2 flex items-center">
            <i
              className="material-symbols-outlined cursor-pointer"
              onClick={() =>
                dispatch(
                  updateView({
                    target: "showrunnerToolbox",
                    view: 0,
                  })
                )
              }
            >
              arrow_back
            </i>
            <p className="text-xl font-black ml-2">
              {currentView === "performanceAgreement" &&
                "Performance Agreement"}
              {currentView === "embedCenter" && "Embed Center"}
              {currentView === "hatchcodeGenerator" && "HatchCode"}
            </p>
          </div>
        )}

        {currentView === "embedCenter" && <EmbedCenter SGID={SRID} />}
        {currentView === "hatchcodeGenerator" && (
          <GenerateHatchcode SRID={SRID} />
        )}
      </>
    </LoadingWrapper>
  );
}
