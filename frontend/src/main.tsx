import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import GlobalTree from "./pages/GlobalTree/GlobalTree.tsx";
import BranchDetails from "./pages/BranchDetails/BranchDetails.tsx";
import { GlobalProvider } from "./contexts/GlobalContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <GlobalTree />,
      },
      {
        path: "/Details/:id",
        element: <BranchDetails />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  </StrictMode>
);
