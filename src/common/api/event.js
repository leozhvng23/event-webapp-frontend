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

export const getUserEvents = async (
  userId,
  authToken,
  page = 1,
  limit = 10,
  eventType
) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
    Authorization: authToken,
  };

  try {
    console.log("headers:", headers);
    console.log("path parameter id: ", userId);
    console.log("query string parameters: ", {
      eventType,
      page,
      limit,
    });
    const response = await API.get("APIGatewayAPI", `/user/${userId}/events`, {
      headers,
      queryStringParameters: {
        eventType,
        page,
        limit,
      },
    });
    console.log("success fetching user events:", response);
    return response;
  } catch (error) {
    throw new Error("Error fetching user events:", error);
  }
};

export const getEventById = async (eventId, authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
    Authorization: authToken,
  };

  try {
    console.log("headers:", headers);
    console.log("path parameter id: ", eventId);
    const response = await API.get("APIGatewayAPI", `/event/${eventId}`, {
      headers,
    });
    console.log("success fetching event by id:", response);
    return response;
  } catch (error) {
    throw new Error("Error fetching event by id:", error);
  }
};

export const updateEvent = async (userId, eventId, eventData, authToken) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.REACT_APP_API_KEY,
  };
  headers.Authorization = authToken;
  const body = eventData;
  try {
    console.log("headers:", headers);
    console.log("request body:", body);
    const response = await API.put("APIGatewayAPI", `/user/${userId}/event/${eventId}`, {
      headers,
      body,
    });
    if (response.statusCode === 200) {
      console.log("success updating event:", response);
      return response;
    } else if (response.statusCode === 400) {
      throw new Error("Error updating event: invalid input");
    }
  } catch (error) {
    throw new Error("Error updating event:", error);
  }
};
