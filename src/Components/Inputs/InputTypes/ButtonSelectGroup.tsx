import React from "react";

export default function ButtonSelectGroup(props: {
  form: string;
  field: string;
  className?: string;
  onClick?: (e: any) => void;
  value: string;
  nextPageFn?: any;
  triggerPageChange?: boolean;
  optionMap: {
    name: string;
    description?: string;
    value: string;
    className?: string;
    descriptionClassName?: string;
  }[];
}) {
  return (
    <>
      <div className="w-full flex-col gap-2 flex flex-fix">
        {props.optionMap.map((option, i) => {
          return (
            <div
              key={"bsg/" + i}
              onClick={(e) => {
                props.onClick && props.onClick(option.value || option.name);
                props.triggerPageChange && props.nextPageFn();
              }}
              className={`${
                props.className
                  ? props.className
                  : "rounded-lg flex flex-col items-center justify-center p-8 w-full font-black border text-2xl"
              } ${
                props.value === (option.value || option.name)
                  ? "bg-orange text-white"
                  : ""
              }`}
            >
              <h1>{option.name}</h1>
              <p className="text-sm text-center font-normal">
                {option.description}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
