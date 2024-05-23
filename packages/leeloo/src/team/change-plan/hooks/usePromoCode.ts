import { useCallback, useEffect, useState } from 'react';
import { B2BOffers, Offer, teamOffersApi, } from '@dashlane/team-admin-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { getSeatPrices, isOfferBusinessTier } from '../utils';
interface UsePromoCodeInput {
    selectedOffer?: Offer;
    currentSeats: number;
    additionalSeats: number;
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
export function usePromoCode({ selectedOffer, currentSeats, additionalSeats, }: UsePromoCodeInput): UsePromoCodeOutput {
    const [promoCode, setPromoCode] = useState<string>('');
    const [currentPromoCode, setCurrentPromoCode] = useState<string>('');
    const [teamOffers, setTeamOffers] = useState<B2BOffers>();
    const [hasError, setHasError] = useState<boolean>(false);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentAdditionalSeats, setCurrentAdditionalSeats] = useState<number>(additionalSeats);
    const [currentOffer, setCurrentOffer] = useState<Offer | undefined>(selectedOffer);
    const { data: teamOffersData, status: teamOfferStatus } = useModuleQuery(teamOffersApi, 'getTeamOffers', { couponCode: currentPromoCode });
    const validatePromoCode = useCallback(() => {
        if (!currentPromoCode) {
            return false;
        }
        if (teamOfferStatus === DataStatus.Error && !teamOffersData) {
            setIsLoading(false);
            setHasError(true);
            setShowInput(true);
            return false;
        }
        else if (teamOfferStatus === DataStatus.Loading && !teamOffersData) {
            setIsLoading(true);
            return false;
        }
        const businessSeatPrices = getSeatPrices({
            offer: teamOffersData.businessOffer,
            currentSeats,
            additionalSeats,
        });
        const businessDiscounted = businessSeatPrices.price !== businessSeatPrices.equivalentPrice;
        const teamSeatPrices = getSeatPrices({
            offer: teamOffersData.teamOffer,
            currentSeats,
            additionalSeats,
        });
        const teamDiscounted = teamSeatPrices.price !== teamSeatPrices.equivalentPrice;
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
        additionalSeats,
        selectedOffer,
    ]);
    useEffect(() => {
        if (additionalSeats !== currentAdditionalSeats) {
            setCurrentAdditionalSeats(additionalSeats);
            validatePromoCode();
        }
    }, [currentAdditionalSeats, additionalSeats, validatePromoCode]);
    useEffect(() => {
        if (selectedOffer?.name !== currentOffer?.name) {
            setCurrentOffer(selectedOffer);
            validatePromoCode();
        }
    }, [selectedOffer, currentOffer, validatePromoCode]);
    const clearPromoCode = () => {
        setPromoCode('');
        setCurrentPromoCode('');
        setTeamOffers(undefined);
        setHasError(false);
    };
    const cancelPromoCode = () => {
        if (hasError) {
            setPromoCode('');
            setCurrentPromoCode('');
        }
        else {
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
