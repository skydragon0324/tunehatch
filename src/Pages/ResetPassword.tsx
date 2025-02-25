import { delay, renderPageTitle } from "../Helpers/HelperFunctions";
import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import ChickLogo from "../Images/ChickLogo.png";
// import TuneHatchLogo from "../Images/TextLogo.png";
import { requestPasswordReset, resetPassword } from "../Redux/User/UserSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
// import LoadingWrapper from "../Components/Layout/LoadingWrapper";
import LoadingSpinner from "../Components/LoadingSpinner";
import Form from "../Components/Inputs/Form";
import Button from "../Components/Buttons/Button";

export default function ResetPassword() {
  useEffect(() => {
    renderPageTitle("Reset Password");
  }, []);
  const { resetToken } = useParams();
  const [redirect, updateRedirect] = useState(false);
  const dispatch = useAppDispatch();
  const initializeLogin = async () => {
    await delay(2000);
    updateRedirect(true);
  };
  const form = useAppSelector((state) => state.user.forms.resetPassword);
  const currentView = useAppSelector(
    (state) => state.ui.views.resetPassword.view,
  );
  useEffect(() => {
    if (resetToken && currentView === 1) {
      initializeLogin();
    }
  }, [currentView]);
  console.log(form?.email);
  return form ? (
    <div className="center-grid flex-col">
      {!resetToken ? (
        //reset token not provided
        <>
          {currentView === 0 && (
            <div className="flex justify-center items-center w-full h-full">
              <div className="w-10/12 md:w-8/12 flex flex-col justify-center items-center gap-2 border shadow-sm p-4 rounded">
                <img src={ChickLogo} alt="" className="w-72" />
                <Form
                  noSubmit
                  name="resetPassword"
                  formMap={[
                    [
                      {
                        field: "email",
                        type: "email",
                        placeholder: "Email Address",
                      },
                    ],
                  ]}
                />
                <Button
                  className="fullWidth"
                  onClick={() =>
                    dispatch(requestPasswordReset({ email: form.email }))
                  }
                >
                  Request Reset
                </Button>
              </div>
            </div>
          )}
          {currentView === 1 && (
            <div className="flex justify-center items-center w-full h-full">
              <div className="w-10/12 md:w-8/12 flex flex-col justify-center items-center gap-2 border shadow-sm p-4 rounded">
                <img src={ChickLogo} alt="" className="w-72" />
                <h1 className="text-center text-2xl font-black">
                  Password Reset Link Sent
                </h1>
                <p className="text-center">
                  If your email is in our system, you will receive a password
                  reset link. <br />
                  This link will expire after fifteen minutes.
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        //reset token provided
        <>
          {currentView === 0 && (
            <div className="flex justify-center items-center w-full h-full">
              <div className="w-10/12 md:w-8/12 flex flex-col justify-center items-center gap-2 border shadow-sm p-4 rounded">
                <img src={ChickLogo} alt="" className="w-72" />
                <Form
                  noSubmit
                  name="resetPassword"
                  formMap={[
                    [
                      {
                        field: "password",
                        type: "password",
                        placeholder: "New Password",
                      },
                      {
                        field: "confirmPassword",
                        type: "password",
                        placeholder: "Confirm Password",
                      },
                    ],
                  ]}
                />
                <Button
                  onClick={() =>
                    dispatch(
                      resetPassword({
                        token: resetToken,
                        password: form.password,
                      }),
                    )
                  }
                >
                  Reset Password
                </Button>
              </div>
            </div>
          )}
          {currentView === 1 && (
            <div className="flex justify-center items-center w-full h-full">
              <div className="w-10/12 md:w-8/12 flex flex-col justify-center items-center gap-2 border shadow-sm p-4 rounded">
                <img src={ChickLogo} alt="" className="w-72" />
                <h1 className="text-center text-2xl font-black">
                  Password Reset!
                </h1>
                <p className="text-center">Logging you in...</p>
              </div>
            </div>
          )}
          {redirect && <Navigate replace to="/shows" />}
        </>
      )}
    </div>
  ) : (
    <LoadingSpinner />
  );
}
