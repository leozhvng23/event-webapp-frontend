// src/contexts/MessagesContext.js
import { createContext, useContext, useReducer } from "react";

const MessagesContext = createContext();

const messagesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...state, action.payload];
    case "REMOVE_MESSAGE":
      return state.filter((message) => message.id !== action.payload);
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
