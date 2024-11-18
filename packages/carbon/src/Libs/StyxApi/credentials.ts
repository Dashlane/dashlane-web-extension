import { AppCredentials, NoneCredentials } from "Libs/DashlaneApi/credentials";
import { ApiAuthType, AuthParams } from "Libs/DashlaneApi/types";
import { styxKeysSelector } from "Logs/EventLogger/selectors";
import { State } from "Store";
type StyxCredentials = AppCredentials | NoneCredentials;
export function getStyxApiCredentials(
  state: State,
  params: AuthParams
): StyxCredentials {
  if (params.authenticationType !== ApiAuthType.App) {
    return { type: ApiAuthType.None };
  }
  const styxCredentials = {
    appKeys: styxKeysSelector(state),
  };
  return {
    type: ApiAuthType.App,
    ...styxCredentials,
  };
}
