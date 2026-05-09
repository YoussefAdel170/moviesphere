import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { setLanguage } from "./redux/features/movies/movieSlice";
import "./index.css";
import { syncLanguage } from "./i18n/languageSync";

const storedLang =
  (localStorage.getItem("language") as "en-US" | "ar") || "en-US";

syncLanguage(storedLang);
store.dispatch(setLanguage(storedLang));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
