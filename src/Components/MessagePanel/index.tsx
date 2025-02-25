import React, { useState } from "react";
import MessagePanel from "./MessagePanel";
import { useAppSelector } from "../../hooks";
export default function MessageController(props: {
    recipientID?: string;
    recipientType?: string;
}){
    return <MessagePanel recipientID={props.recipientID} recipientType={props.recipientType}/>
}