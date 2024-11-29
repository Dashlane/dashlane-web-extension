import { useState } from "react";
import { debounce } from "lodash";
import { ComputePlanPrice } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
import { ComputePlanPricingResults } from "../../../api/teamPlans/types";
import { useAlertQueue } from "../../alerts/use-alert-queue";
import { BillingDetails } from "./add-seats-wrapper";
import { transformUnknownErrorToErrorMessage } from "../../../helpers";
export const getBillingDetailsFromPricingResults = (
  pricing: ComputePlanPricingResults
) => {
  const billingDetails: BillingDetails = {
    renewal: {
      seatsCount: pricing.renewal.seatsCount,
      value: pricing.renewal.price.value,
    },
    additionalSeats: {
      seatsCount: pricing.additionalSeats.seatsCount,
      value: pricing.additionalSeats.price.value,
    },
    currency: pricing.renewal.price.currency,
  };
  return billingDetails;
};
export const getTaxBillingDetailsFromPricingResults = (
  pricing: ComputePlanPrice
) => {
  const billingDetails: BillingDetails = {
    renewal: {
      seatsCount: pricing.renewal.seatsCount,
      value: pricing.renewal.price.value,
      taxes: pricing.renewal.price.taxes,
    },
    additionalSeats: {
      seatsCount: pricing.additionalSeats.seatsCount,
      value: pricing.additionalSeats.price.value,
      taxes: pricing.additionalSeats.price.taxes,
    },
    currency: pricing.renewal.price.currency,
  };
  return billingDetails;
};
export const useAdditionalSeatCountPricing = (
  getLatestRequestedSeatCount: (() => number) | null
) => {
  const { reportTACError } = useAlertQueue();
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    renewal: {
      seatsCount: 0,
      value: 0,
      taxes: 0,
    },
    additionalSeats: {
      seatsCount: 0,
      value: 0,
      taxes: 0,
    },
    currency: "usd",
  });
  const [isComputingBilling, setIsComputingBilling] = useState<boolean>(false);
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [amountToTax, setAmountToTax] = useState<number>(0);
  const computePlanPricingTax = async (seats: number) => {
    try {
      const planPrice = await carbonConnector.computePlanPricing({ seats });
      if (!planPrice.success) {
        return;
      }
      const billingDetailsResult = getTaxBillingDetailsFromPricingResults(
        planPrice.data
      );
      if (
        getLatestRequestedSeatCount !== null &&
        getLatestRequestedSeatCount() !==
          billingDetailsResult.additionalSeats.seatsCount
      ) {
        return;
      }
      const seatsPrice = billingDetailsResult.additionalSeats.value;
      const seatsTaxPrice = billingDetailsResult.additionalSeats.taxes ?? 0;
      setAmountToPay(seatsPrice);
      setAmountToTax(seatsTaxPrice);
      setBillingDetails(billingDetailsResult);
      setIsComputingBilling(false);
    } catch (error) {
      const computePlanPricingTaxError = new Error(
        transformUnknownErrorToErrorMessage(error)
      );
      reportTACError(computePlanPricingTaxError);
    }
  };
  const debouncedComputePlanPricing = debounce((seatCount: number) => {
    computePlanPricingTax(seatCount);
  }, 500);
  const onSeatCountChange = (seatCount: number) => {
    debouncedComputePlanPricing(seatCount);
    setIsComputingBilling(true);
  };
  return {
    billingDetails,
    isComputingBilling,
    amountToPay,
    amountToTax,
    onSeatCountChange,
  };
};
