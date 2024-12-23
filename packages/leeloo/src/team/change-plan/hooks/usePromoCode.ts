import { useCallback, useEffect, useState } from "react";
import {
  B2BOffers,
  Offer,
  teamPlanUpdateApi,
} from "@dashlane/team-admin-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { getSeatPrices, isOfferBusinessTier } from "../utils";
interface UsePromoCodeInput {
  selectedOffer?: Offer;
  currentSeats: number;
  selectedSeatsQty: number;
}
interface UsePromoCodeOutput {
  currentPromoCode: string;
  promoCode: string;
  showInput: boolean;
  setShowInput: (targetState: boolean) => void;
  isLoading: boolean;
  setIsLoading: (targetState: boolean) => void;
  setCurrentPromoCode: (promoCode: string) => void;
  clearPromoCode: () => void;
  cancelPromoCode: () => void;
  validatePromoCode: () => boolean;
  hasError: boolean;
  teamOffers: B2BOffers | undefined;
}
export function usePromoCode({
  selectedOffer,
  currentSeats,
  selectedSeatsQty,
}: UsePromoCodeInput): UsePromoCodeOutput {
  const [promoCode, setPromoCode] = useState<string>("");
  const [currentPromoCode, setCurrentPromoCode] = useState<string>("");
  const [teamOffers, setTeamOffers] = useState<B2BOffers>();
  const [hasError, setHasError] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentSelectedSeatsQty, setCurrentSelectedSeatsQty] =
    useState<number>(selectedSeatsQty);
  const [currentOffer, setCurrentOffer] = useState<Offer | undefined>(
    selectedOffer
  );
  const { data: teamOffersData, status: teamOfferStatus } = useModuleQuery(
    teamPlanUpdateApi,
    "getTeamOffers",
    { couponCode: currentPromoCode }
  );
  const validatePromoCode = useCallback(() => {
    if (!currentPromoCode) {
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
    const businessSeatPrices = getSeatPrices({
      offer: teamOffersData.businessOffer,
      selectedSeatsQty,
    });
    const businessDiscounted =
      businessSeatPrices.price !== businessSeatPrices.equivalentPrice;
    const teamSeatPrices = getSeatPrices({
      offer: teamOffersData.teamOffer,
      selectedSeatsQty,
    });
    const teamDiscounted =
      teamSeatPrices.price !== teamSeatPrices.equivalentPrice;
    const selectedOfferIsBusiness = selectedOffer
      ? isOfferBusinessTier(selectedOffer)
      : false;
    const selectedOfferDiscounted = selectedOfferIsBusiness
      ? businessDiscounted
      : teamDiscounted;
    if (!selectedOfferDiscounted) {
      setIsLoading(false);
      setHasError(true);
      setShowInput(true);
      return false;
    }
    setIsLoading(false);
    setPromoCode(currentPromoCode);
    setTeamOffers(() => teamOffersData);
    setHasError(false);
    setShowInput(false);
    return true;
  }, [
    currentPromoCode,
    teamOfferStatus,
    teamOffersData,
    currentSeats,
    selectedSeatsQty,
    selectedOffer,
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
    setTeamOffers(undefined);
    setHasError(false);
  };
  const cancelPromoCode = () => {
    if (hasError) {
      setPromoCode("");
      setCurrentPromoCode("");
    } else {
      setCurrentPromoCode(promoCode);
    }
    setHasError(false);
    setShowInput(false);
  };
  return {
    promoCode,
    currentPromoCode,
    setCurrentPromoCode,
    validatePromoCode,
    clearPromoCode,
    cancelPromoCode,
    showInput,
    setShowInput,
    hasError,
    teamOffers,
    isLoading,
    setIsLoading,
  };
}
