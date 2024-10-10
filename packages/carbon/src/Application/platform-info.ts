import { PlatformInfo } from "@dashlane/communication";
import { defaultPlatformInfo } from "Session/Store/platform";
let _platformInfo: PlatformInfo = Object.assign({}, defaultPlatformInfo);
export function getPlatformInfo(): PlatformInfo {
  return _platformInfo;
}
export function setPlatformInfo(platformInfo: Partial<PlatformInfo>) {
  _platformInfo = Object.assign({}, defaultPlatformInfo, platformInfo);
}
