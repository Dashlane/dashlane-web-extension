import { SpaceTier } from "@dashlane/team-admin-contracts";
import { TranslatorInterface } from "../../../libs/i18n/types";
export const ADDITIONAL_SEAT_CAP = 54999;
export const MIN_SEAT_PREMIUM = 1;
export const SALES_EMAIL = "__REDACTED__";
const I18N_KEYS = {
  REDEEM_SUCCESS: "team_account_teamplan_upgrade_redeem_success",
  REDEEM_ERROR: "team_account_teamplan_upgrade_redeem_error",
  STARTER: "leeloo_teamplan_starter",
  BUSINESS: "leeloo_teamplan_business",
  TEAM: "leeloo_teamplan_team",
};
export const isSeatCountAboveCap = (seatCount: number) =>
  seatCount > ADDITIONAL_SEAT_CAP;
export function getLocalizedPlanTier(
  tier: SpaceTier,
  translate: TranslatorInterface
): string {
  switch (tier) {
    case SpaceTier.Starter:
      return translate(I18N_KEYS.STARTER);
    case SpaceTier.Team:
      return translate(I18N_KEYS.TEAM);
    case SpaceTier.Business:
      return translate(I18N_KEYS.BUSINESS);
    default:
      throw new Error("Cannot retrieve default key");
  }
}
export const getPromoCodeResponse = (
  isRedeemed: boolean,
  translate: TranslatorInterface
): {
  translation: string;
  translationIntent: "success" | "error";
} => ({
  translation: isRedeemed
    ? translate(I18N_KEYS.REDEEM_SUCCESS)
    : translate(I18N_KEYS.REDEEM_ERROR),
  translationIntent: isRedeemed ? "success" : "error",
});
