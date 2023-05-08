import { Auth } from "aws-amplify";
import AWS from "aws-sdk";

export const updateAuthToken = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.idToken.jwtToken;
  } catch (error) {
    console.error("Error getting current session token, please sign in.", error);
    return null;
  }
};

export const checkEmailExists = async (email) => {
  // Initialize the DynamoDB Document Client
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_DYNAMODB_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_DYNAMODB_SECRET_ACCESS_KEY,
  });

  const docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: "Eventful-Users",
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const result = await docClient.query(params).promise();
    if (result.Items.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error querying DynamoDB:", error);
    return false;
  }
};
