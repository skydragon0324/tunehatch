import React, { useEffect } from "react";
import RegistrationForm from "../Forms/RegistrationForm";
import { renderPageTitle } from "../Helpers/HelperFunctions";

export default function Register() {
  useEffect(() => {
    renderPageTitle("Register");
  }, []);
  return (
    <>
      <h1 className="text-5xl font-black text-center">Welcome to TuneHatch.</h1>
      <div className="mx-auto w-full">
        <RegistrationForm />
      </div>
    </>
  );
}
