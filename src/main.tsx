import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import store from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
// import { Toaster as ShadToaster } from "@/components/ui/toaster";
import AuthProvider from "./routes/AuthProvider.tsx";
import { loadStripe } from "@stripe/stripe-js";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

import "./index.css";
import App from "./App.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { ThemeProvider } from "./components/themeProvider/theme-provider.tsx";
import { Elements } from "@stripe/react-stripe-js";

Amplify.configure(outputs);

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PK || "");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <Elements stripe={stripePromise}>
              {/* <CheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}> */}
              <TooltipProvider>
                <>
                  <App />
                  <Toaster />
                  {/* <ShadToaster /> */}
                </>
              </TooltipProvider>
            </Elements>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
