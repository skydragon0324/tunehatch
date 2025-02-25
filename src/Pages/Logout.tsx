import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logOut } from "../Redux/User/UserSlice";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  useEffect(() => {
    if (user.uid) {
      dispatch(logOut());
    }
  }, []);

  return user.uid ? (
    <></>
  ) : (
    <>
      <Navigate to="/" />
    </>
  );
}
