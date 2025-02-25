import React from "react";
import { useGetAllShowrunnerGroupsQuery } from "../../Redux/API/PublicAPI";
import Card from "../Layout/Card";
import Img from "../Images/Img";
import Button from "../Buttons/Button";
import { Link } from "react-router-dom";
import LoadingWrapper from "../Layout/LoadingWrapper";

interface Props {
  id: string;
}

export default function ManageShowrunnerCard({ id }: Props) {
  const srGroups = useGetAllShowrunnerGroupsQuery();
  const showrunner = srGroups.data?.[id];

  return (
    <LoadingWrapper queryResponse={[srGroups]}>
      {showrunner && (
        <Card className="w-48">
          <div className="flex flex-col justify-center items-center w-full">
            <Img
              src={showrunner.avatar}
              className="w-36 h-36 p-4 rounded-full"
            />
            <div className="flex flex-col w-full flex-grow p-4">
              <h1 className="text-xl font-black justify-center text-center">
                {showrunner.name}
              </h1>
            </div>
            <div className="flex  md:flex-col gap-2 flex-grow md:flex-grow-0 ">
              <Link to={id} className="min-w-full flex justify-content">
                <Button full inline>
                  Manage
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </LoadingWrapper>
  );
}
