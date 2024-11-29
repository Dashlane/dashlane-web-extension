import { DataStatus } from "@dashlane/carbon-api-consumers";
import { isBusinessTier } from "../../libs/account/helpers";
import { usePremiumStatus } from "../../libs/carbon/hooks/usePremiumStatus";
import useTranslate from "../../libs/i18n/useTranslate";
import { getMonthlySeatPrice } from "../change-plan/utils";
import { useTeamOffers } from "../hooks/use-team-offers";
export type LimitedBusinessOfferData =
  | {
      hasLimitedOffer: false;
    }
  | {
      hasLimitedOffer: boolean;
      translatedPrice: string;
      translatedEquivalentPrice: string;
    };
export const useLimitedBusinessOfferData = (): LimitedBusinessOfferData => {
  const { translate } = useTranslate();
  const premiumStatus = usePremiumStatus();
  const teamOffers = useTeamOffers();
  if (!teamOffers || premiumStatus.status !== DataStatus.Success) {
    return {
      hasLimitedOffer: false,
    };
  }
  const canUpgradeToBusiness = !isBusinessTier(premiumStatus.data);
  const { businessOffer } = teamOffers;
  const monthlySeatPrice = getMonthlySeatPrice({
    offer: businessOffer,
  });
  const monthlySeatEquivalentPrice = getMonthlySeatPrice({
    offer: businessOffer,
    priceTarget: "equivalentPrice",
  });
  const hasLimitedOffer =
    canUpgradeToBusiness && monthlySeatPrice !== monthlySeatEquivalentPrice;
  const translatedPrice = translate.price(
    businessOffer.currency,
    monthlySeatPrice / 100,
    { notation: "compact" }
  );
  const translatedEquivalentPrice = translate.price(
    businessOffer.currency,
    monthlySeatEquivalentPrice / 100,
    { notation: "compact" }
  );
  return {
    hasLimitedOffer,
    translatedPrice,
    translatedEquivalentPrice,
  };
};
