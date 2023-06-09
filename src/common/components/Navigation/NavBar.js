// eslint-disable-next-line no-unused-vars
import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell, faPlus } from "@fortawesome/free-solid-svg-icons";
import { NewEventModal } from "../../../event/components/NewEventModal";
import { NewAnnouncementModal } from "../../../announcement/components/NewAnnouncementModal";
// import { DropDownMenu } from "./DropDownMenu";
import { ProfileDropDownMenu } from "./ProfileDropDownMenu";
import Modal from "../UIElements/Modal";
// eslint-disable-next-line no-unused-vars
import { Auth } from "aws-amplify";
import { checkEmailExists } from "../../api/auth";
import LoginForm from "../Auth/LoginForm";
import SignupForm from "../Auth/SignupForm";
import ConfirmSignup from "../Auth/ConfirmSignup";
import AuthContext from "../../context/AuthContext";
import { createUser } from "../../api/user";
import { useMessages } from "../../context/MessagesContext";
import NotificationDrawer from "./NotificationDrawer";

const NavBar = () => {
  // router
  const navigate = useNavigate();
  const location = useLocation();

  // context
  const { signIn, signOut, isLoggedIn, currentUser } = useContext(AuthContext);
  const { messages, dispatch } = useMessages();

  // state
  // const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isProfileDropDownOpen, setIsProfileDropDownOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isNewAnnouncementModalOpen, setIsNewAnnouncementModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isConfirmSignupModalOpen, setIsConfirmSignupModalOpen] = useState(false);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [disableClickOutsideModal, setDisableClickOutsideModal] = useState(false);
  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // auto sign in using aws amplify built in function
  // useEffect(() => {
  //   const listenToAutoSignInEvent = () => {
  //     Hub.listen("auth", ({ payload }) => {
  //       const { event } = payload;
  //       if (event === "autoSignIn") {
  //         const user = payload.data;
  //         console.log(user);
  //         setIsLoggedIn(true);
  //         console.log("auto signed in");
  //       } else if (event === "autoSignIn_failure") {
  //         // redirect to sign in page
  //       }
  //     });
  //   };

  //   listenToAutoSignInEvent();
  // }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setShowNotificationDot(true);
    } else {
      setShowNotificationDot(false);
    }
  }, [messages]);

  useEffect(() => {
    const publicPages = []; // Add more restricted pages if needed

    if (!isLoggedIn && !publicPages.includes(location.pathname)) {
      setIsLoginModalOpen(true);
      setDisableClickOutsideModal(true);
    } else {
      setIsLoginModalOpen(false);
    }
  }, [isLoggedIn, location.pathname]);

  const navToProfile = () => {
    navigate("/profile/" + currentUser.attributes.sub);
  };

  const handleRemoveMessage = (id) => {
    dispatch({ type: "REMOVE_MESSAGE", payload: id });
  };

  const handleNewEvent = () => {
    // setIsDropDownOpen(false);
    if (!isLoggedIn) {
      alert("Please sign in to create an event");
      setIsLoginModalOpen(true);
      return;
    }
    setIsNewEventModalOpen(true);
  };

  // const handleNewAnnouncement = () => {
  //   setIsDropDownOpen(false);
  //   if (!isLoggedIn) {
  //     alert("Please sign in to create an announcement");
  //     setIsLoginModalOpen(true);
  //     return;
  //   }
  //   setIsNewAnnouncementModalOpen(true);
  // };

  const closeModals = () => {
    setIsNewEventModalOpen(false);
    setIsNewAnnouncementModalOpen(false);
  };

  const handleLogin = () => {
    setShowResendConfirmation(false);
    setIsProfileDropDownOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSignUp = () => {
    setIsProfileDropDownOpen(false);
    setIsSignUpModalOpen(true);
  };

  const handleSignOut = async () => {
    setIsProfileDropDownOpen(false);
    try {
      await signOut();
      window.alert("You have been signed out");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log("error signing out: ", error);
      window.alert("Error signing out");
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const closeConfirmSignupModal = () => {
    setIsConfirmSignupModalOpen(false);
  };

  const handleLoginSignup = () => {
    closeLoginModal();
    setIsSignUpModalOpen(true);
  };

  const handleSubmitLogin = async (username, password) => {
    if (password === "") {
      window.alert("Please enter a password");
      return;
    }
    if (username === "") {
      window.alert("Please enter a username");
      return;
    }
    setSignupUsername(username);
    setSignupPassword(password);
    try {
      const signedInUser = await signIn(username, password);
      if (signedInUser != null) {
        const idToken = signedInUser.signInUserSession.idToken.jwtToken;
        const { sub, name, email } = signedInUser.attributes;
        console.log("idToken: ", idToken);
        console.log("userSub: ", sub);
        console.log("name: ", name);
        console.log("email: ", email);
        closeLoginModal();
      }
    } catch (error) {
      if (error.code === "NotAuthorizedException") {
        console.log("Incorrect username or password");
        window.alert("Incorrect username or password");
      } else if (error.code === "UserNotFoundException") {
        console.log("User does not exist");
        window.alert("User does not exist");
      } else if (error.code === "UserNotConfirmedException") {
        console.log("User is not confirmed");
        window.alert("User is not confirmed");
        setShowResendConfirmation(true);
      }
    }
  };

  const handleResendConfirmation = async () => {
    try {
      await Auth.resendSignUp(signupUsername);
      console.log("Confirmation code resent successfully");
      closeLoginModal();
      setIsConfirmSignupModalOpen(true);
    } catch (error) {
      console.log("Error resending confirmation code: ", error);
    }
  };

  const handleSubmitSignup = async (name, email, username, password) => {
    // check if email already exists
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      window.alert("Email already exists, please log in instead");
      closeSignUpModal();
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const signUpResult = await Auth.signUp({
        username,
        password,
        attributes: {
          name,
          email,
        },
      });
      if (signUpResult.user) {
        setSignupUsername(username);
        setSignupPassword(password);
        setIsSignUpModalOpen(false);
        setIsConfirmSignupModalOpen(true);
        // create user in database
        const id = signUpResult.userSub;
        await createUser(id, name, email, username);
      }
    } catch (error) {
      if (error.code === "UsernameExistsException") {
        console.log("Username already exists");
        window.alert("Username already exists");
      } else {
        console.log(error.message);
        window.alert(error.message);
      }
    }
  };

  const handleSubmitConfirmSignup = async (username, code) => {
    try {
      const result = await Auth.confirmSignUp(username, code);
      console.log("Confirm Signup: ", result);
      // Automatically sign in the user after successful confirmation
      if (result === "SUCCESS") {
        await signIn(username, signupPassword);
        if (currentUser) {
          const idToken = currentUser.signInUserSession.idToken.jwtToken;
          const { userSub, name, email } = currentUser.attributes;
          console.log("idToken: ", idToken);
          console.log("userSub: ", userSub);
          console.log("name: ", name);
          console.log("email: ", email);
        }
        closeConfirmSignupModal();
        // navigate("/profile");
      }
    } catch (error) {
      if (error.code === "CodeMismatchException") {
        console.log("Incorrect confirmation code");
        window.alert("Incorrect confirmation code");
      } else {
        console.log(error.message);
        window.alert(error.message);
      }
    }
  };

  const handleProfile = () => {
    setIsProfileDropDownOpen(false);
    navToProfile();
  };

  // const getTokens = async () => {
  //   try {
  //     const session = await Auth.currentSession();
  //     const idToken = session.getIdToken().getJwtToken();
  //     const accessToken = session.getAccessToken().getJwtToken();

  //     console.log('Identity token:', idToken);
  //     console.log('Access token:', accessToken);
  //   } catch (error) {
  //     console.error('Error getting tokens:', error);
  //   }
  // }

  return (
    <nav className="bg-gray-50 sticky shadow-sm p-4 px-10 top-0 z-10">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/">
            <h1 className="text-black-500 font-bold text-lg md:text-xl">Eventful</h1>
          </Link>
          <div className="flex items-center space-x-4">
            {/* <Link className="text-white hover:text-blue-200" to="/">
              Home
            </Link> */}
            <Link
              className="text-black-500 hover:text-gray-400 text-md font-semibold"
              to="/events"
            >
              My Events
            </Link>
            <div className="relative">
              <button
                className="hidden sm:block text-black-500 hover:text-gray-400 text-md font-semibold"
                onClick={() => {
                  setIsProfileDropDownOpen(false);
                  handleNewEvent();
                }}
              >
                {/* <FontAwesomeIcon icon={faPlus} /> */}
                Create Event
              </button>
              <button
                className="sm:hidden text-black-500 hover:text-gray-400"
                onClick={() => {
                  setIsProfileDropDownOpen(false);
                  handleNewEvent();
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              {/* <DropDownMenu
                isOpen={isDropDownOpen}
                onNewEvent={handleNewEvent}
                onNewAnnouncement={handleNewAnnouncement}
              /> */}
            </div>
            <div className="relative">
              <button
                className="text-black-500 hover:text-gray-400"
                onClick={() => {
                  // setIsDropDownOpen(false);
                  setIsProfileDropDownOpen(!isProfileDropDownOpen);
                }}
              >
                <FontAwesomeIcon icon={faUser} className="text-lg" />
              </button>
              <ProfileDropDownMenu
                isOpen={isProfileDropDownOpen}
                isLoggedIn={isLoggedIn}
                onLogin={handleLogin}
                onSignup={handleSignUp}
                onProfile={handleProfile}
                onSignOut={handleSignOut}
              />
            </div>
            <div className="relative">
              <button
                className="text-black-500 hover:text-gray-400"
                onClick={() => {
                  setIsNotificationDrawerOpen(true);
                  setShowNotificationDot(false);
                }}
              >
                <FontAwesomeIcon icon={faBell} className="text-lg" />
                {showNotificationDot && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <NewEventModal isOpen={isNewEventModalOpen} onClose={closeModals} />
      <NewAnnouncementModal isOpen={isNewAnnouncementModalOpen} onClose={closeModals} />
      <Modal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        title="Log In"
        disableClickOutside={disableClickOutsideModal}
      >
        <LoginForm
          onSubmit={handleSubmitLogin}
          onSignup={handleLoginSignup}
          username={signupUsername}
          setUsername={setSignupUsername}
          password={signupPassword}
          setPassword={setSignupPassword}
        />
        {showResendConfirmation && (
          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleResendConfirmation}
            >
              Resend Confirmation Code
            </button>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={isSignUpModalOpen}
        onClose={closeSignUpModal}
        disableClickOutside={disableClickOutsideModal}
        title="Sign Up"
      >
        <SignupForm
          onSubmit={handleSubmitSignup}
          signupUsername={signupUsername}
          signupPassword={signupPassword}
        />
      </Modal>
      <Modal
        isOpen={isConfirmSignupModalOpen}
        onClose={closeConfirmSignupModal}
        title="Confirm Sign Up"
        disableClickOutside={disableClickOutsideModal}
      >
        <ConfirmSignup onSubmit={handleSubmitConfirmSignup} username={signupUsername} />
      </Modal>
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        messages={messages}
        onRemoveMessage={handleRemoveMessage}
      />
    </nav>
  );
};

export default NavBar;
