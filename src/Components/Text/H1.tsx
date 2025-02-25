import React from "react";

export default function H1(props: {className: string, children: any}){
    return <h1 className="text-black font-black leading normal text-5xl">
        {props.children}
    </h1>
}