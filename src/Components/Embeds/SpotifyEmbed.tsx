import React from "react";

function SpotifyEmbed(props: { link?: string; className?: string; }) {
  var processedLink = props.link.split("/");
  var linkLength = processedLink.length;
  if (!processedLink[linkLength - 1]) {
    processedLink.pop();
    linkLength = processedLink.length;
  }
  const type = processedLink[linkLength - 2];
  const id = processedLink[linkLength - 1];
  return (
    <div className={props.className ? props.className : ""}>
      <iframe
        title="spotify"
        src={"https://open.spotify.com/embed/" + type + "/" + id}
        width="100%"
        height="200px"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
}
export default SpotifyEmbed;
