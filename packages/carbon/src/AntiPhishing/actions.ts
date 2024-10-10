import { Action } from "Store";
export const UPDATE_ANTI_PHISHING_URL_LIST = "UPDATE_ANTI_PHISHING_URL_LIST";
export interface UpdateAntiPhishingURLListAction extends Action {
  type: typeof UPDATE_ANTI_PHISHING_URL_LIST;
  phishingURLList: Set<string>;
}
export const updateAntiPhishingURLList = (
  phishingURLList: Set<string>
): UpdateAntiPhishingURLListAction => ({
  type: UPDATE_ANTI_PHISHING_URL_LIST,
  phishingURLList,
});
export type AntiPhishingAction = UpdateAntiPhishingURLListAction;
