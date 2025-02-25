import React, { useEffect, useRef, useState } from "react";
import { PUBLIC_URL } from "../Helpers/configConstants";
// import { useSelector } from "react-redux";
import {
  useGetAllShowrunnerGroupsQuery,
  useGetAllVenuesQuery,
} from "../Redux/API/PublicAPI";

function EmbedGenerator(props: {
  venueID?: string;
  customizationConfig?: { name?: string; label?: string; type?: string }[];
  embedPath?: string;
  embedData?: string;
  height?: string;
  width?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  border?: string;
  borderColor?: string;
  borderRadius?: string;
  title?: string;
}) {
  const { embedData, venueID } = props;

  const venues = useGetAllVenuesQuery();
  const venue = venueID ? venues.data?.[venueID] : null;

  const showrunnerGroups = useGetAllShowrunnerGroupsQuery();
  const showrunner = embedData ? showrunnerGroups.data?.[embedData] : null;

  const [styleOptions, setStyleOptions] = useState("");
  const [darkPreview, setDarkPreview] = useState(false);
  const customizationConfig = props.customizationConfig || [];
  const [embedSrc, setEmbedSrc] = useState(
    PUBLIC_URL + props.embedPath + props.embedData ||
      venueID + "/" + styleOptions
  );
  const [styles, setStyles] = useState<{ [key: string]: string }>({
    height: props.height || "100%",
    width: props.width || "100%",
    minWidth: props.minWidth || "300px",
    minHeight: props.minHeight || "700px",
    maxWidth: props.maxWidth || "80vw",
    border: props.border || "none",
    borderColor: props.borderColor || "orange",
    borderRadius: props.borderRadius || "10px",
    marginLeft: "auto",
    marginRight: "auto",
  });
  const embedRef = useRef(null);
  const [localView, setLocalView] = useState(null);
  const [codeSnippet, setCodeSnippet] = useState(null);
  const slv = (target?: string) => {
    if (target) {
      setLocalView(target);
    } else {
      setLocalView(null);
    }
  };
  const updateCodeSnippet = () => {
    if (embedRef) {
      const sStyles = `height: ${styles.height}; width: ${styles.width}; min-width: ${styles.minWidth}; min-height: ${styles.minHeight}; max-width: ${styles.maxWidth}; border: ${styles.border}; border-color: ${styles.borderColor}; border-radius: ${styles.borderRadius}; margin-left: ${styles.marginLeft}; margin-right: ${styles.marginRight}`;
      let text =
        "<iframe title='" +
        props.title +
        "' style='" +
        sStyles +
        "' src='" +
        PUBLIC_URL +
        props.embedPath +
        (props.embedData || venueID) +
        "/" +
        styleOptions +
        "' onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight + 'px';}(this));'></iframe>";
      setCodeSnippet(text);
      setEmbedSrc(
        PUBLIC_URL +
          props.embedPath +
          (props.embedData || venueID) +
          "/" +
          styleOptions
      );
    }
  };
  const updateStyles = (attr: string, value: string) => {
    let ts: { [key: string]: string } = { ...styles };
    ts[attr] = value;
    setStyles(ts);
  };
  const applyStyleOption = (attr: string, value: string | boolean) => {
    let styleObj: { [key: string]: any } = {};
    let styleString = "";
    let tso = styleOptions;
    let tsoa = tso.split("&");

    tsoa.forEach((style) => {
      let [styleKey, styleValue] = style.split("=");
      styleObj[styleKey] = styleValue;
    });
    styleObj[attr] = value;
    if (styleObj["darkMode"]) {
      setDarkPreview(true);
    } else {
      setDarkPreview(false);
    }
    Object.keys(styleObj).forEach((styleKey, i) => {
      let updatedStyles = 0;
      if (styleKey) {
        let tv = styleObj[styleKey];
        if (updatedStyles > 0) {
          styleString = styleString.concat(styleString, "&");
        }
        styleString = styleString.concat(styleString, styleKey, "=", tv, "&");
        updatedStyles = updatedStyles + 1;
      }
    });
    setStyleOptions(styleString);
  };
  useEffect(() => {
    updateCodeSnippet();
  }, [styles, styleOptions]);

  useEffect(() => {
    updateStyles("borderColor", venue?.themeColor || "orange");
    updateCodeSnippet();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-2xl font-black">{props.title}</h1>
        <div className="flex flex-row gap-2">
          {customizationConfig.length ? (
            <span
              className="bg-blue-400 p-1 px-2 text-white rounded-full"
              onClick={() => slv("customize")}
            >
              Customize
            </span>
          ) : (
            <></>
          )}
          <span
            className="bg-orange p-1 px-2 flex items-center text-white rounded-full"
            onClick={() => (localView !== "getCode" ? slv("getCode") : slv())}
          >
            Get Embed Code{" "}
            <span className="material-symbols-outlined text-base">
              {localView === "getCode" ? "expand_less" : "expand_more"}
            </span>
          </span>
        </div>
      </div>
      {localView === "customize" && (
        <div className="flex-col ">
          <div className="mt-2">
            {Object.keys(customizationConfig).map((cOpt) => {
              let optData = customizationConfig[Number(cOpt)];
              if (optData.type === "checkbox") {
                return (
                  <>
                    <div className="flex gap-1">
                      <div>
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            applyStyleOption(optData.name, e.target.checked)
                          }
                        />
                      </div>
                      <div>
                        <p>{optData.label}</p>
                      </div>
                    </div>
                  </>
                );
              } else {
                return (
                  <input
                    type={optData.type}
                    placeholder={optData.label}
                    onChange={(e) =>
                      applyStyleOption(optData.name, e.target.value)
                    }
                  />
                );
              }
            })}
          </div>
        </div>
      )}
      {localView === "getCode" ? (
        <div className="embedCode">
          <div className="flex-col std-pad flex-center-align">
            <p className="text-center">
              To use this embed, copy and paste the code snippet below into your
              website builder.
            </p>
            <div className="flex-row fullWidth">
              <textarea
                defaultValue={codeSnippet}
                className="w-full h-64 bg-slate-700 text-gray-100 p-3 rounded-lg"
              ></textarea>
              <div className="flex flex-col">
                <h2 className="centered text-xl font-black text-center">
                  Embed Resources
                </h2>
                <a
                  className="text-center text-blue-400 underline"
                  href="https://wordpress.com/support/wordpress-editor/blocks/custom-html-block/#supported-html-tags"
                  rel="noreferrer"
                  target="_blank"
                >
                  WordPress Tutorial
                </a>
                <a
                  className="text-center text-blue-400 underline"
                  href="https://university.webflow.com/lesson/custom-code-embed"
                  rel="noreferrer"
                  target="_blank"
                >
                  Webflow Tutorial
                </a>
                <a
                  className="text-center text-blue-400 underline"
                  href="https://support.wix.com/en/article/wix-editor-embedding-a-site-or-a-widget#adding-an-embed"
                  rel="noreferrer"
                  target="_blank"
                >
                  Wix Tutorial
                </a>
                <a
                  className="text-center text-blue-400 underline"
                  href="https://support.squarespace.com/hc/en-us/articles/205815928-Adding-custom-code-to-your-site"
                  rel="noreferrer"
                  target="_blank"
                >
                  Squarespace Tutorial
                </a>
                <h2 className="text-center font-black text-2xl">
                  Still Need Help?
                </h2>
                <p className="text-center">
                  We're here to support you. If you need help adding TuneHatch
                  embeds to your venue's website, please shoot us an email at{" "}
                  <a
                    className="text-blue-400 underline"
                    href="mailto:info@tunehatch.com"
                  >
                    info@tunehatch.com
                  </a>
                  , and we'll help you get set up right away.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-4">
            Display a list of your upcoming TuneHatch shows, directly on your
            website.
          </p>
          <p className="text-center text-gray-400 text-xs">Live Preview</p>
          <div className="flex-col border-2 rounded-lg">
            {venue || showrunner ? (
              <iframe
                className={darkPreview ? "bg-black" : ""}
                title={props.title}
                style={styles}
                src={embedSrc}
              ></iframe>
            ) : null}
          </div>{" "}
        </>
      )}
    </>
  );
}

export default EmbedGenerator;
