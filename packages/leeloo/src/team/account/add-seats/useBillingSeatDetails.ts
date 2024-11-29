import { GetPlanPricingDetailsResult } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { BillingDetails } from "./add-seats-wrapper";
import { CostDetailsForTier } from "./teamPlanCalculator";
interface Props {
  billingDetails: BillingDetails | GetPlanPricingDetailsResult;
  additionalSeatsDetails: CostDetailsForTier[];
}
export const useBillingSeatDetails = ({
  billingDetails,
  additionalSeatsDetails,
}: Props) => {
  const { translate } = useTranslate();
  const additionalSeatsCount = billingDetails.additionalSeats.seatsCount;
  const additionalSeatsTaxes = billingDetails.additionalSeats.taxes ?? 0;
  const additionalSeatsTaxesTranslation = translate.price(
    billingDetails.currency,
    additionalSeatsTaxes / 100
  );
  const hasTax = additionalSeatsTaxes > 0;
  const renewalTotal =
    billingDetails.renewal.value + (billingDetails.renewal.taxes ?? 0);
  const renewalTotalPrice = translate.price(
    billingDetails.currency,
    renewalTotal / 100
  );
  const tierPrice =
    additionalSeatsDetails.reduce((sum, tier) => {
      return sum + tier.costPerSeat * tier.numberOfSeats;
    }, 0) * 100;
  const tierPriceTranslation = translate.price(
    billingDetails.currency,
    tierPrice / 100
  );
  const proratedDiscount = tierPrice - billingDetails.additionalSeats.value;
  const proratedDiscountTranslation = translate.price(
    billingDetails.currency,
    proratedDiscount / 100
  );
  const hasProratedDiscount = proratedDiscount > 0;
  const dueToday = tierPrice + additionalSeatsTaxes - proratedDiscount;
  const dueTodayTranslation = translate.price(
    billingDetails.currency,
    dueToday / 100
  );
  return {
    additionalSeatsCount,
    additionalSeatsTaxesTranslation,
    hasTax,
    renewalTotalPrice,
    tierPriceTranslation,
    proratedDiscountTranslation,
    hasProratedDiscount,
    dueTodayTranslation,
  };
};
