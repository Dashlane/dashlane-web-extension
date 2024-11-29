import { useState } from "react";
import { addYears, fromUnixTime } from "date-fns";
import {
  B2BOffers,
  Offer,
  teamPlanUpdateApi,
} from "@dashlane/team-admin-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import { getSeatPrices, isOfferBusinessTier, isOfferTeamTier } from "../utils";
import { useMidCycleTierUpgradePrice } from "./useMidCycleTierUpgradePrice";
import { useTaxInformation } from "./use-tax-information";
import useTranslate from "../../../libs/i18n/useTranslate";
interface UseMidCycleTierUpgradeProps {
  selectedOffer?: Offer;
  discountedTeamOffers?: B2BOffers;
  currentSeats: number;
  currentActiveSeats: number;
  selectedSeatsQty: number;
  promoCode?: string;
  email: string;
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
}
interface MidCycleTierUpgradeResponse {
  tag: string;
  error?: {
    tag: string;
  };
}
export interface UseMidCycleTierUpgradeOutput {
  isSaving: boolean;
  isProratedDiscountLoading: boolean;
  isMidCycleGracePeriod: boolean;
  isTaxLoading: boolean;
  costData: {
    seatPrice: number;
    currentSeats: number;
    currentActiveSeats: number;
    totalSeats: number;
    addedSeats: number;
    removedSeats: number;
    upgradedSeatsPrice: number;
    addedSeatsPrice: number;
    subtotal: number;
    proratedDiscount: number | undefined;
    tax: number | undefined;
    pretaxTotal: number | undefined;
    promoPrice: number | undefined;
    total: number | undefined;
    renewalPrice: number;
    renewalDate: Date;
  };
  changeTierMidCycle: (validatedPromoCode?: string) => void;
}
export function useMidCycleTierUpgrade({
  selectedOffer,
  currentSeats,
  currentActiveSeats,
  selectedSeatsQty,
  discountedTeamOffers,
  promoCode,
  email,
  onSuccess,
  onError,
}: UseMidCycleTierUpgradeProps): UseMidCycleTierUpgradeOutput {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { translate } = useTranslate();
  const { changeTierMidcycle } = useModuleCommands(teamPlanUpdateApi);
  const isPriceDiscountedByCoupon = !!promoCode;
  const selectedOfferIsBusiness = selectedOffer
    ? isOfferBusinessTier(selectedOffer)
    : false;
  const selectedOfferIsTeam = selectedOffer
    ? isOfferTeamTier(selectedOffer)
    : false;
  const targetOffer =
    discountedTeamOffers && selectedOffer
      ? selectedOfferIsBusiness
        ? discountedTeamOffers.businessOffer
        : selectedOfferIsTeam
        ? discountedTeamOffers.teamOffer
        : discountedTeamOffers.starterOffer
      : selectedOffer;
  const {
    isLoading: isMidTierCycleTierUpgradePriceLoading,
    midCycleTierUpgradePrice,
    isMidCycleGracePeriod,
  } = useMidCycleTierUpgradePrice({
    newTotalNumberOfSeats: selectedSeatsQty,
    planName: targetOffer?.name,
  });
  const seatPrices = targetOffer
    ? getSeatPrices({
        offer: targetOffer,
        selectedSeatsQty,
      })
    : null;
  const seatPrice = seatPrices?.equivalentPrice ?? 0;
  const discountedSeatPrice = seatPrices?.price ?? 0;
  const pricePerSeatDisplay = isPriceDiscountedByCoupon
    ? seatPrice
    : discountedSeatPrice;
  const addedSeats = selectedSeatsQty - currentSeats;
  const addedSeatsPrice = addedSeats * pricePerSeatDisplay;
  const upgradedSeatsPrice =
    Math.min(currentSeats, selectedSeatsQty) * pricePerSeatDisplay;
  const subtotal = selectedSeatsQty * pricePerSeatDisplay;
  const discountedSubtotal =
    discountedSeatPrice !== undefined
      ? selectedSeatsQty * discountedSeatPrice
      : subtotal;
  const promoPrice = subtotal - discountedSubtotal;
  const pretaxTotal =
    midCycleTierUpgradePrice?.discountAmount !== undefined
      ? subtotal + midCycleTierUpgradePrice.discountAmount
      : undefined;
  const amountToTax = pretaxTotal ? pretaxTotal - promoPrice : pretaxTotal;
  const renewalDate = midCycleTierUpgradePrice?.nextBillingDateUnix
    ? fromUnixTime(midCycleTierUpgradePrice.nextBillingDateUnix)
    : addYears(new Date(), 1);
  const { isLoading: isTaxInformationLoading, taxInformation } =
    useTaxInformation({ total: amountToTax ?? 0 });
  const taxAmount =
    !isTaxInformationLoading && taxInformation?.amount !== undefined
      ? taxInformation.amount
      : 0;
  const total =
    !isTaxInformationLoading &&
    taxInformation?.amount !== undefined &&
    amountToTax !== undefined
      ? amountToTax + taxAmount
      : undefined;
  const errorGeneric = "team_account_teamplan_changeplan_error_generic";
  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "PaymentMeanIsNotCreditCard":
        return "The team does not have a credit card payment mean";
      case "CurrentPlanStartDateInFuture":
        return "The current plan start date must be in the past";
      case "ChangeTierMidCycleError":
        return "Team is ineligible to change tier mid cycle";
      case "PaymentMeanIsNotInvoice":
        return "Team Payment mean is not invoice";
      case "ChangeTierAmountTooExpensive":
        return "The amount to pay entered is more than 10 times the recommended price";
      case "ErrorCalculatingTierChange":
        return "Unable to calculate prorated discount for mid cycle tier change";
      case "InsufficientAmount":
        return "Credit Card payment must be zero or more than 50 cents";
      case "AssignedPlanSameTierAsCurrentPlan":
        return "The assigned plan tier cannot be the same as the team's current plan";
      case "SalesTaxMismatch":
        return "Tax amount sent does not correspond to the supposed taxed amount";
      case "NotBillingAdmin":
        return "User is not a billing admin";
      default:
        return translate(errorGeneric);
    }
  };
  const changeTierMidCycle = async (validatedPromoCode: string) => {
    if (!(amountToTax !== undefined && taxInformation && targetOffer)) {
      onError(
        "Error with retrieving midCycleTierUpgradePrice, tax information or target offer"
      );
      return;
    }
    setIsSaving(() => true);
    const response: MidCycleTierUpgradeResponse = await changeTierMidcycle({
      amountToPay: amountToTax,
      taxes: taxAmount,
      planId: targetOffer.name,
      couponCode: validatedPromoCode ? validatedPromoCode : promoCode,
      newTotalNumberOfSeats: selectedSeatsQty,
      billingContactEmail: email !== "" ? email : undefined,
    });
    setIsSaving(() => false);
    if (response.error) {
      const errorMessage = getErrorMessage(response.error.tag);
      onError(errorMessage);
      return;
    }
    onSuccess();
  };
  return {
    isSaving,
    changeTierMidCycle,
    isMidCycleGracePeriod: isMidCycleGracePeriod ?? false,
    isProratedDiscountLoading: isMidTierCycleTierUpgradePriceLoading,
    isTaxLoading: isTaxInformationLoading,
    costData: {
      seatPrice: pricePerSeatDisplay,
      currentSeats,
      currentActiveSeats,
      totalSeats: selectedSeatsQty,
      addedSeats:
        selectedSeatsQty >= currentSeats ? selectedSeatsQty - currentSeats : 0,
      removedSeats:
        selectedSeatsQty <= currentSeats ? currentSeats - selectedSeatsQty : 0,
      upgradedSeatsPrice,
      addedSeatsPrice,
      subtotal,
      proratedDiscount: midCycleTierUpgradePrice?.discountAmount,
      tax: taxAmount,
      pretaxTotal,
      promoPrice,
      total,
      renewalPrice: subtotal,
      renewalDate,
    },
  };
}
