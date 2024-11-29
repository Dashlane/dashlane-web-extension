import {
  B2BOffers,
  GetTeamTrialStatusResult,
  SpaceTier,
} from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { LimitedBusinessOfferData } from "../../limited-business-offer/use-limited-business-offer-data";
import { getMonthlyPrice, getMonthlySeatPrice } from "../../change-plan/utils";
import {
  basePlanConfig,
  getPlanConfig,
  PricingPlanData,
} from "../../shared/plan-config";
interface Props {
  teamOffers: B2BOffers | undefined;
  limitedBusinessOffer: LimitedBusinessOfferData;
  teamTrialStatus: GetTeamTrialStatusResult | null;
  numberOfMembers: number;
}
export const usePlanSelectionData = ({
  teamOffers,
  limitedBusinessOffer,
  teamTrialStatus,
  numberOfMembers,
}: Props): PricingPlanData => {
  const { translate } = useTranslate();
  const currency = teamOffers?.businessOffer?.currency;
  const businessSeatPrice = teamOffers?.businessOffer
    ? getMonthlySeatPrice({
        offer: teamOffers.businessOffer,
      })
    : null;
  const standardMonthlyPrice = teamOffers?.entryLevelOffer
    ? getMonthlyPrice({
        offer: teamOffers.entryLevelOffer,
        selectedSeatsQty: 10,
      })
    : null;
  const isBusinessTrial = teamTrialStatus?.spaceTier === SpaceTier.Business;
  const planOverrides = {
    standard: {
      ...basePlanConfig.standard,
      isStandardPlanRestricted: numberOfMembers > 10,
      price:
        standardMonthlyPrice && currency
          ? translate.price(currency, standardMonthlyPrice / 100, {
              notation: "compact",
            })
          : null,
    },
    business: {
      ...basePlanConfig.business,
      currentTrial: isBusinessTrial,
      price:
        businessSeatPrice && currency
          ? translate.price(currency, businessSeatPrice / 100, {
              notation: "compact",
            })
          : null,
      equivalentPrice:
        limitedBusinessOffer.hasLimitedOffer && businessSeatPrice && currency
          ? limitedBusinessOffer.translatedEquivalentPrice
          : null,
      limitedOffer: limitedBusinessOffer.hasLimitedOffer,
    },
    businessPlus: {
      planName: "businessPlus",
      price: {
        key: "team_post_trial_checkout_plan_selection_biz_plus_card_price",
      },
      heading: {
        key: "team_post_trial_checkout_plan_selection_biz_plus_card_title",
      },
      priceDescription1: {
        key: "team_post_trial_checkout_plan_selection_biz_plus_card_coverage",
      },
      priceDescription2: {
        key: "team_account_teamplan_changeplan_plans_billed_anually",
      },
      features: [
        {
          key: "team_post_trial_checkout_plan_selection_biz_plus_card_feature_everything_markup",
          icon: "check",
        },
        {
          key: "team_post_trial_checkout_plan_selection_biz_plus_card_feature_hundred_plus",
        },
        {
          key: "team_post_trial_checkout_plan_selection_biz_plus_card_feature_nudges_markup",
        },
        {
          key: "team_post_trial_checkout_plan_selection_biz_plus_card_feature_risk_detection_markup",
        },
        {
          key: "team_post_trial_checkout_plan_selection_biz_plus_card_feature_deployment",
        },
        {
          key: "team_post_trial_checkout_plan_selection_biz_plus_card_feature_security",
        },
        {
          key: "team_post_trial_checkout_plan_selection_biz_plus_card_feature_onboarding",
        },
      ],
    },
  };
  return getPlanConfig(planOverrides);
};
