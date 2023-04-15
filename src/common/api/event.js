import { API } from "aws-amplify";

export const createEvent = async (eventData, authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
  };
  headers.Authorization = authToken;
  const body = eventData;
  try {
    console.log("headers:", headers);
    console.log("request body:", body);
    const response = await API.post("APIGatewayAPI", "/event", {
      headers,
      body,
    });
    if (response.statusCode === 200) {
      console.log("success creating event:", response);
      return response;
    } else if (response.statusCode === 400) {
      throw new Error("Error creating event: invalid input");
    }
  } catch (error) {
    throw new Error("Error creating event:", error);
  }
};

export const getUserEvents = async (userId, authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
    Authorization: authToken,
  };

  try {
    console.log("headers:", headers);
    console.log("path parameter id: ", userId);
    const response = await API.get("APIGatewayAPI", `/user/${userId}/events`, {
      headers,
    });
    // check for success and return response
    console.log("success fetching user events:", response);
    return response;
  } catch (error) {
    throw new Error("Error fetching user events:", error);
  }
};
