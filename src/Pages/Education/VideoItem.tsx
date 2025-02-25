import React from "react"

interface VideoItemProps {
    title?: string;
    description?: string;
    videosrc?: string;
    bgColor?: string;
}

export default function VideoItem(props: VideoItemProps) {
    return (
        <div className={`video-display justify-between mb-[2rem] bg-[${props?.bgColor}] p-8`}>
        <h1 className="text-black text-[35px] p-5 font-bold show">{props?.title}</h1>
        <div className="w-[30vw] h-[20rem] bg-white leading-[normal] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.25)] rounded-[1rem] overflow-y-auto hide">
          <h1 className="text-black text-[35px] p-5 font-bold">{props?.title}</h1>
          <p className="p-4"> {props?.description} </p>
        </div>
        <div>
          <iframe className="video-size" src={props?.videosrc} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
      </div>
    )
}