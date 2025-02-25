import React from "react";
import { application, Performer, Show } from "../../Helpers/shared/Models/Show";
import { openModal, openSidebar } from "../../Redux/UI/UISlice";
import { useAppSelector } from "../../hooks";
import Button from "./Button";
import { displayTicketPrice } from "../../Helpers/HelperFunctions";

interface GigButtonProps {
  show: Show;
  isGig?: boolean;
}

/**
 * @description Button component for a gig
 * @param {GigButtonProps} props
 * @return Button component with the correct label and click action for a gig
 */
export default function GigButton(props: GigButtonProps) {
  // Get the current user from the store
  const user = useAppSelector((state) => state.user.data);

  // Callback for array.prototype.some() to check if the current user is a performer
  const CurrentUserIsPerformer = (performer: Performer | application<any>) =>
    performer.uid === user.displayUID;

  if (props.isGig) {
    // If the user is not an artist, return a disabled button
    if (!user.type?.artist?.enabled) {
      return (
        <div className="flex flex-row w-full mb-1 @xl:w-24 @md:mb-0 @xl:flex-col @xl:mr-3 gap-2 flex-grow justify-center">
          <Button
            full
            disabled
            className={"disabled:bg-gray-300 hover:cursor-not-allowed"}
            icon={"lock"}
            iconClassName="text-base font-medium"
          >
            Apply
          </Button>
        </div>
      );
    }

    if (props.show.performers.some(CurrentUserIsPerformer)) {
      return (
        <div className="flex flex-row w-full mb-1 @xl:w-24 @md:mb-0 @xl:flex-col @xl:mr-3 gap-2 flex-grow justify-center">
          <Button full inline className="bg-blue-400 pl-2 pr-2 text-white mr-2">
            Performing
          </Button>
        </div>
      );
    }

    if (props.show.applications.some(CurrentUserIsPerformer)) {
      return (
        <div className="flex flex-row w-full mb-1 @xl:w-24 @md:mb-0 @xl:flex-col @xl:mr-3 gap-2 flex-grow justify-center">
          <Button full inline className="bg-gray-300 pl-2 pr-2 text-white mr-2">
            Applied
          </Button>
        </div>
      );
    }

    if (props.show.invites.some(CurrentUserIsPerformer)) {
      return (
        <div className="flex flex-row w-full mb-1 @xl:w-24 @md:mb-0 @xl:flex-col @xl:mr-3 gap-2 flex-grow justify-center">
          <Button full inline>
            Invited
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-row w-full mb-1 @xl:w-24 @md:mb-0 @xl:flex-col @xl:mr-3 gap-2 flex-grow justify-center">
        <Button
          full
          className="bg-orange pl-2 pr-2 text-white mr-2"
          action={openSidebar({
            status: true,
            component: "Apply",
            data: { showID: props.show._key },
          })}
        >
          Apply
        </Button>
      </div>
    );
  } else {
    let ticketLabel = displayTicketPrice(props.show);
    if (ticketLabel === "Free") {
      return (
        <div className="flex flex-row w-full mb-1 @xl:w-24 @md:mb-0 @xl:flex-col @xl:mr-3 gap-2 flex-grow justify-center">
          <Button
            full
            stopPropagation
            action={openModal({
              status: true,
              component: "TicketPurchase",
              data: { showID: props.show._key, free: true },
            })}
          >
            Free
          </Button>
          <Button
            secondary
            stopPropagation
            full
            link={`/shows/${props.show._key}`}
          >
            Details
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-row w-full mb-1 @xl:w-24 @md:mb-0 @xl:flex-col @xl:mr-3 gap-2 flex-grow justify-center">
          <Button
            full
            stopPropagation
            action={openModal({
              status: true,
              component: "TicketPurchase",
              data: { showID: props.show._key },
            })}
          >
            Tickets
          </Button>
          <Button
            secondary
            stopPropagation
            full
            link={`/shows/${props.show._key}`}
          >
            Details
          </Button>
        </div>
      );
    }
  }
}
