import React from "react";
import Card from "../Components/Layout/Card";
import Form from "../Components/Inputs/Form";
import { useLogInMutation } from "../Redux/API/PublicAPI";
import Img from "../Components/Images/Img";
import Hatchy from "../Images/ChickLogo.png";
import { Link, Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

export default function Login() {
  const user = useAppSelector((state) => state.user.data);
  const [loginFn] = useLogInMutation();

  return !user.uid ? (
    <div className="flex items-center justify-center flex-col flex-fix">
      <Card className="p-4 w-10/12 flex justify-center mt-8">
        <Img src={Hatchy} className="w-36 h-36" />
        <h1 className="text-3xl font-black w-full text-center">
          Welcome back.
        </h1>
        <Form
          name="login"
          submitFn={loginFn}
          doneLabel="Log In"
          completedLabel=""
          className="w-full flex-grow mt-3"
          navClassName="justify-center mt-5"
          formMap={[
            [
              {
                field: "username",
                placeholder: "Email Address",
                type: "email",
                defaultValue: "",
                required: true,
                classes: "flex-1",
              },
              {
                field: "password",
                placeholder: "Password",
                type: "password",
                required: true,
                classes: "flex-1",
              },
            ],
          ]}
        />
      </Card>
      <p className="p-2">
        New to TuneHatch?{" "}
        <Link to="/register" className="text-blue-400">
          Sign up here
        </Link>
      </p>
      <p className="pb-2">
        <Link to="/reset-password" className="text-blue-400">
          Forgot Password
        </Link>
      </p>
    </div>
  ) : (
    <Navigate to="/shows" />
  );
}
