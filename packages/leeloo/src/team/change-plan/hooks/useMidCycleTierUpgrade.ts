import { useState } from 'react';
import { addYears, fromUnixTime } from 'date-fns';
import { B2BOffers, Offer } from '@dashlane/team-admin-contracts';
import { carbonConnector } from 'libs/carbon/connector';
import { getSeatPrices, isOfferBusinessTier, isOfferTeamTier, } from 'team/change-plan/utils';
import { useMidCycleTierUpgradePrice } from './useMidCycleTierUpgradePrice';
import { useExpectedTaxInformation } from './useExpectedTaxInformation';
interface UseMidCycleTierUpgradeProps {
    selectedOffer?: Offer;
    discountedTeamOffers?: B2BOffers;
    currentSeats: number;
    additionalSeats: number;
    promoCode?: string;
    email: string;
    onSuccess: () => void;
    onError: () => void;
}
export interface UseMidCycleTierUpgradeOutput {
    isSaving: boolean;
    isProratedDiscountLoading: boolean;
    isTaxLoading: boolean;
    costData: {
        seatPrice: number;
        totalSeats: number;
        additionalSeats: number;
        currentSeats: number;
        upgradedSeatsPrice: number;
        additionalSeatsPrice: number;
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
export function useMidCycleTierUpgrade({ selectedOffer, currentSeats, additionalSeats, discountedTeamOffers, promoCode, email, onSuccess, onError, }: UseMidCycleTierUpgradeProps): UseMidCycleTierUpgradeOutput {
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const isPriceDiscountedByCoupon = !!promoCode;
    const selectedOfferIsBusiness = selectedOffer
        ? isOfferBusinessTier(selectedOffer)
        : false;
    const selectedOfferIsTeam = selectedOffer
        ? isOfferTeamTier(selectedOffer)
        : false;
    const targetOffer = discountedTeamOffers && selectedOffer
        ? selectedOfferIsBusiness
            ? discountedTeamOffers.businessOffer
            : selectedOfferIsTeam
                ? discountedTeamOffers.teamOffer
                : discountedTeamOffers.starterOffer
        : selectedOffer;
    const { isLoading: isMidTierCycleTierUpgradePriceLoading, midCycleTierUpgradePrice, } = useMidCycleTierUpgradePrice({
        seats: additionalSeats,
        planName: targetOffer?.name,
    });
    const seatPrices = targetOffer
        ? getSeatPrices({
            offer: targetOffer,
            currentSeats,
            additionalSeats,
        })
        : null;
    const seatPrice = seatPrices?.equivalentPrice ?? 0;
    const discountedSeatPrice = seatPrices?.price ?? 0;
    const pricePerSeatDisplay = isPriceDiscountedByCoupon
        ? seatPrice
        : discountedSeatPrice;
    const totalSeats = currentSeats + additionalSeats;
    const additionalSeatsPrice = additionalSeats * pricePerSeatDisplay;
    const upgradedSeatsPrice = currentSeats * pricePerSeatDisplay;
    const subtotal = totalSeats * pricePerSeatDisplay;
    const discountedSubtotal = discountedSeatPrice
        ? totalSeats * discountedSeatPrice
        : subtotal;
    const promoPrice = subtotal - discountedSubtotal;
    const pretaxTotal = midCycleTierUpgradePrice?.discountAmount
        ? subtotal + midCycleTierUpgradePrice?.discountAmount
        : undefined;
    const amountToTax = pretaxTotal ? pretaxTotal - promoPrice : pretaxTotal;
    const renewalDate = midCycleTierUpgradePrice?.nextBillingDateUnix
        ? fromUnixTime(midCycleTierUpgradePrice?.nextBillingDateUnix)
        : addYears(new Date(), 1);
    const { isLoading: isExpectedTaxInformationLoading, expectedTaxInformation } = useExpectedTaxInformation({ total: amountToTax });
    const taxAmount = !isExpectedTaxInformationLoading &&
        expectedTaxInformation?.expectedTaxesInCents !== undefined
        ? expectedTaxInformation.expectedTaxesInCents
        : 0;
    const total = !isExpectedTaxInformationLoading &&
        expectedTaxInformation?.expectedTaxesInCents !== undefined &&
        amountToTax !== undefined
        ? amountToTax + taxAmount
        : undefined;
    const changeTierMidCycle = async (validatedPromoCode: string) => {
        if (!(amountToTax && expectedTaxInformation && targetOffer)) {
            onError();
            return;
        }
        setIsSaving(() => true);
        const response = await carbonConnector.changeTierMidCycle({
            amountToPay: amountToTax,
            taxes: taxAmount,
            planId: targetOffer.name,
            couponCode: validatedPromoCode ? validatedPromoCode : promoCode,
            seatsToAdd: additionalSeats,
            billingContactEmail: email !== '' ? email : undefined,
        });
        setIsSaving(() => false);
        if (!response.success) {
            onError();
            return;
        }
        onSuccess();
    };
    return {
        isSaving,
        changeTierMidCycle,
        isProratedDiscountLoading: isMidTierCycleTierUpgradePriceLoading,
        isTaxLoading: isExpectedTaxInformationLoading,
        costData: {
            seatPrice: pricePerSeatDisplay,
            additionalSeats,
            currentSeats,
            totalSeats,
            upgradedSeatsPrice,
            additionalSeatsPrice,
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
