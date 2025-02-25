import React, { useEffect, useState } from "react";
import {
  KeyofThFlyerFontIndex,
  TH_FLYER_ASPECT_RATIOS,
  TH_FLYER_FONT_INDEX,
  TH_FLYER_TEMPLATES,
} from "../../../Helpers/flyerConfig";
import ToggleSlider from "../../../Components/Inputs/InputTypes/ToggleSlider";

export default function FlyerCustomization(props: {
  flyerOptions: any;
  onChange: (e: any) => void;
}) {
  const [sliderValue, setSliderValue] = useState(
    props.flyerOptions.selectedFlyer.id || 1
  );

  useEffect(() => {
    let options = props.flyerOptions;
    options.selectedFlyer = TH_FLYER_TEMPLATES[sliderValue];
    options.fonts.color = TH_FLYER_TEMPLATES[sliderValue].fontColor;
    props.onChange(options);
  }, [sliderValue]);

  return (
    <div className="relative w-full z-20">
      <div className="w-full">
        <p className="w-full text-center">
          {TH_FLYER_TEMPLATES[sliderValue].name}
        </p>
        <input
          type="range"
          className="w-full"
          min="0"
          value={sliderValue}
          max={TH_FLYER_TEMPLATES.length - 1}
          onChange={(e) => {
            setSliderValue(e.target.value);
          }}
        />
      </div>
      <p className="text-sm md:pl-3">Font Options</p>
      <div className="w-full flex items-center justify-around md:m-2 border rounded overflow-hidden">
        {Object.keys(TH_FLYER_FONT_INDEX).map((label) => {
          let fontConfig = TH_FLYER_FONT_INDEX[label as KeyofThFlyerFontIndex];
          return (
            <div
              className={`flex items-center justify-center flex-1 p-3 ${
                (props.flyerOptions.selectedFont ||
                  props.flyerOptions.selectedFlyer.font) === label
                  ? "bg-gray-50 text-blue-400"
                  : "hover:bg-gray-100"
              }`}
              onClick={() =>
                props.onChange({
                  ...props.flyerOptions,
                  selectedFont: fontConfig.label,
                })
              }
            >
              <p
                className="text-center"
                style={{
                  fontFamily: fontConfig.family,
                  fontSize: 1 * fontConfig.scale + "rem",
                  // TODO: PubGenius -> lineHeightScale and padding are not properties of TH_FLYER_FONT_INDEX constant. Review this logic.
                  lineHeight: 1 * fontConfig.scale + "rem",
                  // lineHeight:
                  //   1 * (fontConfig.lineHeightScale || fontConfig.scale) +
                  //   "rem",
                  // padding: fontConfig.padding,
                }}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-sm md:pl-3">Aspect Ratio</p>
      <div className="w-full flex items-center justify-around md:m-2 border rounded overflow-hidden">
        {Object.keys(TH_FLYER_ASPECT_RATIOS).map((orientation) => {
          return (
            <div
              className={`flex items-center justify-center flex-1 p-3 ${
                (props.flyerOptions.selectedOrientation ||
                  props.flyerOptions.selectedFlyer.orientation) === orientation
                  ? "bg-gray-50 text-blue-400"
                  : "hover:bg-gray-100"
              }`}
              onClick={() =>
                props.onChange({
                  ...props.flyerOptions,
                  selectedOrientation: orientation,
                })
              }
            >
              <p className="text-center" style={{ lineHeight: "1px" }}>
                <i className="material-symbols-outlined">crop_{orientation}</i>
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col mx-auto p-5 gap-2">
        <ToggleSlider
          label="Show Address On Flyer"
          value={props.flyerOptions.showAddress}
          clickFn={() =>
            props.onChange({
              ...props.flyerOptions,
              showAddress: !props.flyerOptions.showAddress,
            })
          }
        />
        <ToggleSlider
          label="Hide Artist Images"
          value={!props.flyerOptions.showArtistImages}
          clickFn={() =>
            props.onChange({
              ...props.flyerOptions,
              showArtistImages: !props.flyerOptions.showArtistImages,
            })
          }
        />
      </div>
    </div>
  );
}
