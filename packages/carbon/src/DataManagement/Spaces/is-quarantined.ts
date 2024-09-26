import { PremiumStatusSpace, Space } from "@dashlane/communication";
export const isPremiumStatusSpaceQuarantined = (
  s: PremiumStatusSpace
): boolean =>
  !!s?.status &&
  s.status.toLowerCase() !== "accepted" &&
  !!s.info &&
  Array.isArray(s.info["teamDomains"]) &&
  s.info["teamDomains"].length > 0 &&
  Boolean(s.info["removeForcedContentEnabled"]);
export const isQuarantined = (s: Space): boolean =>
  s && isPremiumStatusSpaceQuarantined(s.details);
