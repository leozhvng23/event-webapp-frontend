import { API } from "aws-amplify";

export const getCommentsByEventId = async (eid, authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
    Authorization: authToken,
  };

  try {
    console.log("headers:", headers);
    console.log("path parameter id: ", eid);
    const response = await API.get("APIGatewayAPI", `/event/${eid}/comments`, {
      headers,
    });
    console.log("success fetching comments:", response);
    return response;
  } catch (error) {
    throw new Error("Error fetching comments:", error);
  }
};

export const createComment = async (requestBody, authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
  };
  headers.Authorization = authToken;
  const body = requestBody;
  try {
    console.log("headers:", headers);
    console.log("request body:", body);
    const response = await API.post("APIGatewayAPI", "/comment", {
      headers,
      body,
    });
    if (response.statusCode === 201) {
      console.log("success creating comment:", response);
      return response;
    } else if (response.statusCode === 400) {
      throw new Error("Error creating comment: invalid input");
    }
  } catch (error) {
    throw new Error("Error creating comment:", error);
  }
};
