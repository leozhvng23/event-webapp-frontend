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
