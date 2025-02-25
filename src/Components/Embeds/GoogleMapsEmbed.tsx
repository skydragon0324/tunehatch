import React from "react";

function GoogleMapsEmbed(props: {
  title?: string;
  address: string;
  className?: string;
}) {
  return (
    <iframe
      title={props.title || "googleMapsEmbed"}
      className={`${props.className ? props.className : "w-100"}`}
      loading="lazy"
      src={`https://www.google.com/maps/embed/v1/search?q=${props.address}&key=AIzaSyCZMhjQx75lWDtUC-AAkENbCdUuHBhAti0`}
    ></iframe>
  );
}

export default GoogleMapsEmbed;
