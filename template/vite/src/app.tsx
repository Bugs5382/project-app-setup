// @ts-nocheck
import React from "react";
import * as ReactDOM from "react-dom/client";
import { defaultLang } from "./core/i18n.ts";
import "../src/core/i18n.ts";

import { Main } from "./main.tsx";
import { Loader } from "./components/loader.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.Suspense fallback={<Loader />}>
    <Main defaultLang={defaultLang} />
  </React.Suspense>,
);
