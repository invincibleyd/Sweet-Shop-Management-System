import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// ✅ mount Toaster OUTSIDE StrictMode
createRoot(document.getElementById("toast-root") ?? document.body.appendChild(document.createElement("div"))).render(
  <Toaster position="top-right" />
);
