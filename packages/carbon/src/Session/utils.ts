import { StoreService } from "Store/index";
import { ukiSelector } from "Authentication/selectors";
export interface CurrentUserInfo {
  login: string;
  uki: string;
  privateKey: string;
}
export function getCurrentUserInfo(
  storeService: StoreService
): CurrentUserInfo {
  const keyPair = storeService.getUserSession().keyPair;
  return {
    login: storeService.getUserLogin(),
    uki: ukiSelector(storeService.getState()),
    privateKey: keyPair && keyPair.privateKey,
  };
}
