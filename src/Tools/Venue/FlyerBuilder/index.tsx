import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Img from "../../../Components/Images/Img";
import {
  TH_FLYER_TEMPLATES,
  TH_FLYER_FONT_INDEX,
  TH_FLYER_ASPECT_RATIOS,
  KeyofTHFlierTemplates,
  KeyofThFlyerFontIndex,
  KeyofThFlyerAspectRatios,
} from "../../../Helpers/flyerConfig";
import { useAppSelector } from "../../../hooks";
import {
  useGetAllShowsQuery,
  useGetAllVenuesQuery,
} from "../../../Redux/API/PublicAPI";
import dayjs from "dayjs";
import {
  displayAgeLabel,
  displayTicketPrice,
} from "../../../Helpers/HelperFunctions";
import FlyerArtistCard from "../../../Components/Cards/ArtistCard/FlyerArtistCard";
import FlyerCustomization from "./Customization";
// import domtoimage from "dom-to-image";
import html2canvas from "html2canvas";
import { useDispatch } from "react-redux";
import { formUpdate } from "../../../Redux/User/UserSlice";
import { useUpdateShowFlyerMutation } from "../../../Redux/API/IndustryAPI";
import { addStatusMessage } from "../../../Redux/UI/UISlice";
import ShareFlyer from "../ShareFlyer/ShareFlyer";
import ProgressBar from "../../../Components/ProgressBar";
import downscale from "downscale";

interface ITextElementProp extends React.HTMLAttributes<HTMLHeadingElement> {}

