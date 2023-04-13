import React from "react";
import ReactDOM from "react-dom/client";
import "./tailwind.css";
import "react-tooltip/dist/react-tooltip.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./common/context/AuthContext";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure({
  ...awsExports,
  API: {
    endpoints: [
      {
        name: "APIGatewayAPI",
        endpoint: "https://lp0tsuvtm9.execute-api.us-east-1.amazonaws.com/dev",
        region: awsExports.aws_project_region,
      },
    ],
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
