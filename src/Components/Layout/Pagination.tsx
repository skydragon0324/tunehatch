import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import useOnScreen from "../../Hooks/isOnScreen";

interface Props {
  items: any[];
  title: any;
  indexKey: string;
  generatorFn: any;
  limit?: number;
  endMessage?: string;
  containerClassName?: string;
}

export default function Pagination({
  items,
  title,
  indexKey,
  generatorFn,
  endMessage,
  containerClassName,
  ...props
}: Props) {
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(loaderRef);
  const limit = props.limit || 20;
  const totalPages = Math.ceil(items.length / limit);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setPage(page + 1);
      }, 500);
    }
  }, [isVisible]);

  return (
    <>
      <div className="w-full">{title}</div>
      <div className={containerClassName ? containerClassName : ""}>
        {items.map((item, i) => {
          if (i < limit * page) {
            return generatorFn(item?.[indexKey]);
          } else {
            return null;
          }
        })}
      </div>
      {page < totalPages ? (
        <div ref={loaderRef}>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="w-full">
        <p className="text-lg text-gray-500 mt-14">
          {endMessage || "That's all."}
        </p>
        </div>
      )}
    </>
  );
}
