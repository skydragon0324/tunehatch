import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

function LegacyRedirect() {
  const { id } = useParams();
  const location = useLocation();
  const [redirect, setRedirect] = useState(null);
  useEffect(() => {
    if (location.pathname.includes("venue")) {
      setRedirect("/profile/v/" + id);
    } else {
      setRedirect("/profile/u/" + id);
    }
  }, []);

  return (
    <>
      {redirect ? (
        <>
          <Navigate replace to={redirect} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default LegacyRedirect;
