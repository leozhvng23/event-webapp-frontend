import { Auth } from "aws-amplify";

export const updateAuthToken = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.idToken.jwtToken;
  } catch (error) {
    console.error("Error getting current session token, please sign in.", error);
    return null;
  }
};

// check if email already exists in Cognito
export const checkEmailExists = async (email) => {
  try {
    const response = await Auth.signIn(email.toLowerCase(), "password");
    console.log("response:", response);
    return false;
  } catch (error) {
    const { code } = error;
    if (code === "NotAuthorizedException") {
      return true;
    }
    return false;
  }
};
