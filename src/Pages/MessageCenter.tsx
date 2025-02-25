import React, { useContext, useEffect, useState } from "react";
import SadHatchy from "../Images/SadHatchy.png";
import Img from "../Components/Images/Img";
import { getDisplayName, renderPageTitle } from "../Helpers/HelperFunctions";
import { useGetMessagesQuery } from "../Redux/API/IndustryAPI";
import { useAppSelector } from "../hooks";
import {
  useGetAllArtistsQuery,
  useGetAllShowrunnerGroupsQuery,
  useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";
import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import SelectGrid from "../Components/Layout/SelectGrid";
import { Conversation } from "../Helpers/shared/Models/Conversations";
import { trim } from "lodash";
import { SelectContext } from "../Components/Layout/SelectGrid/SelectGridContexts";
import MessagePanel from "../Components/MessagePanel";
import { useParams } from "react-router-dom";
import { Type } from "../Helpers/shared/Models/Type";

export default function MessageCenter(props: {
  recipientID?: string;
  recipientType?: Type | string;
}) {
  const user = useAppSelector((state) => state.user.data);
  const artistsQuery = useGetAllArtistsQuery();
  const venuesQuery = useGetAllVenuesQuery();
  const showrunnersQuery = useGetAllShowrunnerGroupsQuery();
  const showrunners = showrunnersQuery?.data;
  const artists = artistsQuery?.data;
  const venues = venuesQuery?.data;
  const messagesQuery = useGetMessagesQuery(
    { SECRET_UID: user.uid },
    { skip: !showrunners || !artists || !venues }
  );
  const params = useParams()
  const [recipientID, setRecipientID] = useState(params.recipientID || props.recipientID)
  const [recipientType, setRecipientType] = useState(params.recipientType || props.recipientType)
  const conversations = messagesQuery?.data;
  const [optionMap, setOptionMap] = useState([]);

  const [selectedConvo, setSelectedConvo] = useState(null)

  const checkForExistingConvo = () => {
    console.log("checking for existing conversation...")
    if(recipientID && recipientType && conversations){
      let existingResult = conversations.filter((convo: Conversation) => {
        if(convo.participants?.includes(user.displayUID) && convo.participants?.includes(recipientID)){
          console.log("found")
          return true;
        }else{
          return false;
        }
      });
      console.log(existingResult)
      if(existingResult.length){
        setSelectedConvo(existingResult[0]?._key)
      }else{
        setSelectedConvo("new")
      }
    }
  }

  useEffect(() => {
    renderPageTitle("Messages");
    checkForExistingConvo()
  }, []);

  useEffect(() => {
    checkForExistingConvo()
  }, [recipientID, recipientType, conversations])

  useEffect(() => {
    setOptionMap(
      conversations?.map((convo: Conversation) => {
        let participants: Array<string> = [];
        let src: string = "";
        if (convo.participants) {
          convo.participants.forEach((participant: string) => {
            if (artists[participant]) {
              let profile = artists[participant];
              participants.push(trim(getDisplayName("artist", profile)));
              src = profile.avatar
            } else if (venues[participant]) {
              let profile = venues[participant];
              participants.push(trim(profile.name));
              src = profile.avatar
            } else if (showrunners[participant]) {
              let profile = showrunners[participant];
              participants.push(trim(profile.name));
              src = profile.avatar
            } else {
              participants.push("Deactivated User");
            }
          });
        }
        return {
          label: participants.join(", "),
          sublabel: convo?.messages?.[convo?.messages?.length - 1]?.content,
          src: src,
          key: convo._key
        };
      })
    );
  }, [conversations]);

  return (
    <SelectGrid
      optionMap={optionMap}
      requiredData={[artists, venues, showrunners, conversations]}
      selected={selectedConvo}
    >
      <MessagePanel recipientID={recipientID} recipientType={recipientType}/>
    </SelectGrid>
  );
}
