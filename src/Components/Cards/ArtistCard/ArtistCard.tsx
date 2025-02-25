import React, { useEffect, useState } from "react";
import Card from "../../Layout/Card";
import Img from "../../Images/Img";
import Button from "../../Buttons/Button";
import { openSidebar } from "../../../Redux/UI/UISlice";
import { getArtistName } from "../../../Helpers/HelperFunctions";
import {
  useGetAllArtistsQuery,
  useGetUsersQuery,
} from "../../../Redux/API/PublicAPI";
import PerformanceHistoryLabel from "../../Labels/PerformanceHistoryLabel";
import IconButton from "../../Buttons/IconButton";
import { useAppDispatch } from "../../../hooks";
import { Type } from "../../../Helpers/shared/Models/Type";
import { useNavigate } from "react-router-dom";

export default function ArtistCard(props: {
  id: string;
  name?: string;
  viewType?: Type;
  showID?: string;
  applicantView?: boolean;
  invitedView?: boolean;
  confirmedView?: boolean;
  selected?: boolean;
  hideIfHatchy?: boolean;
  onClick?: () => void;
}) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const artists = useGetAllArtistsQuery();
  const [skip, setSkip] = useState(true);
  const user = useGetUsersQuery([props.id], { skip: skip });
  const artist = artists?.data?.[props.id] || user?.data?.[props.id];
  const [optionsOpen, toggleOptions] = useState(props.applicantView || false);
  useEffect(() => {
    if (!artist && artists.isSuccess) {
      setSkip(false);
    }
  }, [artists.isSuccess]);

  return artist ? (
    <>
    {
      !props.hideIfHatchy || artist.avatar ? <Card
        className={`w-44 ${props.selected ? "border-2 border-orange" : ""}`}
        onClick={props.onClick ? () => props.onClick() : null}
      >
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center flex-grow w-full">
            <Img src={artist.avatar} className="w-36 h-36 p-4 rounded-full" />
            <div className="flex flex-col w-full flex-grow flex-shrink-0 p-2 justify-center items-center">
              <h1 className="text-xl font-black justify-center text-center">
                {getArtistName(artist)}
              </h1>
              <PerformanceHistoryLabel id={props.id} />
              {/* <SocialStatsLabel id={props.id}/> */}
            </div>
            {props.applicantView && <></>}
            {props.invitedView && <></>}
            {(props.confirmedView ||
              props.invitedView ||
              props.applicantView) && (
              <>
                {!props.applicantView && (
                  <Button
                    inline
                    onClick={() => toggleOptions(!optionsOpen)}
                    className="bg-gray-50 w-full border-t h-9 border-gray hover:bg-gray-200 transition-all rounded-none p-2"
                  >
                    Options
                  </Button>
                )}
                {optionsOpen && (
                  <>
                    {props.confirmedView && (
                      <div className="flex flex-wrap w-full">
                        <IconButton
                          className="flex items-center justify-center border-t border-r border-b hover:bg-gray-200 transition-all p-2"
                          icon="mail"
                          iconColor="text-orange font-medium"
                          onClick={() => {
                            dispatch(openSidebar({
                              status: true,
                              component: "MessageCenter",
                              data: {
                                recipientID: props.id,
                                recipientType: "artist"
                              },
                            }))
                          }
                          }
                        />
                        <IconButton
                          className="flex items-center justify-center border-t border-l border-b hover:bg-gray-200 transition-all p-2"
                          icon="block"
                          iconColor="text-red-400 font-medium"
                          onClick={() =>
                            dispatch(
                              openSidebar({
                                status: true,
                                component: "RespondToShow",
                                data: {
                                  viewType: props.viewType,
                                  artistID: props.id,
                                  showID: props.showID,
                                  intent: "cancel",
                                  type: "confirmed",
                                },
                              })
                            )
                          }
                        />
                      </div>
                    )}
                    {props.invitedView && (
                      <div className="flex flex-wrap w-full">
                        <IconButton
                          className="flex items-center justify-center border-t border-r border-b hover:bg-gray-200 transition-all p-2"
                          icon="mail"
                          onClick={() => {
                            dispatch(openSidebar({
                              status: true,
                              component: "MessageCenter",
                              data: {
                                recipientID: props.id,
                                recipientType: "artist"
                              },
                            }))
                          }
                          }
                          iconColor="text-orange font-medium"
                        />
                        <IconButton
                          className="flex items-center justify-center border-t border-l border-b hover:bg-gray-200 transition-all p-2"
                          icon="block"
                          iconColor="text-red-400 font-medium"
                          onClick={() =>
                            dispatch(
                              openSidebar({
                                status: true,
                                component: "RespondToShow",
                                data: {
                                  viewType: props.viewType,
                                  artistID: props.id,
                                  showID: props.showID,
                                  intent: "cancel",
                                  type: "invited",
                                },
                              })
                            )
                          }
                        />
                      </div>
                    )}
                    {props.applicantView && (
                      <div className="flex flex-wrap w-full">
                        <IconButton
                          className="flex items-center justify-center border-t border-r border-b hover:bg-gray-200 transition-all p-2"
                          icon="done"
                          iconColor="text-green-400 font-medium"
                          onClick={() =>
                            dispatch(
                              openSidebar({
                                status: true,
                                component: "RespondToShow",
                                data: {
                                  viewType: props.viewType,
                                  artistID: props.id,
                                  showID: props.showID,
                                  intent: "accept",
                                  type: "application",
                                },
                              })
                            )
                          }
                        />
                        <IconButton
                          className="flex items-center justify-center border-t border-r border-b hover:bg-gray-200 transition-all p-2"
                          icon="mail"
                          onClick={() => {
                            dispatch(openSidebar({
                              status: true,
                              component: "MessageCenter",
                              data: {
                                recipientID: props.id,
                                recipientType: "artist"
                              },
                            }))
                          }
                          }
                          iconColor="text-orange font-medium"
                        />
                        <IconButton
                          className="flex items-center justify-center border-t border-l border-b hover:bg-gray-200 transition-all p-2"
                          icon="block"
                          iconColor="text-red-400 font-medium"
                          onClick={() =>
                            dispatch(
                              openSidebar({
                                status: true,
                                component: "RespondToShow",
                                data: {
                                  viewType: props.viewType,
                                  artistID: props.id,
                                  showID: props.showID,
                                  intent: "reject",
                                  type: "application",
                                },
                              })
                            )
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <Button
            inline
            className="bg-blue-500 w-full text-white h-10 rounded-tr-none rounded-tl-none justify-self-end"
            action={openSidebar({
              status: true,
              component: "ViewProfile",
              data: { profileID: props.id, type: "user" },
            })}
          >
            Profile
          </Button>
        </div>
      </Card> : <></>}
    </>
  ) : !props.id && props.name ? (
    //use for off-platform confirmed artists. requires use of name prop.
    <>
      <Card
        className={`w-44 ${props.selected ? "border-2 border-orange" : ""}`}
        onClick={props.onClick ? () => props.onClick() : null}
      >
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-col justify-center items-center flex-grow w-full">
            <Img src={null} className="w-36 h-36 p-4 rounded-full" />
            <div className="flex flex-col w-full flex-grow flex-shrink-0 p-2 justify-center items-center">
              <h1 className="text-xl font-black justify-center text-center">
                {props.name}
              </h1>
            </div>
            {props.applicantView && <></>}
            {props.invitedView && <></>}
            {(props.confirmedView ||
              props.invitedView ||
              props.applicantView) && (
              <>
                {!props.applicantView && (
                  <Button
                    inline
                    onClick={() => toggleOptions(!optionsOpen)}
                    className="bg-gray-50 w-full border-t h-9 border-gray hover:bg-gray-200 transition-all rounded-none p-2"
                  >
                    Options
                  </Button>
                )}
                {optionsOpen && (
                  <>
                    {props.confirmedView && (
                      <div className="flex flex-wrap w-full">
                        <IconButton
                          className="flex items-center justify-center border-t border-l border-b hover:bg-gray-200 transition-all p-2"
                          icon="block"
                          iconColor="text-red-400 font-medium"
                          onClick={() =>
                            dispatch(
                              openSidebar({
                                status: true,
                                component: "RespondToShow",
                                data: {
                                  viewType: props.viewType,
                                  artistID: null,
                                  artistName: props.name,
                                  showID: props.showID,
                                  intent: "cancel",
                                  type: "confirmed",
                                },
                              })
                            )
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </>
  ) : (
    <></>
  );
}
