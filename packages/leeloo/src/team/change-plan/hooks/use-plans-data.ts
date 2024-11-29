import { B2BOffers } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { TranslatorInterface } from "../../../libs/i18n/types";
import {
  basePlanConfig,
  getPlanConfig,
  PricingPlanData,
} from "../../shared/plan-config";
import { LimitedBusinessOfferData } from "../../limited-business-offer/use-limited-business-offer-data";
import {
  getMonthlyPrice,
  getMonthlySeatPrice,
  getStarterSeats,
  getYearlyPrice,
} from "../utils";
import { planFeatureLists } from "../plan-feature-lists";
const getPrices = (teamOffers: B2BOffers | undefined) => {
  const businessSeatPrice = teamOffers?.businessOffer
    ? getMonthlySeatPrice({ offer: teamOffers.businessOffer })
    : null;
  const starterSeatPrice = teamOffers?.starterOffer
    ? getMonthlySeatPrice({ offer: teamOffers.starterOffer })
    : null;
  const standardMonthlyPrice = teamOffers?.entryLevelOffer
    ? getMonthlyPrice({
        offer: teamOffers.entryLevelOffer,
        selectedSeatsQty: 10,
      })
    : null;
  const standardYearlyPrice = teamOffers?.entryLevelOffer
    ? getYearlyPrice({
        offer: teamOffers.entryLevelOffer,
        selectedSeatsQty: 10,
      })
    : null;
  return {
    businessSeatPrice,
    starterSeatPrice,
    standardMonthlyPrice,
    standardYearlyPrice,
  };
};
const formatPrice = (
  amount: number | null,
  currency: string | undefined,
  translate: TranslatorInterface
) => {
  return amount && currency
    ? translate.price(currency, amount / 100, { notation: "compact" })
    : null;
};
const getPlanOverrides = (
  data: {
    currency: string | undefined;
    businessSeatPrice: number | null;
    starterSeatPrice: number | null;
    standardMonthlyPrice: number | null;
    standardYearlyPrice: number | null;
    starterSeats: number;
    monthlyStarterPrice: number;
  },
  translate: TranslatorInterface,
  limitedBusinessOffer: LimitedBusinessOfferData
) => {
  const {
    currency,
    businessSeatPrice,
    starterSeatPrice,
    standardMonthlyPrice,
    standardYearlyPrice,
    starterSeats,
    monthlyStarterPrice,
  } = data;
  const formatPriceWithData = (amount: number | null) =>
    formatPrice(amount, currency, translate);
  return {
    standard: {
      ...basePlanConfig.standard,
      currentPlan: true,
      price: formatPriceWithData(standardMonthlyPrice),
      priceDescription1: {
        key: "team_account_teamplan_changeplan_plans_per_month_members",
      },
      priceDescription2: {
        key: "team_account_teamplan_changeplan_plans_billed_at_annually",
        variables: {
          yearlyPrice: formatPriceWithData(standardYearlyPrice),
        },
      },
      showUpgradeInfobox: true,
      features: [...planFeatureLists.standard],
    },
    standardUpgradeBusiness: {
      planName: "business",
      price: formatPriceWithData(businessSeatPrice),
      heading: {
        key: "team_account_teamplan_changeplan_plans_business_name_V2",
      },
      priceDescription1: {
        key: "team_account_teamplan_changeplan_plans_per_seat_month",
      },
      priceDescription2: {
        key: "team_account_teamplan_changeplan_plans_billed_anually",
      },
      showRecommendedBadge: true,
      features: [...planFeatureLists.standardUpgradeBusiness],
    },
    starter: {
      currentPlan: true,
      planName: "starter",
      price: formatPriceWithData(starterSeatPrice),
      heading: { key: "team_account_teamplan_changeplan_plans_starter_name" },
      priceDescription1: {
        key: "team_account_teamplan_changeplan_plans_per_seat_month",
      },
      priceDescription2: {
        key: "team_account_teamplan_changeplan_plans_billed_monthly_at",
        variables: {
          numberSeats: starterSeats,
          monthlyPrice: formatPriceWithData(monthlyStarterPrice),
        },
      },
      features: [
        {
          key: "team_account_teamplan_changeplan_plans_seats_flat_rate_markup",
          icon: "check",
          loading: !starterSeatPrice,
          variables: {
            numberSeats: starterSeats,
            monthlyPrice: formatPriceWithData(monthlyStarterPrice),
          },
        },
        ...planFeatureLists.starter,
      ],
      footer: {
        key: "team_account_teamplan_changeplan_plans_starter_upgrade_markup",
      },
    },
    business: {
      ...basePlanConfig.business,
      price: formatPriceWithData(businessSeatPrice),
      equivalentPrice:
        limitedBusinessOffer.hasLimitedOffer && businessSeatPrice && currency
          ? limitedBusinessOffer.translatedEquivalentPrice
          : null,
      limitedOffer: limitedBusinessOffer.hasLimitedOffer,
      features: [...planFeatureLists.business],
    },
  };
};
export const usePlansData = (
  teamOffers: B2BOffers | undefined,
  limitedBusinessOffer: LimitedBusinessOfferData
): PricingPlanData => {
  const { translate } = useTranslate();
  const currency = teamOffers?.businessOffer?.currency;
  const {
    businessSeatPrice,
    starterSeatPrice,
    standardMonthlyPrice,
    standardYearlyPrice,
  } = getPrices(teamOffers);
  const starterSeats = getStarterSeats(teamOffers?.starterOffer);
  const monthlyStarterPrice =
    teamOffers?.starterOffer && starterSeatPrice
      ? starterSeats * starterSeatPrice
      : 0;
  const planOverrides = getPlanOverrides(
    {
      currency,
      businessSeatPrice,
      starterSeatPrice,
      standardMonthlyPrice,
      standardYearlyPrice,
      starterSeats,
      monthlyStarterPrice,
    },
    translate,
    limitedBusinessOffer
  );
  return getPlanConfig(planOverrides);
};
