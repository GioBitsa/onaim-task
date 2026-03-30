import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./app/router";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);
