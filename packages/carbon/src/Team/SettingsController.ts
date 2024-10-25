import { keys, values, zipWith } from "ramda";
import {
  SetTeamSettingsRequest,
  SetTeamSettingsResult,
} from "@dashlane/communication";
import { StoreService } from "Store/index";
import { CurrentUserInfo, getCurrentUserInfo } from "Session/utils";
import { WSService } from "Libs/WS/index";
import * as Settings from "Libs/WS/Settings";
import { updateCurrentSpaceWith } from "Session/SpaceDataController";
export interface SettingsController {
  setTeamSettings: (
    setTeamSettingsRequest: SetTeamSettingsRequest
  ) => Promise<SetTeamSettingsResult>;
}
export const makeSettingsController = (
  storeService: StoreService,
  wsService: WSService
) => {
  return {
    setTeamSettings: (setTeamSettingsRequest: SetTeamSettingsRequest) =>
      setTeamSettings(
        storeService,
        wsService,
        getCurrentUserInfo(storeService),
        setTeamSettingsRequest
      ),
  };
};
const camelToUnderscore = (str: string) => {
  return str.replace(/([A-Z])/g, (_x, y) => `_${y.toLowerCase()}`);
};
const handleValueSetting = (key: string, value: any) => {
  return value !== null
    ? { type: `set_${camelToUnderscore(key)}`, value: value }
    : { type: `unset_${camelToUnderscore(key)}` };
};
export function setTeamSettings(
  storeService: StoreService,
  wsService: WSService,
  { login, uki }: CurrentUserInfo,
  { teamId, settings }: SetTeamSettingsRequest
): Promise<SetTeamSettingsResult> {
  const operations = zipWith(
    handleValueSetting,
    keys(settings),
    values(settings)
  ) as Settings.WSSettingOperation[];
  return wsService.settings
    .setTeamSettings({ login, uki, teamId, operations })
    .then(() => {
      updateCurrentSpaceWith(storeService, (currentSpace) =>
        Object.assign({}, currentSpace, {
          details: Object.assign({}, currentSpace.details, {
            info: Object.assign({}, currentSpace.details.info, settings),
          }),
        })
      );
      return {};
    })
    .catch((error: Error) => ({ error }));
}
