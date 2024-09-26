import {
  ExtractedPasswords,
  IncomingBreach,
} from "DataManagement/Breaches/Gateways/types";
import { BreachContent } from "DataManagement/Breaches/types";
import {
  isIncomingDataLeakBreachDetails,
  isIncomingDataLeakPasswordInfo,
} from "DataManagement/Breaches/Gateways/guards";
import { WSResponseBase } from "Libs/WS/types";
import { PremiumStatus } from "@dashlane/communication";
export const makeIncomingBreach = (
  content: BreachContent,
  leakedPasswords: string[]
): IncomingBreach => ({
  content,
  leakedPasswords,
});
export const getLeakedPasswordFromIncomingDataLeakDetails = (
  detailsJson: unknown
) => {
  if (!Array.isArray(detailsJson)) {
    return {};
  }
  const passwordFromPasswordInfo = (passwordInfo: unknown) =>
    isIncomingDataLeakPasswordInfo(passwordInfo) ? passwordInfo.value : null;
  return detailsJson.reduce(
    (acc: ExtractedPasswords, breachDetails: unknown) => {
      if (!isIncomingDataLeakBreachDetails(breachDetails)) {
        return acc;
      }
      const { breachId, data } = breachDetails;
      const passwords = data.map(passwordFromPasswordInfo).filter(Boolean);
      if (passwords.length) {
        return { ...acc, [breachId]: passwords };
      }
      return acc;
    },
    {}
  );
};
export const isBreachesWSResponseNotModified = (response: WSResponseBase) => {
  return response.code === 304;
};
export function hasDarkWebMonitoringFeature(
  premiumStatus: PremiumStatus | null
): boolean {
  if (!premiumStatus) {
    return false;
  }
  const { capabilities } = premiumStatus;
  return Boolean(capabilities?.dataLeak?.enabled);
}
