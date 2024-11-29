import { makeLocalReducer } from "redux-cursor";
import { State } from ".";
const reducer = makeLocalReducer<State>("duo-settings", {
  hasDuo: false,
  duoIntegrationKey: "",
  duoSecretKey: "",
  duoApiHostname: "",
});
export const duoSettingsLoaded = reducer.action<{}>(
  "duo-settings-loaded",
  ({ param }: any) => ({
    hasDuo: param.duo || false,
    duoIntegrationKey: param.duoIntegrationKey || "",
    duoSecretKey: param.duoSecretKey || "",
    duoApiHostname: param.duoApiHostname || "",
  })
);
export const setDuo = reducer.action<{}>("duo-set", ({ param }: any) => ({
  hasDuo: param,
}));
export const setDuoIntegrationKey = reducer.action<{}>(
  "duo-integration-key-set",
  ({ param }: any) => ({ duoIntegrationKey: param })
);
export const setDuoSecretKey = reducer.action<{}>(
  "duo-secret-key-set",
  ({ param }: any) => ({ duoSecretKey: param })
);
export const setDuoApiHostname = reducer.action<{}>(
  "duo-api-hostname-set",
  ({ param }: any) => ({ duoApiHostname: param })
);
export default reducer;
