import React, { PropsWithChildren, useMemo } from "react";
import Card from "../Layout/Card";
import Stat from "./Stat";
import { IStat } from "../../Helpers/shared/statsConfig";

interface Props {
  className: string;
  containerClassName?: string;
  title?: string;
  stats?: IStat[];
  limit?: number;
}

export default function StatsDisplay({
  className,
  children,
  containerClassName,
  stats,
  title,
  ...props
}: PropsWithChildren<Props>) {
  const limit = useMemo(() => props.limit || 11, [props.limit]);

  return (
    <Card className={`${containerClassName ? containerClassName : ""}`}>
      <div className="text-center text-2xl h-10 p-1 w-full font-black bg-gray-100">
        <p>{title || "Stats"}</p>
      </div>
      <div
        className={`flex flex-wrap gap-2 p-2 transition-all ${
          className ? className : ""
        }`}
      >
        {stats?.map((stat, i) => {
          if (i < limit) {
            return <Stat stat={stat} />;
          }

          return <></>;
        })}
        {children}
      </div>
    </Card>
  );
}
