import React, { useContext, useEffect, useRef, useState } from "react";
import { SelectContext } from "../Layout/SelectGrid/SelectGridContexts";
import StickyContainer from "../Layout/StickyContainer";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../Redux/API/IndustryAPI";
import { useAppSelector } from "../../hooks";
import LoadingWrapper from "../Layout/LoadingWrapper";
import { Conversation } from "../../Helpers/shared/Models/Conversations";
import IDPicker from "./IDPicker";
import { useNavigate } from "react-router-dom";

export default function MessagePanel(props: {
  recipientID?: string;
  recipientType?: string;
}) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.data);
  const responseID = user.responseID;
  const [sendMessage, messageData] = useSendMessageMutation();
  const [message, updateMessage] = useState("");
  const { selected, selectFn } = useContext(SelectContext);
  const messagesQuery = useGetMessagesQuery({ SECRET_UID: user.uid });
  const messages: Array<Conversation> = messagesQuery.currentData;
  const convo = selected
    ? messages?.find(
        (convo) =>
          (props.recipientID &&
            convo.participants?.includes(responseID) &&
            convo.participants?.includes(props.recipientID)) ||
          convo?._key === selected
      )
    : null;

  const handleSendMessage = (e: any) => {
    console.log(props.recipientID);
    console.log(responseID?.id)
    e.preventDefault();
    updateMessage("");
    sendMessage({
      SECRET_UID: user.uid,
      participants: convo?.participants.includes(responseID?.id)
        ? convo?.participants
        : [props.recipientID, responseID?.id],
      responseID: responseID,
      value: message,
    });
  };
  const handleScroll = () => {
    messagePanelRef?.current?.scrollTo(
      0,
      messagePanelRef?.current?.scrollHeight + 500
    );
  };

  useEffect(() => {
    if (messageData.status === "pending") {
      handleScroll();
      if (props.recipientID && props.recipientType) {
        navigate("/messages");
      }
    }
  }, [messageData]);

  useEffect(() => {
    setTimeout(() => handleScroll(), 50);
  }, [convo?.participants, selected]);

  useEffect(() => {}, []);

  const messagePanelRef = useRef(null);

  return (
    <LoadingWrapper
      disableOverflow
      requiredData={[messages || props.recipientID]}
    >
      {selected ? (
        <>
          <div className="flex flex-col relative p-2 h-full overflow-hidden">
            <div className="mb-2">
              <IDPicker
                participants={
                  convo?.participants || [props.recipientID, responseID?.id]
                }
                selected={
                  selected
                }
              />
            </div>
            <div
              className="flex flex-col gap-1 h-full overflow-scroll mb-3"
              ref={messagePanelRef}
            >
              {convo?.messages ? (
                convo.messages.map((message) => {
                  return (
                    <div
                      key={`${message.sender}/${message.timestamp}`}
                      className={`w-auto p-2 rounded-full ${
                        message.sender === user.displayUID
                          ? "ml-auto bg-orange text-white mr-2"
                          : "bg-white border border-gray-200 mr-auto"
                      }`}
                    >
                      <span>{message.content}</span>
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>

            <StickyContainer className="flex w-full mx-auto justify-center pb-2">
              <form className="w-11/12" onSubmit={(e) => handleSendMessage(e)}>
                <input
                  className="w-full mx-auto rounded-full border bottom-2 p-2"
                  type="text"
                  value={message}
                  onChange={(e) => updateMessage(e.target.value)}
                />
              </form>
            </StickyContainer>
          </div>
        </>
      ) : (
        <></>
      )}
    </LoadingWrapper>
  );
}
