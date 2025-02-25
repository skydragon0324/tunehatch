import React from "react";
function TikTokEmbed(props: { link?: string; }) {
  var processedLink = props.link.split("/");
  var linkLength = processedLink.length;
  if (!processedLink[linkLength - 1]) {
    processedLink.pop();
    linkLength = processedLink.length;
  }
  // example of broken link https://www.tiktok.com/t/ZTRnwvXY4/
  // should be https://www.tiktok.com/@.caleny/video/7186383640010607918
  const embedID = processedLink[linkLength - 1];
  return (
    <div className="tikTokEmbedContainer">
      <div className="tikTokEmbed">
        <iframe
          title="TikTok"
          src={"https://www.tiktok.com/embed/" + embedID}
          allowFullScreen
          // frameBorder="0"
          className="w-full"
          height="575px"
          scrolling="no"
          allow="encrypted-media;"
        ></iframe>
      </div>
    </div>
  );
}

export default TikTokEmbed;
