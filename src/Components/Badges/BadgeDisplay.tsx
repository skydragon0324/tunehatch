import React, { useState } from "react";
import Card from "../Layout/Card";
import Badge from "./Badge";
import { IBadge } from "../../Helpers/shared/badgesConfig";

interface Props {
  badges?: IBadge[];
  className?: string;
  limit?: number;
}

export default function BadgeDisplay({ badges, className, ...props }: Props) {
  const [limit, setLimit] = useState(props.limit || 11);

  return (
    <Card className="">
      <div className="text-center text-2xl p-1 w-full font-black bg-gray-100">
        <p>Badges</p>
      </div>
      <div className={`transition-all ${className ? className : ""}`}>
        {badges?.map((badge, i) => {
          if (i < limit) {
            return <Badge badge={badge} />;
          }
          return <></>;
        })}
        {badges?.length - limit > 0 && (
          <Badge onClick={() => setLimit(limit + (props.limit || 11))}>
            <p className="font-black text-2xl flex flex-center items-center text-gray-400">
              +{badges?.length - limit}
            </p>
          </Badge>
        )}
      </div>
    </Card>
  );
}
