import React, { useRef, useState } from "react";
import { useAppDispatch } from "../../../hooks";

export default function Dropdown(props: {
  defaultValue?: any;
  className?: string;
  optionMap: {
    [option: string | number]: string | number;
  };
  colorMap?: { [key: string]: any }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement> | string) => void;
  useSelectionColor?: boolean;
}) {
  const [selectedOption, setSelectedOption] = useState(props.defaultValue);
  // Function to handle the select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("changed");
    const newSelectedOption = e.target.value;
    setSelectedOption(newSelectedOption);
    props.onChange && props.onChange(newSelectedOption);
    return selectedOption;
  };
  const ref = useRef<HTMLSelectElement>(null);
  return !props.useSelectionColor ? (
    <div>
      <select
        value={selectedOption}
        onChange={(e) => handleSelectChange(e)}
        className={props.className}
        style={
          props.useSelectionColor && props.colorMap && selectedOption
            ? {
                backgroundColor: props.colorMap[selectedOption].color,
                // color: props.colorMap[selectedOption].color
              }
            : {}
        }
      >
        {Object.keys(props.optionMap).map((option, index) => {
          return (
            <option key={"select/" + index} value={option}>
              {props.optionMap[option]}
            </option>
          );
        })}
      </select>
    </div>
  ) : (
    <>
      <div className={props.className ? props.className : ""}>
        <select
          ref={ref}
          tabIndex={1}
          value={selectedOption}
          onChange={(e) => {
            handleSelectChange(e);
            ref.current && ref.current.blur();
          }}
          className="peer w-full h-full absolute rounded-full"
          style={
            props.useSelectionColor && props.colorMap && selectedOption
              ? {
                  backgroundColor: "transparent",
                  color: "transparent",
                }
              : {}
          }
        >
          {Object.keys(props.optionMap).map((option, index) => {
            return (
              <option key={"select/" + index} value={option}>
                {props.optionMap[option]}
              </option>
            );
          })}
        </select>
        <div
          className="absolute peer-focus-within:rotate-180 transition-all w-full h-full rounded-full flex items-center justify-center pointer-events-none"
          style={
            props.useSelectionColor && props.colorMap && selectedOption
              ? {
                  backgroundColor: props.colorMap[selectedOption].color,
                }
              : {}
          }
        >
          <span className="material-symbols-outlined bg-transparent pointer-events-none">
            expand_more
          </span>
        </div>
      </div>
    </>
  );
}
