import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import { ConfigProvider } from "antd";
import "./css/global.css";
import "./css/app.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);
