import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { UIStateView, updateView } from "../../Redux/UI/UISlice";

interface Props {
  optionMap: { [key: string]: { label: string; description: string } };
  view: UIStateView;
}

export default function CategoryNavigator({ optionMap, view }: Props) {
  const dispatch = useAppDispatch();
  const currentCategory = useAppSelector(
    (state) => state.ui.views.editProfile.category
  );

  return (
    <>
      {!currentCategory ? (
        <>
          <div className="flex flex-col gap-5 bg-white relative">
            {Object.keys(optionMap).map((optionKey) => {
              let option = optionMap[optionKey];
              return (
                <div
                  key={"epOpts/" + optionKey}
                  onClick={() => {
                    dispatch(
                      updateView({ target: view, category: optionKey })
                    );
                  }}
                  className="rounded-lg border-2 border-gray-300 p-4"
                >
                  <h1 className="text-3xl font-black text-center">
                    {option.label}
                  </h1>
                  <p className="text-center">{option.description}</p>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() =>
              dispatch(
                updateView({ target: view, category: "", view: 0 })
              )
            }
            className="absolute top-0 w-full h-20 z-20 bg-white flex items-center flex-col justify-center border-b"
          >
            <h1 className="text-3xl font-black text-center text-orange">
              {optionMap[currentCategory].label}
            </h1>
            <p className="text-center text-sm">
              {optionMap[currentCategory].description}
            </p>
            <i className="material-symbols-outlined text-gray-400 text-md">
              expand_more
            </i>
          </div>
        </>
      )}
    </>
  );
}
