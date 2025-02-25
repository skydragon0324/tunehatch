import React, { createContext, useEffect, useState } from "react";
import LoadingWrapper from "../LoadingWrapper";
import SelectTile from "./SelectTile";
import { SelectContext } from "./SelectGridContexts";

export default function SelectGrid(props: {
  children: any;
  selected?: string;
  optionMap: Array<{
    key: string;
    label: string;
    sublabel?: string;
    src?: string;
  }>;
  requiredData?: Array<any>;
}) {
  const [selected, setSelected] = useState<string>(props.selected);

  useEffect(() => {
    if(selected !== props.selected){
      setSelected(props.selected);
    }
  }, [props.selected])
  return (
    <>
      <LoadingWrapper disableOverflow requiredData={props.requiredData}>
        <div className="flex relative h-full max-h-max overflow-hidden border-t @container flex-grow">
          <div className="grid grid-cols-12 w-full">
            <div className={`${selected ? "hidden @lg:block" : "col-span-12"} h-full @lg:col-span-3 border-r max-h-full overflow-auto`}>
              {props.optionMap?.map((option) => {
                return (
                  <SelectTile
                    key={option.key}
                    label={option?.label}
                    src={option?.src}
                    sublabel={option?.sublabel}
                    onClick={() => setSelected(option.key)}
                    selected={selected === option.key}
                  />
                );
              })}
            </div>
            <div className={`grid ${selected ? "col-span-12" : "hidden"} @lg:col-span-9 pt-8 h-full overflow-hidden`}>
              <div className="@lg:hidden absolute -mt-6 ml-2 @lg:mt-0 @lg:ml-0">
                <i className="material-symbols-outlined" onClick={() => setSelected(null)}>
                  arrow_back
                </i>
              </div>
              <SelectContext.Provider value={{selected: selected, selectFn: setSelected}}>
                {props.children}
              </SelectContext.Provider>
            </div>
          </div>
        </div>
      </LoadingWrapper>
    </>
  );
}
