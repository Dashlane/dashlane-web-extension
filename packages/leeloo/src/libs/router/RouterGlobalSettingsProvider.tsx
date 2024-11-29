import React, { useContext } from "react";
import type { RouterGlobalSettings } from "./types";
export const RouterGlobalSettingsContext =
  React.createContext<RouterGlobalSettings>({
    host: "",
    store: {
      getState: () => ({
        carbon: {},
      }),
    },
    reducer: {},
    translate: {},
    routes: {},
  } as RouterGlobalSettings);
export const RouterGlobalSettingsProvider =
  RouterGlobalSettingsContext.Provider;
export const useRouterGlobalSettingsContext = () =>
  useContext(RouterGlobalSettingsContext);
