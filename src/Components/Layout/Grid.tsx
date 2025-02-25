import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar/Navbar";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";
import Cover from "./Cover";
import Modal from "./Modal";
import LoadingGif from "../../Images/Loading.gif";
import { openModal, openSidebar, openTooltip } from "../../Redux/UI/UISlice";
import Drawer from "./Drawer";
import Img from "../Images/Img";

export default function Grid({ children }: PropsWithChildren<{}>) {
  const fullscreen = useAppSelector((state) => state.ui.grid.fullscreen);
  const appLoading = useAppSelector((state) => state.ui.app.loading);
  const dispatch = useAppDispatch();
  const cover = {
    active: useAppSelector((state) => state.ui.cover.active),
    data: useAppSelector((state) => state.ui.cover.data),
  };
  const sidebar = {
    active: useAppSelector((state) => state.ui.sidebar.active),
    data: useAppSelector((state) => state.ui.sidebar.data),
  };
  const modal = {
    active: useAppSelector((state) => state.ui.modal.active),
    data: useAppSelector((state) => state.ui.modal.data),
  };
  const drawer = {
    active: useAppSelector((state) => state.ui.drawer.active),
    data: useAppSelector((state) => state.ui.drawer.data),
  };
  const tooltip = useAppSelector((state) => state.ui.tooltip);

  return !appLoading ? (
    <div className="max-h-viewport max-w-viewport flex flex-col overflow-hidden">
      {tooltip.active && (
        <div
          className="absolute top-0 left-0 w-screen h-screen z-50"
          onClick={() => dispatch(openTooltip({ status: false }))}
        >
          <div
            className="absolute z-50 bg-slate-800 rounded text-white p-1"
            onMouseLeave={() => dispatch(openTooltip({ status: false }))}
            style={{
              backgroundColor: tooltip.backgroundColor || "rgb(30 41 59)",
              width: tooltip.width,
              height: tooltip.height,
              top: tooltip.position.y,
              left: tooltip.position.x,
            }}
          >
            {tooltip.data}
          </div>
        </div>
      )}
      {cover.active && <Cover data={cover.data} />}
      {modal.active && <Modal data={modal.data} />}
      {!fullscreen && <Navbar />}
      <div className="min-w-full flex flex-col flex-fix max-h-full overflow-auto overflow-x-hidden flex-grow">
        {children}
      </div>
      <Sidebar data={sidebar.data} />
      {<Drawer data={drawer.data} active={drawer.active} />}
      <StatusBar />
      {(sidebar.active || modal.active) && (
        <div
          className="absolute w-full h-full bg-opacity-50 bg-white"
          onClick={() => {
            if (sidebar.active) {
              dispatch(openSidebar({ status: false }));
            }
            if (modal.active) {
              dispatch(openModal({ status: false }));
            }
          }}
        ></div>
      )}
    </div>
  ) : (
    <div className="max-h-viewport max-w-viewport flex flex-col overflow-hidden items-center justify-center">
      <Img src={LoadingGif} alt="Loading..." className="w-32 h-32" />
    </div>
  );
}