export default function FlyerBuilder(
  props: PropsWithChildren<{
    form?: any;
    className?: string;
    standalone?: boolean;
    exitFn?: () => void;
    showID?: string;
    uploadOnInit?: boolean;
    lockForm?: (val: boolean) => void;
    locked?: boolean;
  }>
) {
  const [updateShowFlyer] = useUpdateShowFlyerMutation();
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const shows = useGetAllShowsQuery(undefined, { skip: skip });
  const form = useAppSelector((state) => state.user.forms[props.form]);
  const user = useAppSelector((state) => state.user.data);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  var show = useAppSelector((state) => state.user.forms[props.form]);
  if (shows.data?.[props.showID]) {
    show = shows.data?.[props.showID];
  }
  const uploadButtonRef = useRef<HTMLInputElement>(null);
  const venues = useGetAllVenuesQuery();
  const venue = venues.data?.[show?.venueID];
  const flyerID: KeyofTHFlierTemplates = useMemo(
    () => Math.floor(Math.random() * TH_FLYER_TEMPLATES.length),
    []
  );
  const [custom, setCustom] = useState(form?.["meta.customFlyer"]);
  const [showStartDate, setShowStartDate] = useState(
    dayjs(show?.starttime).format("MMMM DD")
  );
  const [updateTimer, resetUpdateTimer] = useState<any>(null);
  const [showStartTime] = useState(dayjs(show?.starttime).format("h:mmA"));
  const [locked, setLocked] = useState(true);
  const customImageRef = useRef<HTMLImageElement>(null);
  const [customSrc, setCustomSrc] = useState(
    form?.["meta.customSrc"] ? form["meta.customSrc"] : null
  );
  const [lastUpdated, setLastUpdated] = useState(0);
  const [scale, setScale] = useState(1);
  const [onSubmitPendingState, setPendingState] = useState("false");

  useEffect(() => {
    if (props.uploadOnInit && uploadButtonRef.current) {
      uploadButtonRef.current.click();
    }
  }, [uploadButtonRef, props.uploadOnInit]);

  useEffect(() => {
    if (form?.["meta.repeatingShow"] && form?.["meta.repeatType"]) {
      let dayString = show?.starttime
        ? dayjs(show.starttime).format("dddd") + "s"
        : "";
      let repeatString =
        form["meta.repeatType"].charAt(0).toUpperCase() +
        form["meta.repeatType"].slice(1);
      setShowStartDate(repeatString + " " + dayString);
    } else if (show?.starttime) {
      setShowStartDate(dayjs(show?.starttime).format("MMMM DD"));
    }
  }, [form, show]);

  const handleSave = async () => {
    var promise;
    setPendingState("true");
    promise = updateShowFlyer({
      SECRET_UID: user.uid,
      showID: props.showID,
      venueID: show.venueID,
      flyer: form?.flyer,
    });
    try {
      await promise.unwrap();
      setPendingState("completed");
      dispatch(
        addStatusMessage({
          type: "success",
          message: "Flyer successfully updated!",
        })
      );
      (await props.exitFn) && props.exitFn();
      setPendingState("false");
    } catch (err) {
      setPendingState("error");
      dispatch(addStatusMessage({ type: "error", message: (err as any).data }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadProgress(0);
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onloadend = () => {
      const img = URL.createObjectURL(file);
      setCustomSrc(img);
      setUploadProgress(100); // Reset progress after load
    };

    reader.readAsArrayBuffer(file); // Or readAsDataURL, depending on what you want to do with the file
  };

  useEffect(() => {
    if (props.showID) {
      setSkip(false);
    }
  }, [props.showID]);

  const chosenFlyerTemplate = useMemo(
    () => TH_FLYER_TEMPLATES[flyerID],
    [flyerID]
  );

  const [flyerOptions, setFlyerOptions] = useState({
    orientation: "square",
    selectedFlyer: { ...chosenFlyerTemplate, id: flyerID },
    selectedFont: "",
    selectedOrientation: "",
    width: "100%",
    height: "",
    baseWidth: 0,
    baseHeight: 0,
    padding: "",
    maxLineHeight: "",
    fonts: {
      family:
        TH_FLYER_FONT_INDEX[chosenFlyerTemplate.font as KeyofThFlyerFontIndex]
          .family,
      color: chosenFlyerTemplate.fontColor,
      transform: "",
      title: {
        size: "",
        weight: "900",
      },
      subtitle: {
        size: "",
        weight: "600",
      },
      text: {
        size: "",
        weight: "",
      },
    },
    baseCardWidth: 0,
    showAddress: true,
    showArtistImages: true,
    flyerInitialized: Date.now(),
  });

  const formFlyerUpdate = async () => {
    setLocked(true);
    clearTimeout(updateTimer);

    if (custom && customSrc != null) {
      try {
        const timerStart = Date.now();
        const ratio =
          customImageRef.current!.naturalWidth /
          customImageRef.current!.naturalHeight;
        const maxWidth = 615;
        const maxHeight = 615;

        const img = await downscale(
          customSrc,
          ratio > 1 ? Math.min(maxWidth, customImageRef.current!.naturalWidth) : 0,
          ratio > 1 ? 0 : Math.min(maxHeight, customImageRef.current!.naturalHeight)
        );
        console.log("time elapsed for downscale", Date.now() - timerStart);

        dispatch(
          formUpdate({
            form: props.form,
            field: "meta.customFlyer",
            value: true,
          })
        );
        dispatch(
          formUpdate({
            form: props.form,
            field: "meta.customSrc",
            value: customSrc,
          })
        );
        dispatch(
          formUpdate({
            form: props.form,
            field: "flyer",
            value: img,
          })
        );

        // Re-enable to see comparative benchmark.
        // await flyerToImage();
      } catch (e) {
        console.error(e);
      } finally {
        setLocked(false);
      }
    } else {
      resetUpdateTimer(
        setTimeout(async () => {
          try {
            let img = await flyerToImage();
            if (form?.flyer !== img) {
              if (customSrc) {
                dispatch(
                  formUpdate({
                    form: props.form,
                    field: "meta.customFlyer",
                    value: true,
                  })
                );
                dispatch(
                  formUpdate({
                    form: props.form,
                    field: "meta.customSrc",
                    value: customSrc,
                  })
                );
              } else {
                dispatch(
                  formUpdate({
                    form: props.form,
                    field: "meta.customFlyer",
                    value: false,
                  })
                );
              }
              dispatch(
                formUpdate({
                  form: props.form,
                  field: "flyer",
                  value: img,
                })
              );
            }
            setLocked(false);
          } catch (err) {
            console.log(err);
          }
        }, 50)
      );
    }
  };

  const flyerToImage = async () => {
    try {
      const element = canvasRef?.current;

      if (progressBarRef.current) progressBarRef.current.style.display = "none";

      const timerStart = Date.now();
      const canvas = await html2canvas(element, {
        scale: 10,
        useCORS: true,
        onclone: (cloneDoc) => {},
      });
      const data = canvas.toDataURL("image/jpeg", 0.25);
      console.log("time elapsed for html2canvas", Date.now() - timerStart);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      if (progressBarRef.current) progressBarRef.current.style.display = "none";
    }
  };

  // const DownloadFlyer = async (link, data) => {
  //   if (typeof link.download === "string") {
  //     link.href = data;
  //     link.download = (form?.name || "show") + "_flyer.jpeg";

  //     document.body.appendChild(link);
  //     link.click();
  //   } else {
  //     window.open(data);
  //   }
  // };

  const initializeFlyer = () => {
    if (!custom) {
      const initScale = 1;
      console.log(initScale);
      let options = flyerOptions;
      let frameWidth = frameRef?.current?.offsetWidth || 0;
      console.log(frameWidth);
      let orientationKey = (options.selectedOrientation ||
        options.selectedFlyer.orientation) as KeyofThFlyerAspectRatios;
      if (!TH_FLYER_ASPECT_RATIOS[orientationKey]) {
        orientationKey = "square";
      }
      let orientationData = TH_FLYER_ASPECT_RATIOS[orientationKey];
      options.fonts.color = options.selectedFlyer.fontColor;
      options.padding = frameWidth / 25 + "px";
      options.width = frameWidth * (orientationData.xScale || 1) + "px";
      options.height = frameWidth * (orientationData.yScale || 1) + "px";
      options.baseWidth = frameWidth * (orientationData.xScale || 1);
      options.baseHeight = frameWidth * (orientationData.yScale || 1);
      options.baseCardWidth = options.baseWidth / 3;
      options.fonts.title.size =
        (frameWidth / 15) * orientationData.fontScale.title + "px";
      console.log(orientationData.fontScale.title);
      options.baseCardWidth = frameWidth / 5;
      options.fonts.subtitle.size =
        (frameWidth / 20) * orientationData.fontScale.subtitle + "px";
      options.fonts.color = options.selectedFlyer.fontColor;
      options.flyerInitialized = Date.now();
      console.log(options);
      setScale(1);
      setFlyerOptions(flyerOptions);
    } else if (customSrc === null) {
      dispatch(
        formUpdate({
          form: props.form,
          field: "flyer",
          value: null,
        })
      );
    }
  };

  function H1(props: ITextElementProp) {
    return (
      <h1
        className={props.className}
        style={{
          fontFamily: flyerOptions.fonts.family,
          fontSize: flyerOptions.fonts.title.size,
          fontWeight: flyerOptions.fonts.title.weight,
          color: flyerOptions.fonts.color,
        }}
      >
        {props.children}
      </h1>
    );
  }
  function H2(props: ITextElementProp) {
    return (
      <h2
        className={props.className}
        style={{
          fontFamily: flyerOptions.fonts.family,
          fontSize: flyerOptions.fonts.subtitle.size,
          fontWeight: flyerOptions.fonts.subtitle.weight,
          color: flyerOptions.fonts.color,
        }}
      >
        {props.children}
      </h2>
    );
  }
  function H3(props: ITextElementProp) {
    return (
      <h3
        className={props.className}
        style={{
          fontFamily: flyerOptions.fonts.family,
          fontSize: flyerOptions.fonts.text.size,
          fontWeight: flyerOptions.fonts.text.weight,
          color: flyerOptions.fonts.color,
        }}
      >
        {props.children}
      </h3>
    );
  }

  const updateScale = () => {
    if (!custom) {
      let options = { ...flyerOptions };
      console.log(options);
      let screenWidth = frameRef?.current?.offsetWidth || 0;
      let nextScale = scale - scale * 0.1;
      let canvasBoundary = canvasRef.current?.getBoundingClientRect() || {
        width: 0,
        height: 0,
      };
      let contentBoundary = contentRef.current?.getBoundingClientRect() || {
        width: 0,
        height: 0,
      };
      const orientation = (flyerOptions.selectedOrientation ||
        flyerOptions.selectedFlyer.orientation) as KeyofThFlyerAspectRatios;
      options.width =
        screenWidth * TH_FLYER_ASPECT_RATIOS[orientation].xScale + "px";
      options.height =
        screenWidth * TH_FLYER_ASPECT_RATIOS[orientation].yScale + "px";
      options.padding = screenWidth / 25 + "px";
      options.baseCardWidth = (screenWidth / 5) * scale;
      options.fonts.title.size =
        (screenWidth / 15) *
          scale *
          TH_FLYER_ASPECT_RATIOS[orientation].fontScale.title +
        "px";
      options.fonts.subtitle.size =
        (screenWidth / 20) *
          scale *
          TH_FLYER_ASPECT_RATIOS[orientation].fontScale.subtitle +
        "px";
      options.fonts.color = options.selectedFlyer.fontColor;
      if (flyerOptions.fonts.title.size !== options.fonts.title.size) {
        console.log("Resetting show data");
        setFlyerOptions(options);
      }
      if (
        contentBoundary.width > canvasBoundary.width ||
        contentBoundary.height > canvasBoundary.height ||
        options.fonts.title.size !==
          (screenWidth / 15) *
            scale *
            TH_FLYER_ASPECT_RATIOS[orientation].fontScale.title +
            "px"
      ) {
        console.log("out of bounds");
        setScale(nextScale);
      }
    }
  };

  const setTitleFonts = () => {
    if (!custom) {
      const fontInfo = flyerOptions.selectedFont
        ? TH_FLYER_FONT_INDEX[
            flyerOptions.selectedFont as KeyofThFlyerFontIndex
          ]
        : TH_FLYER_FONT_INDEX[
            flyerOptions.selectedFlyer.font as KeyofThFlyerFontIndex
          ];
      var options = flyerOptions;
      options.fonts.family = fontInfo.family;
      // TODO: pubGenius transform does not exist in the TH_FLYER_FONT_INDEX but esists in flyerOptions; review logic for this
      // options.fonts.transform = fontInfo.transform;
      options.fonts.transform = flyerOptions.fonts.transform;
      options.fonts.title.weight =
        fontInfo.subtitle.weight.toString() || flyerOptions.fonts.title.weight;
      options.fonts.subtitle.weight =
        fontInfo.subtitle.weight.toString() ||
        flyerOptions.fonts.subtitle.weight;
      setFlyerOptions(options);
    }
  };

  const updateFlyerOptions = (options: typeof flyerOptions) => {
    setFlyerOptions(options);
    setLastUpdated(Date.now);
  };

  useEffect(() => {
    console.log("Update flyer", flyerOptions, lastUpdated);
    formFlyerUpdate();
  }, [flyerOptions, lastUpdated, customSrc]);

  useEffect(() => {
    initializeFlyer();
  }, [flyerOptions.selectedOrientation, custom]);

  useEffect(() => {
    setTitleFonts();
  }, [flyerOptions.selectedFont]);

  useEffect(() => {
    updateScale();
  }, [lastUpdated, scale, flyerOptions]);

  useEffect(() => {
    setTimeout(() => {
      updateScale();
    }, 50);
  }, [flyerOptions.flyerInitialized]);

  useEffect(() => {
    console.log("set locked", locked);
    props.lockForm && props.lockForm(locked);
    initializeFlyer();
  }, [props.locked, locked]);

  useEffect(() => {
    return () => props.lockForm && props.lockForm(false);
  }, []);
  return (
    show && (
      <>
        <div className="grid grid-cols-12">
          <div className={`col-span-12`}>
            <h1 className="text-2xl font-black flex items-center col-span-6 w-full">
              {props.standalone && (
                <span
                  className="material-symbols-outlined"
                  onClick={() => props.exitFn && props.exitFn()}
                >
                  arrow_back
                </span>
              )}
              Flyer Builder
            </h1>
          </div>

          <div className={`col-span-12`}>
            <div className="flex flex-row justify-end">
              {custom && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCustom(false);
                  }}
                  className={`text-lg p-2 m-2 mx-auto flex items-center border-2  hover:bg-gray-100 rounded-full`}
                >
                  <i className="material-symbols-outlined">build</i>Switch to
                  Flyer Builder
                </button>
              )}
              <a
                href={form?.flyer}
                className={`text-lg p-2 m-2 mx-auto flex items-center border-2  ${
                  locked ? "bg-gray-400 text-white pointer-events-none" : ""
                } hover:bg-gray-100 rounded-full`}
                download={`${form?.name || "Show"} Flyer.jpeg`}
              >
                <i className="material-symbols-outlined">download</i>Download
                Flyer Image
              </a>
              <button
                className={`text-lg p-2 m-2 mx-auto flex items-center border-2 bg-orange text-white  hover:filter hover:brightness-110 rounded-full relative`}
              >
                <i className="material-symbols-outlined">upload</i>
                <input
                  type="file"
                  onClick={() => setCustom(true)}
                  ref={uploadButtonRef}
                  onChange={handleFileChange}
                  className="absolute w-full h-full opacity-0"
                />
                Upload My Own Flyer
              </button>
              {/* <button onClick={(e) => { e.preventDefault(); setCustom(true) }} className={`text-lg p-2 m-2 mx-auto flex items-center border-2  hover:bg-gray-100 rounded-full`}><i className="material-symbols-outlined">upload</i>Upload My Own Flyer</button> */}
              {props.standalone && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className={`text-lg p-2 m-2 mx-auto flex items-center border-2 filter brightness-110 bg-orange text-white rounded-full`}
                >
                  <i className="material-symbols-outlined">save</i>Save Changes
                </button>
              )}
            </div>
          </div>

          <div
            id="frame"
            ref={frameRef}
            className="col-span-12 md:col-span-6 w-full flex justify-center"
          >
            <div
              id="canvas"
              ref={canvasRef}
              className="relative"
              style={{
                width: flyerOptions.width,
                height: flyerOptions.height,
              }}
            >
              {customSrc && custom ? (
                <Img
                  src={customSrc}
                  className={`bg-black ${
                    customSrc ? "relative" : "absolute"
                  } w-full z-0`}
                  ref={customImageRef}
                />
              ) : (
                <Img
                  localSrc={flyerOptions.selectedFlyer.src}
                  className="bg-black absolute w-full h-full z-0"
                />
              )}
              {uploadProgress > 0 && (
                <div ref={progressBarRef}>
                  <ProgressBar progress={uploadProgress} />
                </div>
              )}

              <div
                ref={contentRef}
                className={`relative ${
                  custom ? "hidden" : "flex"
                } items-center justify-center flex-col z-1`}
                style={{
                  minHeight: flyerOptions.height,
                  boxSizing: "border-box",
                  width: flyerOptions.width,
                  padding: flyerOptions.padding,
                  textTransform:
                    flyerOptions.fonts.transform === "uppercase"
                      ? flyerOptions.fonts.transform
                      : "none",
                }}
              >
                <div className="w-full flex flex-nowrap items-center">
                  <div className="flex-1 justify-center items-center">
                    {
                      <>
                        <H2 className="text-center">{showStartDate}</H2>

                        <H2 className="text-center">{showStartTime}</H2>
                      </>
                    }
                  </div>
                  <div className="flex-1 justify-center items-center">
                    <Img
                      src={venue?.avatar}
                      className="w-28 h-28 rounded-full mx-auto"
                    />
                  </div>
                  <div className="flex-1 justify-center items-center">
                    <H2 className="text-center">{displayTicketPrice(show)}</H2>
                    <H2 className="text-center">{displayAgeLabel(show)}</H2>
                  </div>
                </div>
                <H1 className="text-center">{show.name}</H1>
                {flyerOptions.showAddress && (
                  <H2 className="text-center">{venue?.location?.address}</H2>
                )}
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {scale &&
                    flyerOptions.showArtistImages &&
                    show.performers &&
                    show.performers.length > 0 &&
                    show.performers?.map((performer: any) => {
                      return (
                        <FlyerArtistCard
                          baseWidth={flyerOptions.baseCardWidth}
                          scale={scale}
                          id={performer.id}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 p-2">
            {!custom && (
              <FlyerCustomization
                flyerOptions={flyerOptions}
                onChange={(e) => {
                  updateFlyerOptions(e);
                }}
              />
            )}
          </div>
          {/* <div className="grid grid-cols-2 col-span-12">
                    <div id="frame" ref={frameRef} className="w-full justify-center col-span-2 md:col-span-1">
                        <div id="canvas" ref={canvasRef} style={{

                        }} className="relative w-full">
                            {!customSrc && frameRef && frameRef?.current && <div className="z-10 relative flex items-center justify-center flex-col" style={{ minHeight: frameRef?.current?.offsetWidth }}>
                                <h1 className="text-white text-3xl font-black">Custom Flyer Selected</h1>
                                <h2 className="text-white text-xl font-black">Please upload a flyer to proceed.</h2>
                            </div>}
                        </div>
                    </div>
                    <div className="flex flex-wrap flex-col col-span-2 md:col-span-1">
                    <button className={`text-lg p-2 m-2 mx-auto flex items-center border-2 bg-orange text-white  hover:filter hover:brightness-110 rounded-full relative`}><i className="material-symbols-outlined">upload</i><input type="file" onClick={() => setCustom(true)}
                        onChange={async (e) => {
                            let img = URL.createObjectURL(e.target.files[0])
                            setCustomSrc(img)
                        }} className="absolute w-full h-full opacity-0" />Upload My Own Flyer</button>
                        {props.standalone && customSrc && <button onClick={(e) => { e.preventDefault(); handleSave(); }} className={`text-lg p-2 m-2 mx-auto flex items-center border-2 filter brightness-110 bg-orange text-white rounded-full ${locked ? "bg-gray-400 text-white pointer-events-none" : ""}`}><i className="material-symbols-outlined">save</i>Save Changes</button>}
                        <button onClick={(e) => { e.preventDefault(); setCustom(false) }} className={`text-lg p-2 m-2 mx-auto flex items-center border-2  hover:bg-gray-100 rounded-full`}><i className="material-symbols-outlined">arrow_back</i>Return to Flyer Builder</button>
                        <ShareFlyer form={props.form} />
                    </div>
                </div> */}
        </div>
      </>
    )
  );
}
