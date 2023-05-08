// src/contexts/MessagesContext.js
import { createContext, useContext, useReducer } from "react";

const MessagesContext = createContext();

const messagesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      const parsedMessage = { ...action.payload, Body: JSON.parse(action.payload.Body) };
      return [...state, parsedMessage].sort(
        (a, b) => new Date(b.Body.timestamp) - new Date(a.Body.timestamp)
      );
    case "REMOVE_MESSAGE":
      return state.filter((message) => message.MessageId !== action.payload);
    default:
      return state;
  }
};

export const MessagesProvider = ({ children }) => {
  const [messages, dispatch] = useReducer(messagesReducer, []);

  return (
    <MessagesContext.Provider value={{ messages, dispatch }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }

  return context;
};
