import { carbonConnector } from "../../../carbonConnector";
export function updateProtectPasswordsSetting(
  protectPasswordsSetting: boolean
) {
  return carbonConnector.updateProtectPasswordsSetting(protectPasswordsSetting);
}
