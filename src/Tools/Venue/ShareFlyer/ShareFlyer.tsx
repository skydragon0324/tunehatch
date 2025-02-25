import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import axios from "axios";
import AccountSelect from "./AccountSelect";
import { APIURL } from "../../../Helpers/configConstants";
import { addStatusMessage } from "../../../Redux/UI/UISlice";
// import QuestionLabel from "../../../../Components/Labels/QuestionLabel";
import QuestionButton from "../../../Components/Buttons/QuestionButton";
// import Img from "../../../../Components/Images/Img";
// import Facebook from "../../../../Images/Icons/Facebook.png";
// import Instagram from "../../../../Images/Icons/Instagram.png";
import ToggleSlider from "../../../Components/Inputs/InputTypes/ToggleSlider";
import IconButton from "../../../Components/Buttons/IconButton";
import { FormKeys } from "../../../Redux/User/UserSlice";
import LoadingSpinner from "../../../Components/LoadingSpinner";
import dayjs from "dayjs";

export default function ShareFlyer(props: { showID: string }) {
  const dispatch = useAppDispatch();
  const uid = useAppSelector((state) => state.user.data.uid);
  const [fbPages, setFBPages] = useState(null);
  const [selectedPage, selectPage] = useState(null);
  const [schedule, setSchedule] = useState(false);
  const [status, setStatus] = useState("idle");
  const [scheduleDate, setScheduleDate] = useState(null);
  const [shareToFB, setShareToFB] = useState(false);
  const [shareToIG, setShareToIG] = useState(false);
  const [shareEnabled, enableShare] = useState(false);

  const publish = async () => {
    const scheduleISO = schedule ? new Date(scheduleDate).toISOString() : false;
    try {
      if (status === "idle") {
        // TODO: Implement as a thunk
        setStatus("pending");
        const result = await axios.post(`${APIURL}ind/flyer-share`, {
          showID: props.showID,
          shareToFB,
          shareToIG,
          igid: selectedPage.igid,
          fbid: selectedPage.fbid,
          schedule: scheduleISO,
          accessToken: selectedPage.access_token,
          SECRET_UID: uid,
        });
        const { data } = result.data;
        setStatus("completed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const startShare = async () => {
    window.FB.login(
      function (response: any) {
        if (response.status === "connected") {
          window.FB.api(
            "/me/accounts?fields=instagram_business_account,name,access_token",
            function (response) {
              console.log(response);
              const responseData: any[] =
                response["data" as keyof typeof response];
              if (responseData.length) {
                const pages = responseData.map((page) => ({
                  name: page.name,
                  fbid: page.id,
                  igid: page.instagram_business_account?.id,
                  access_token: page.access_token,
                }));
                setFBPages(pages);
              } else {
                dispatch(
                  addStatusMessage({
                    type: "error",
                    message:
                      "You do not have any pages linked to this Facebook Account!",
                    timeout_duration: 10000,
                  })
                );
              }
            }
          );
        }
      },
      {
        //old perms  "ads_management, business_management, pages_show_list, pages_manage_posts, pages_manage_engagement, pages_read_engagement, instagram_basic, instagram_content_publish"
        scope:
          "business_management, pages_show_list, pages_manage_posts, instagram_basic, instagram_content_publish",
      }
    );
  };
  useEffect(() => {
    if (selectedPage) {
      selectedPage.fbid && setShareToFB(true);
      selectedPage.igid && setShareToIG(true);
    }
  }, [selectedPage]);
  return (
    <>
      <p className="text-center text-xs text-gray-400">
        The Facebook & Instagram Sharing features are currently in beta. To
        request early access to help us perfect this feature, email us at{" "}
        <a href="mailto:info@tunehatch.com" className="underline text-blue-400">
          info@tunehatch.com
        </a>
      </p>
      <QuestionButton
        icon="share"
        label="Share to Social Media"
        question="How does sharing work?"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          enableShare(true);
        }}
        answer={
          <>
            <p className="text-center">
              TuneHatch enables venues to automatically share their flyers to
              social media; either right now, or at a set point in time. We
              currently offer support for Facebook and Instagram.
              <br />
              <b>
                To use this feature, you must have a Business page on Facebook.
                To share to Instagram, you must have a Business or Creator
                account linked to your Facebook page.
              </b>
              <br />
              You can find additional information{" "}
              <a
                href="https://www.facebook.com/business/help/connect-instagram-to-page"
                className="text-blue-400"
                rel="noreferrer"
                target="_blank"
              >
                here
              </a>
            </p>
          </>
        }
      />
      {shareEnabled && (
        <button
          type="button"
          className=" mx-auto py-2 px-4 max-w-md  flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
          onClick={() => startShare()}
        >
          <svg
            width="20"
            height="20"
            fill="currentColor"
            className="mr-2"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z"></path>
          </svg>
          Continue with Facebook
        </button>
      )}
      {!selectedPage ? (
        <AccountSelect
          pages={fbPages}
          onClick={(e) => selectPage(e)}
        />
      ) : (
        <>
          <h4 className="text-xl font-black text-center mb-2 flex items-center justify-center">
            <i
              className="material-symbols-outlined mr-2"
              onClick={() => selectPage(null)}
            >
              arrow_back
            </i>
            Sharing to {selectedPage.name}
          </h4>
          <div className="flex flex-col items-center gap-2 mb-3">
            {selectedPage.fbid && (
              <ToggleSlider
                label="Share to Facebook"
                value={shareToFB}
                clickFn={() => setShareToFB(!shareToFB)}
              />
            )}
            {selectedPage.igid && (
              <ToggleSlider
                label="Share to Instagram"
                value={shareToIG}
                clickFn={() => setShareToIG(!shareToIG)}
              />
            )}
          </div>
          {!schedule ? (
            <>
              <IconButton
                className="flex items-center mx-auto border p-2 pl-4 pr-4 mb-2 rounded-full filter hover:brightness-105 bg-orange text-white"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  publish();
                }}
              >
                Share Now
              </IconButton>
              <IconButton
                icon="schedule"
                className="flex items-center mx-auto border gap-2 p-2 pl-4 pr-4 mb-2 rounded-full hover:bg-gray-100"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setSchedule(true);
                }}
              >
                Schedule
              </IconButton>
            </>
          ) : (
            <>
              <div className="flex gap-2 justify-center items-center mt-4">
                <input
                  className="border rounded-full h-8 pr-2 pl-2"
                  type="datetime-local"
                  name="posttime"
                  value={scheduleDate}
                  onChange={(e) => {
                    setScheduleDate(e.target.value);
                  }}
                />
                <button
                  className="material-symbols-outlined border rounded-full w-8 h-8 text-xl text-red-500"
                  onClick={() => {
                    setSchedule(false);
                  }}
                >
                  close
                </button>
              </div>
              <IconButton
                icon="schedule"
                className="mt-4 flex items-center mx-auto border gap-2 p-2 pl-4 pr-4 mb-2 rounded-full hover:bg-gray-100"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  publish();
                }}
              >
                Schedule Post
              </IconButton>
            </>
          )}
          {status === "pending" && (
            <>
              <div className="flex items-center justify-center gap-4 w-1/2 mx-auto">
                <LoadingSpinner className="text-xl" />
                {schedule ? (
                  <p>Scheduling...</p>
                ) : (
                  <p>
                    We're sharing your flyer now! This might take up to a
                    minute. You can wait here, or continue with show creation
                    while we handle the rest in the background.{" "}
                  </p>
                )}
              </div>
            </>
          )}
          {status === "completed" && (
            <>
              <div className="flex items-center justify-center gap-4 w-1/2 mx-auto">
                <i className="material-symbols-outlined text-green-400"></i>
                {schedule ? (
                  <p>
                    Flyer scheduled! Your flyer will be shared to{" "}
                    {shareToFB && "Facebook"}
                    {shareToFB && shareToIG && " and "}
                    {shareToIG && "Instagram"} on{" "}
                    {dayjs(scheduleDate).format("MM/DD @ h:mma")}!
                  </p>
                ) : (
                  <p>
                    Flyer shared to {shareToFB && "Facebook"}
                    {shareToFB && shareToIG && " and "}
                    {shareToIG && "Instagram"}!<br /> You should see your
                    socials updating now.
                  </p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
