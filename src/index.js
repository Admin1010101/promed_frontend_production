import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./utils/auth";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://c4ce0fdd8898080c16f25567abe2de28@o4509803038113792.ingest.us.sentry.io/4509844028063744",
  sendDefaultPii: true,
  // tracesSampleRate: 1.0,  // Set to 0.1 or less in production
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App /> 
    </AuthProvider>
  </React.StrictMode>
);
