import { useState, useEffect } from "react";

const useHeaders = (currentUser) => {
  const [headers, setHeaders] = useState({});

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_API_KEY;

    const unAuthorizedHeaders = {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    };

    if (currentUser) {
      const authorizedHeaders = {
        ...unAuthorizedHeaders,
        Authorization: currentUser.signInUserSession.idToken.jwtToken,
      };
      setHeaders(authorizedHeaders);
    } else {
      setHeaders(unAuthorizedHeaders);
    }
  }, [currentUser]);

  return headers;
};

export default useHeaders;
