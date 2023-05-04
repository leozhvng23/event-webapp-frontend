import { API } from "aws-amplify";

export const createInvitation = async (eid, email, message, authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
    Authorization: authToken,
  };
  const body = {
    eid,
    email,
    message,
    invitationStatus: "PENDING",
  };
  try {
    console.log("headers:", headers);
    console.log("request body:", body);
    const response = await API.post("APIGatewayAPI", "/invitation", {
      headers,
      body,
    });
    if (response.statusCode === 201) {
      console.log("success creating invitation:", response);
      return response;
    } else if (response.statusCode === 400) {
      throw new Error("Error creating invitation: invalid input");
    }
  } catch (error) {
    throw new Error("Error creating invitation:", error);
  }
};