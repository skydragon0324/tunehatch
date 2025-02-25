import React from "react";
// import Form from "../Components/Inputs/Form";
import PerformanceAgreementBuilder from "../Forms/PerformanceAgreementBuilderForm";
// import CategoryTabs from "../Components/Layout/CategoryTabs";
import { useAppDispatch, useAppSelector } from "../hooks";
import LabelButton from "../Components/Buttons/LabelButton";
import { updateView } from "../Redux/UI/UISlice";
import EmbedCenter from "./Embeds/EmbedCenter";
// import { useEditVenueMutation } from "../Redux/API/VenueAPI";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import { useGetAllVenuesQuery } from "../Redux/API/PublicAPI";
import GenerateHatchcode from "../Tools/Venue/GenerateHatchcode";
import StripeHandler from "../Components/Buttons/StripeHandler";

interface IVenueToolboxProps {
  venueID?: string;
}

export default function VenueToolbox(props: IVenueToolboxProps) {
  const dispatch = useAppDispatch();
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[props.venueID];
  // const [editProfile] = useEditVenueMutation();
  // const currentCategory = useAppSelector(
  //   (state) => state.ui.views.venueToolbox.category
  // );
  const currentView = useAppSelector(
    (state) => state.ui.views.venueToolbox.view
  );
  return (
    <LoadingWrapper queryResponse={[venues]}>
      {/* {currentCategory === "equipment" && (
        <Form
          name="editVenueToolbox"
          additionalAuthParams={{ venueID: props.venueID }}
          doneLabel="Save"
          completedLabel="Saved!"
          submitFn={editProfile}
          fixedNav
          media
          formMap={[
            [
              {
                fieldType: "title",
                className: "text-2xl font-black pl-2",
                defaultValue: "Equipment",
              },
              {
                fieldType: "toggleSlider",
                placeholder: "PA System",
                containerClassName: "flex w-1/2 pr-1 mt-4 font-black pl-2",
                field: "equipment.pa_system",
                defaultValue: venue.equipment.pa_system
              },
              {
                fieldType: "toggleSlider",
                placeholder: "Sound System",
                containerClassName: "flex w-1/2 pr-1 mt-4 font-black pl-2",
                field: "equipment.sound_system",
                defaultValue: venue.equipment.sound_system
              },
              {
                fieldType: "toggleSlider",
                placeholder: "Drums Allowed",
                containerClassName: "flex w-1/2 pr-1 mt-4 font-black pl-2",
                field: "equipment.drums_allowed",
                defaultValue: venue.equipment.drums_allowed
              },
              {
                fieldType: "toggleSlider",
                placeholder: "Acoustic Only",
                containerClassName: "flex w-1/2 pr-1 mt-4 font-black pl-2",
                field: "equipment.acoustic_only",
                defaultValue: venue.equipment.acoustic_only
              },
              {
                fieldType: "dropdown",
                field: "Mask Policy (optional)",
                defaultValue: venue.covid_restrictions?.mask,
                label: "Mask Policy",
                containerClassName: "flex flex-col mt-4 items-center pt-4",
                className: "flex w-full font-md",
                optionMap: {
                  no: "No Masks Required",
                  vaccinated: "Masks Required for Unvaccinated",
                  yes: "Everyone Must Mask",
                },
              },
            ],
          ]}
        />
      )} */}
      <>
        {currentView === 0 ? (
          <>
            <div className="">
              <h2 className="text-2xl font-black text-center p-2">
                Venue Toolbox
              </h2>
              <p className="text-center">
                Welcome to the toolbox: all of the tools you need to make your
                venue run smoother than ever are now all available in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col items-center p-12">
                <h1 className="text-2xl font-black text-center">Payouts</h1>
                <p className="text-center">
                  We partner with Stripe to ensure secure payment processing.
                  Connect your Payout Account to seamlessly get paid out for
                  shows, pay out your artists, and more.
                </p>
                <StripeHandler
                  className="bg-amber-500 text-white mt-5"
                  useLabelButton
                  viewType="venue"
                  targetID={props.venueID}
                  stripeID={venue?.stripe?.id}
                />
              </div>

              <div className="flex flex-col items-center p-12">
                <h1 className="text-2xl font-black text-center">
                  Performance Agreement
                </h1>
                <p className="text-center">
                  Avoid last-minute headaches by using our integrated venue
                  Performance Agreement. We make sure artists acknowledge every
                  section when they apply or are invited to perform at a show:
                  that makes staying on the same page simple.
                </p>
                <LabelButton
                  className="bg-amber-500 text-white mt-5"
                  onClick={() =>
                    dispatch(
                      updateView({
                        target: "venueToolbox",
                        category: "documents",
                        view: "performanceAgreement",
                      })
                    )
                  }
                >
                  Performance Agreement
                </LabelButton>
              </div>

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
                    className="bg-amber-500 text-white mt-5"
                    onClick={() =>
                      dispatch(
                        updateView({
                          target: "venueToolbox",
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
                  className="bg-amber-500 text-white mt-5"
                  onClick={() =>
                    dispatch(
                      updateView({
                        target: "venueToolbox",
                        category: "documents",
                        view: "hatchcodeGenerator",
                      })
                    )
                  }
                >
                  View HatchCode
                </LabelButton>
              </div>
            </div>
          </>
        ) : (
          <div className="p-2 flex items-center">
            <i
              className="material-symbols-outlined"
              onClick={() =>
                dispatch(
                  updateView({
                    target: "venueToolbox",
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
        {currentView === "performanceAgreement" && (
          <div className="p-4">
            <PerformanceAgreementBuilder venueID={props.venueID} />
          </div>
        )}
        {currentView === "embedCenter" && (
          <EmbedCenter venueID={props.venueID} />
        )}
        {currentView === "hatchcodeGenerator" && (
          <GenerateHatchcode venueID={props.venueID} />
        )}
      </>
    </LoadingWrapper>
  );
}
