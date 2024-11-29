import {
  DeviceInfo,
  OnboardingType,
  WebOnboardingModeEvent,
} from "@dashlane/communication";
import { tabsCreate } from "@dashlane/webextensions-apis";
import { carbonConnector } from "../../libs/carbon/connector";
interface OnboardingOptions
  extends Pick<
    WebOnboardingModeEvent,
    | "leelooStep"
    | "popoverStep"
    | "completedSteps"
    | "flowLoginCredentialOnWebSite"
  > {
  activeOnboardingType?: OnboardingType;
}
const makeOnboardingMode = (
  options?: OnboardingOptions
): WebOnboardingModeEvent => {
  options = options || {};
  options.completedSteps = options.completedSteps || {};
  return {
    flowCredentialInApp: options.activeOnboardingType === "saveApp",
    flowLoginCredentialOnWeb: options.activeOnboardingType === "loginWeb",
    flowSaveCredentialOnWeb: options.activeOnboardingType === "saveWeb",
    flowImportPasswords: options.activeOnboardingType === "importPasswords",
    flowAddMobileOnWeb: options.activeOnboardingType === "addMobile",
    flowTryAutofillOnWeb: options.activeOnboardingType === "tryAutofill",
    flowLoginCredentialOnWebSite: options.flowLoginCredentialOnWebSite ?? null,
    leelooStep: options.leelooStep,
    popoverStep: options.popoverStep ?? null,
    completedSteps: options.completedSteps,
  };
};
export const setOnboardingMode = (options?: OnboardingOptions) => {
  const webOnboardingMode = makeOnboardingMode(options);
  carbonConnector.updateWebOnboardingMode(webOnboardingMode);
};
export const getMobileDevices = (authorisedDeviceList: DeviceInfo[]) => {
  const mobileDevicesList = authorisedDeviceList.filter((item) => {
    if (item.devicePlatform === null) {
      return;
    }
    return [
      "iphone",
      "server_android",
      "server_ipad",
      "server_iphone",
    ].includes(item.devicePlatform);
  });
  return mobileDevicesList;
};
export const openWebOnboardingTab = async (url: string) => {
  await tabsCreate({ url });
};
