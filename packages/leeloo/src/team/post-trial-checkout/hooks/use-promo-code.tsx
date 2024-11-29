import { useCallback, useEffect, useState } from "react";
import { Offer, teamPlanUpdateApi } from "@dashlane/team-admin-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { getSeatPrices, isOfferBusinessTier } from "../../change-plan/utils";
interface UsePromoCodeInput {
  selectedOffer?: Offer;
  selectedSeatsQty: number;
}
export const usePromoCode = ({
  selectedOffer,
  selectedSeatsQty,
}: UsePromoCodeInput) => {
  const [promoCode, setPromoCode] = useState<string>("");
  const [currentPromoCode, setCurrentPromoCode] = useState<string>("");
  const [discountedSeatPrice, setDiscountedSeatPrice] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentSelectedSeatsQty, setCurrentSelectedSeatsQty] =
    useState<number>(selectedSeatsQty);
  const [currentOffer, setCurrentOffer] = useState<Offer | undefined>(
    selectedOffer
  );
  const [planId, setPlanId] = useState<string>("");
  const { data: teamOffersData, status: teamOfferStatus } = useModuleQuery(
    teamPlanUpdateApi,
    "getTeamOffers",
    { couponCode: currentPromoCode }
  );
  const validatePromoCode = useCallback(() => {
    if (!currentPromoCode || !selectedOffer) {
      return false;
    }
    if (teamOfferStatus === DataStatus.Error && !teamOffersData) {
      setIsLoading(false);
      setHasError(true);
      setShowInput(true);
      return false;
    } else if (teamOfferStatus === DataStatus.Loading && !teamOffersData) {
      setIsLoading(true);
      return false;
    }
    const isBusinessOffer = isOfferBusinessTier(selectedOffer);
    const planOffer =
      !isBusinessOffer && teamOffersData.entryLevelOffer
        ? teamOffersData.entryLevelOffer
        : teamOffersData.businessOffer;
    const selectedSeatPrices = getSeatPrices({
      offer: planOffer,
      selectedSeatsQty,
    });
    const selectedOfferDiscounted =
      selectedSeatPrices.price !== selectedSeatPrices.equivalentPrice;
    if (!selectedOfferDiscounted) {
      setIsLoading(false);
      setHasError(true);
      setShowInput(true);
      setDiscountedSeatPrice(0);
      return false;
    }
    setIsLoading(false);
    setPromoCode(currentPromoCode);
    setDiscountedSeatPrice(selectedSeatPrices.price);
    setPlanId(planOffer.name);
    setHasError(false);
    setShowInput(false);
    return true;
  }, [
    currentPromoCode,
    selectedOffer,
    selectedSeatsQty,
    teamOffersData,
    teamOfferStatus,
  ]);
  useEffect(() => {
    if (selectedSeatsQty !== currentSelectedSeatsQty) {
      setCurrentSelectedSeatsQty(selectedSeatsQty);
      validatePromoCode();
    }
  }, [currentSelectedSeatsQty, selectedSeatsQty, validatePromoCode]);
  useEffect(() => {
    if (selectedOffer?.name !== currentOffer?.name) {
      setCurrentOffer(selectedOffer);
      validatePromoCode();
    }
  }, [selectedOffer, currentOffer, validatePromoCode]);
  const clearPromoCode = () => {
    setPromoCode("");
    setCurrentPromoCode("");
    setHasError(false);
    setDiscountedSeatPrice(0);
    setPlanId("");
  };
  const cancelPromoCode = () => {
    if (hasError) {
      setPromoCode("");
      setCurrentPromoCode("");
      setDiscountedSeatPrice(0);
      setPlanId("");
    } else {
      setCurrentPromoCode(promoCode);
    }
    setHasError(false);
    setShowInput(false);
  };
  return {
    cancelPromoCode,
    clearPromoCode,
    currentPromoCode,
    discountedSeatPrice,
    hasError,
    isLoading,
    planId,
    promoCode,
    setCurrentPromoCode,
    setIsLoading,
    setShowInput,
    showInput,
    validatePromoCode,
  };
};
