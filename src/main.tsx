import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.js";
import AddListModalProvider from "./contexts/AddListModalContext.js";
import { ToastProvider } from "./contexts/ToastContext.js";
import { MediaQueriesContextProvider } from "./contexts/MediaQueriesContext.js";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <MediaQueriesContextProvider>
            <ToastProvider>
              <AddListModalProvider>
                <App />
              </AddListModalProvider>
            </ToastProvider>
          </MediaQueriesContextProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
