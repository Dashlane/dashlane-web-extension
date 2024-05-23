import { PriceRange } from 'libs/api/types';
export interface CostDetailsForTier {
    costPerSeat: number;
    numberOfSeats: number;
}
interface AdditionalSeatsCostDetailsAccumulator {
    membersRangeEnd: number;
    costDetails: CostDetailsForTier[];
}
const byStartMembersDescending = (priceRange1: PriceRange, priceRange2: PriceRange) => priceRange2.startMembers - priceRange1.startMembers;
const buildAdditionalSeatsCostBreakdown = (currentNumberOfLicences: number, newNumberOfLicences: number) => {
    return ({ membersRangeEnd, costDetails }: AdditionalSeatsCostDetailsAccumulator, priceRange: PriceRange) => {
        const membersRangeBegin = priceRange.startMembers;
        const crossesAdditionalSeatsRange = membersRangeBegin <= newNumberOfLicences &&
            membersRangeEnd > currentNumberOfLicences &&
            newNumberOfLicences > currentNumberOfLicences;
        if (crossesAdditionalSeatsRange) {
            const quantityBegin = Math.max(Math.max(membersRangeBegin - 1, currentNumberOfLicences), 0);
            const quantityEnd = Math.min(newNumberOfLicences, membersRangeEnd - 1);
            costDetails.unshift({
                costPerSeat: priceRange.price / 100,
                numberOfSeats: quantityEnd - quantityBegin,
            });
        }
        return { membersRangeEnd: membersRangeBegin, costDetails };
    };
};
export const getAdditionalSeatsCostDetails = (currentNumberOfLicences: number, newNumberOfLicences: number, priceRanges?: PriceRange[]): CostDetailsForTier[] => {
    if (!priceRanges) {
        return [];
    }
    const priceRangesSorted = priceRanges.slice(0).sort(byStartMembersDescending);
    const basePriceRange = priceRangesSorted[priceRangesSorted.length - 1];
    if (basePriceRange.startMembers !== 0) {
        throw new Error('getAdditionalSeatsCostDetails:: missing tier one in price ranges');
    }
    if (currentNumberOfLicences < 0 || newNumberOfLicences < 0) {
        throw new Error('getAdditionalSeatsCostDetails:: number of licences cannot be negative');
    }
    return priceRangesSorted.reduce(buildAdditionalSeatsCostBreakdown(currentNumberOfLicences, newNumberOfLicences), {
        membersRangeEnd: Number.MAX_VALUE,
        costDetails: [],
    }).costDetails;
};
