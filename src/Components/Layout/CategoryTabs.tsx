import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { UIStateView, updateView } from "../../Redux/UI/UISlice";

export default function CategoryTabs(props: {
  view: UIStateView;
  defaultCategory?: string;
  tabs: {
    label: string;
    category: string;
    hidden?: boolean;
  }[];
}) {
  const dispatch = useAppDispatch();
  const currentCategory = useAppSelector(
    (state) => state.ui.views[props.view].category
  );
  useEffect(() => {
    if (props.defaultCategory) {
      dispatch(
        updateView({
          target: props.view,
          category: props.defaultCategory,
          view: 0,
        })
      );
    }
  }, [props.defaultCategory]);

  return (
    <div className="flex w-full flex-wrap">
      {props.tabs.map((tab) => {
        if (!tab.hidden) {
          return tab?.category && tab?.label ? (
            <div
              className="border-l-2 pl-2 ml-2 border-black"
              onClick={() =>
                dispatch(
                  updateView({
                    target: props.view,
                    category: tab.category,
                    view: 0,
                  })
                )
              }
            >
              <p
                className={`text-center font-black text-lg pr-2 pt-2 ${
                  tab.category === currentCategory ? "text-orange" : ""
                }`}
              >
                {tab.label}
              </p>
            </div>
          ) : null;
        } else {
          return null;
        }
      })}
    </div>
  );
}
