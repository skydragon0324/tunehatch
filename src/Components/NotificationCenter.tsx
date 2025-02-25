import React, { useMemo, useState } from "react";
import DynamicNotification from "../Components/Buttons/DynamicNotification";
import { useAppSelector } from "../hooks";
import { parseNotifications } from "../Helpers/HelperFunctions";
import {
  useAllNotificationsReadMutation,
  useClearNotificationsMutation,
} from "../Redux/API/UserAPI";
import LabelButton from "./Buttons/LabelButton";
import { NotificationTypes, ParsedNotifications } from "../Helpers/shared/Models/Notifications";

function NotificationCenter(props: {
  limit?: number;
  notifications: {
    read?: ParsedNotifications[];
    unread?: ParsedNotifications[];
  };
  cancelFn?: () => void;
}) {
  const SECRET_UID = useAppSelector((state) => state.user.data.uid);
  let venueList = useAppSelector((state) => state.user.data.venues);
  let [expanded, toggleView] = useState(false);
  const [limit, setLimit] = useState(props.limit || 2);
  const user = useAppSelector((state) => state.user.data);

  const [clearNotifications] = useClearNotificationsMutation();
  const [notifsAllRead] = useAllNotificationsReadMutation();

  const { sortedNotifications, unread } = useMemo(() => {
    const notifData =
      Object.keys(props.notifications).length > 0
        ? parseNotifications(props.notifications)
        : {
            notifications: [],
            unread: user?.type?.artist?.enabled && !user.stripeEnabled ? 1 : 0,
          };

    return {
      sortedNotifications: notifData.notifications,
      unread: notifData.unread,
    };
  }, [props.notifications]);

  const handleVisibility = (state: boolean) => {
    toggleView(state);
    if (state === false && unread > 0) {
      notifsAllRead({ SECRET_UID, venueList: venueList || [] });
    }
  };

  const clearAllNotifs = () => {
    clearNotifications({ SECRET_UID, venueList: venueList || [] });
  };

  return (
    sortedNotifications && (
      <>
        {expanded && (
          <div
            className="absolute bg-white w-1/4 opacity-100 h-1/2 top-12 right-0"
            onClick={() => handleVisibility(false)}
          ></div>
        )}
        <div className="relative z-10 w-full flex items-center justify-center bg-white">
          <div className="relative w-9">
            <span className="flex" onClick={() => toggleView(!expanded)}>
              <i
                onClick={() => props.cancelFn && props.cancelFn()}
                className="material-symbols-outlined text-2xl"
              >
                notifications
              </i>
            </span>
            {unread > 0 && (
              <div
                className="absolute w-4 h-4 bottom-0 text-xs right-1 rounded-full flex items-center justify-center bg-red-400 text-white"
                onClick={() => handleVisibility(!expanded)}
              >
                {unread < 10 ? unread : "+"}
              </div>
            )}
          </div>
          {expanded && (
            <div className="absolute flex flex-col bg-white border border-gray-200 overflow-scroll top-6 right-0 w-60 max-h-80 rounded-md pb-2">
              <div className="flex flex-col flex-grow bg-white overflow-scroll ">
                <div className="w-full flex flex-row">
                  <h1 className="font-black text-2xl w-full p-2">
                    Notifications
                  </h1>
                  <span
                    className="mr-auto"
                    onClick={() => {
                      handleVisibility(false);
                    }}
                  >
                    <i className="material-symbols-outlined">close</i>
                  </span>
                </div>
                <div className="relative flex flex-col overflow-scroll">
                  {
                    user?.type?.artist?.enabled && !user.stripeEnabled && <>
                      <DynamicNotification
                      closeFunction={() => handleVisibility(false)}
                      key="payouts"
                      id={"notification"}
                      data={{}}
                      type={NotificationTypes.SET_UP_PAYOUTS}
                      timestamp={Date.now()}
                      />
                    </>
                  }
                  {sortedNotifications.length > 0 ? (
                    sortedNotifications.map((notification, i) => {
                      if (i < limit) {
                        return (
                          <DynamicNotification
                            closeFunction={() => handleVisibility(false)}
                            key={i}
                            {...notification}
                          />
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <div className="flex-col text-center">
                      <h1>You're all set!</h1>
                      <p className="text-center">
                        Keep an eye out here for any new updates.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  {sortedNotifications?.length > 0 ? (
                    <LabelButton
                      className="border text-red-400 border-red-400"
                      icon="close"
                      onClick={() => clearAllNotifs()}
                    >
                      Clear All Notifications
                    </LabelButton>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {(props.notifications?.read?.length ||
                props.notifications?.unread?.length) > limit ? (
                <button
                  className="p-3 hover:bg-gray-100 w-full text-blue-400"
                  onClick={() => setLimit(limit + (props.limit || 5))}
                >
                  Show More
                </button>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </>
    )
  );
}

export default NotificationCenter;
