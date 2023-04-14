import { API } from "aws-amplify";

export const createUser = async (id, name, email, username) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
  };
  const body = {
    id: id,
    name: name,
    email: email,
    username: username,
    bio: "",
  };

  try {
    console.log("headers:", headers);
    console.log("request body:", body);

    const response = await API.post("APIGatewayAPI", "/user", {
      headers,
      body,
    });
    if (response.statusCode === 200) {
      console.log("success creating user:", response);
      return response;
    } else if (response.statusCode === 400) {
      throw new Error("Error creating user: invalid input");
    }
  } catch (error) {
    throw new Error("Error creating user:", error);
  }
};

export const getUser = async (id, authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
  };

  headers.Authorization = authToken;

  console.log("headers:", headers);
  try {
    const response = await API.get("APIGatewayAPI", `/user/${id}`, {
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
