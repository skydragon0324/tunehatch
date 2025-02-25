import React from "react";
import SadHatchy from "../Images/SadHatchy.png";
import Img from "../Components/Images/Img";

export default function ErrorPage(props: {
  title?: string;
  description?: string | React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-100 flex-grow">
      <h1 className="text-5xl p-4 font-black text-center">
        {props.title || "We can't seem to find that."}
      </h1>
      <Img className="w-64 h-64 mx-auto" localSrc={SadHatchy} />
      <p className="text-center p-4 pl-10 pr-10 font-medium text-lg">
        {props.description ||
          "Please double-check to make sure you put in the right link."}
      </p>
      <p className="absolute bottom-0 p-8 text-center">
        Still having issues? We're here to help. Send us an email at{" "}
        <a className="text-blue-500" href="mailto:info@tunehatch.com">
          info@tunehatch.com
        </a>
      </p>
    </div>
  );
}
