import React, { PropsWithChildren, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

/**
 * LoadingWrapper
 * When the object result of useQuery or useMutuation is passed, determines load state.
 */
export default function LoadingWrapper(
  props: PropsWithChildren<{
    queryResponse?: {
      isFetching: boolean;
      isLoading: boolean;
      isError: boolean;
    }[];
    requiredData?: any[];
    className?: string;
    containerClassName?: string;
    noEmptyArrays?: boolean;
    isLoading?: boolean;
    disableOverflow?: boolean;
  }>
) {
  const [preloading, setPreloading] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let loading = false;
    props.queryResponse &&
      props.queryResponse.forEach((response) => {
        if (response.isLoading === true || loading === true) {
          loading = true;
        }
      });
    props.requiredData &&
      props.requiredData.forEach((data) => {
        if (
          data === null ||
          data === undefined ||
          (props.noEmptyArrays &&
            data.constructor === Array &&
            data.length === 0 &&
            props.isLoading)
        ) {
          loading = true;
        }
      });
    setLoading(loading);
  }, [props.queryResponse, props.requiredData]);

  useEffect(() => {
    if (loading === false) {
      setTimeout(() => {
        setPreloading(false);
      }, 250);
    }
  }, [loading]);

  return loading ? (
    <>
      <div className="h-full absolute flex-grow w-full flex justify-center items-center">
        <LoadingSpinner className="relative -top-10" />
      </div>
    </>
  ) : (
    <>
      {preloading ? (
        <div
          className={`absolute w-full h-full flex-grow bg-white flex justify-center items-center z-50`}
        >
          <LoadingSpinner className="relative -top-10" />
        </div>
      ) : <></>}
      {props.disableOverflow ? <>{props.children}</> : <div className={`transition-all h-full max-h-full`}>{props.children}</div>}
    </>
  );
}
