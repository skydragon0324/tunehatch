import React, { useEffect, useState } from "react";

function InstagramEmbed(props: { instagram?: string }) {
  const [hasContent, setHasContent] = useState(true);

  useEffect(() => {
    if (window && document && props.instagram) {
      const script = document.createElement("script");
      const body = document.getElementsByTagName("body")[0];
      script.src = "//www.instagram.com/embed.js";
      script.onload = () => {
        // Check if Instagram content is available
        const instagramMedia = document.querySelector(".instagram-media");
        if (!instagramMedia || !instagramMedia.hasChildNodes()) {
          // No content loaded, handle accordingly
          setHasContent(false);
        }
      };
      body.appendChild(script);
    }
  }, [props.instagram]);

  if (!props.instagram || !hasContent) {
    return <></>; // Render nothing if there's no Instagram content or if it failed to load
  }

  return (
    <>
      <div className="instagramEmbed">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={`https://www.instagram.com/${
            props.instagram || "tunehatch"
          }/?utm_source=ig_embed&amp;utm_campaign=loading`}
          data-instgrm-version="14"
        ></blockquote>
      </div>
    </>
  );
}

export default InstagramEmbed;
