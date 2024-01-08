// @ts-nocheck
import React from "react";
import * as ReactDOM from "react-dom/client";
import { defaultLang } from "./core/i18n.ts";
import { Main } from "./main.tsx";
import "../src/core/i18n.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.Suspense fallback={<Loader />}>
    <Main defaultLang={defaultLang} />
  </React.Suspense>,
);
