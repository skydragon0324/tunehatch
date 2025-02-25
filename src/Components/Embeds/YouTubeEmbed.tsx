import React, { useRef } from "react";

function YouTubeEmbed(props: { link?: string; height?: string }) {
  let short = false;
  if (props.link?.includes("shorts")) {
    short = true;
  }
  const videoID = props.link?.match(
    new RegExp(
      /.*?(?:youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?\s]*).*/,
    ),
  )?.[1];
  const processedLink = "https://www.youtube.com/embed/" + videoID;
  const frame = useRef(null);
  return (
    <div className={`ytEmbedContainer ${short ? "ytShort" : ""}`}>
      <iframe
        ref={frame}
        width="100%"
        height="100%"
        className={`ytEmbed ${props.height ? props.height : "aspect-video"} ${
          short ? "ytShort" : ""
        }`}
        src={processedLink}
        title="YouTube Video Player"
        // frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
export default YouTubeEmbed;
