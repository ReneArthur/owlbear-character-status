import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { LoadOBRData } from "@common/components/core/LoadOBRData/index.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LoadOBRData>
      <App />
    </LoadOBRData>
  </React.StrictMode>
);
