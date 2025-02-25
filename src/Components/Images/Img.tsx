import React, { Ref, useEffect, useState } from "react";
import Hatchy from "../../Images/ChickLogo.png";
import {
  IMAGE_URL,
  PUBLIC_URL,
  // SERVER_URL,
} from "../../Helpers/configConstants";

interface Props {
  src?: string;
  localSrc?: string;
  fallback?: string;
  stopPropagation?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  alt?: string;
  autoremove?: boolean;
  hideHatchy?: boolean;
  bgBlack?: boolean;
  gradientAlt?: boolean;
  className?: string;
  blackAlt?: boolean;
  style?: {};
  title?: string;
  ref?: Ref<HTMLImageElement>;
}

export default React.forwardRef<HTMLImageElement, Props>(
  (props: Props, ref) => {
    const getSource = () => {
      return props.src || props.localSrc
        ? props.src
          ? props.src
          : props.localSrc
        : props.bgBlack
        ? Hatchy
        : "";
    };
    const [errCount, setErrCount] = useState(0);
    const [src, setSource] = useState(getSource());
    const [prefix, setPrefix] = useState(
      props.src ? IMAGE_URL : PUBLIC_URL ? PUBLIC_URL : props.bgBlack ? "" : ""
    );

    useEffect(() => {
      setSource(getSource());
    }, [props.src, props.localSrc]);

    useEffect(() => {}, [errCount]);

    useEffect(() => {
      if (
        (props.localSrc && src?.includes("https://")) ||
        src?.includes("blob:")
      ) {
        setPrefix("");
      }
      if(src){
        console.log(src)
      }
    }, [src]);
    return (
      <img
        ref={ref}
        src={prefix + src}
        title={props.title}
        alt={props.alt}
        className={`${props.className ? props.className : ""} ${
          props.blackAlt ? "bg-black" : ""
        } object-cover flex-shrink-0`}
        style={props.style ? props.style : {}}
        onClick={
          props.onClick
            ? (e) => {
                props.stopPropagation && e.stopPropagation();
                props.onClick && props.onClick(e);
              }
            : null
        }
        onError={({ currentTarget }) => {
          // currentTarget.onerror = null;
          currentTarget.src =
            props.blackAlt || props.gradientAlt
              ? ""
              : prefix + props.fallback || Hatchy;
          setErrCount(errCount + 1);
          if (errCount > 10) {
            if (props.autoremove) {
              currentTarget.remove();
            } else if (!props.hideHatchy) {
              currentTarget.src = Hatchy;
            }
          }
        }}
      />
    );
  }
);
