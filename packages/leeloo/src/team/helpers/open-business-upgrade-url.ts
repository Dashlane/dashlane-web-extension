import { SpaceTier } from "@dashlane/team-admin-contracts";
import { BUSINESS_UPGRADE } from "../urls";
import { openDashlaneUrl } from "../../libs/external-urls";
export enum FeatureType {
  CRD = "CRD",
  Nudges = "nudges",
}
export function openBusinessUpgradeUrl(
  feature: FeatureType,
  tier?: SpaceTier,
  isTrialOrGracePeriod?: boolean
): void {
  const tracking = {
    campaign: "business-plus-upgrade",
    source: "product",
    medium: feature,
  };
  let content: string | undefined;
  if (isTrialOrGracePeriod) {
    content = "trial";
  } else if (tier) {
    const tierMap = {
      [SpaceTier.Business]: "business",
      [SpaceTier.Standard]: "standard",
      [SpaceTier.Starter]: "starter",
      [SpaceTier.Team]: "teams",
    } as const;
    type AllowedTier = keyof typeof tierMap;
    content = tierMap[tier as AllowedTier] ?? undefined;
  }
  openDashlaneUrl(
    BUSINESS_UPGRADE,
    content ? { ...tracking, content } : tracking
  );
}
