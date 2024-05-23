import { Offer, Prices } from '@dashlane/team-admin-contracts';
interface GetSeatPricesProps {
    offer: Offer;
    currentSeats?: number;
    additionalSeats?: number;
}
export const getSeatPrices = ({ offer, currentSeats = 0, additionalSeats = 0, }: GetSeatPricesProps): Prices => {
    const sortedPriceRanges = [...offer.priceRanges].sort((a, b) => a.startMembers - b.startMembers);
    const totalSeats = currentSeats + additionalSeats;
    const priceRange = sortedPriceRanges.reduce((acc, current) => current.startMembers < totalSeats &&
        current.startMembers > acc.startMembers
        ? current
        : acc, sortedPriceRanges[0]);
    return priceRange;
};
export interface GetMonthlySeatPriceInput {
    additionalSeats?: number;
    currentSeats?: number;
    offer: Offer;
    priceTarget?: keyof Prices;
}
export const getMonthlySeatPrice = ({ offer, currentSeats, additionalSeats, priceTarget = 'price', }: GetMonthlySeatPriceInput): number => {
    const seatPrices = getSeatPrices({ offer, currentSeats, additionalSeats });
    const seatPrice = seatPrices[priceTarget];
    const durationInMonths = offer.duration.includes('y') ? 12 : 1;
    const monthlySeatPrice = seatPrice / durationInMonths;
    return monthlySeatPrice;
};
export interface GetYearlySeatPriceInput {
    additionalSeats?: number;
    currentSeats?: number;
    offer: Offer;
}
export const getYearlySeatPrice = ({ offer, currentSeats, additionalSeats, }: GetYearlySeatPriceInput): number => {
    const seatPrices = getSeatPrices({ offer, currentSeats, additionalSeats });
    const seatPrice = seatPrices.price;
    const yearlySeatPrice = offer.duration.includes('y')
        ? seatPrice
        : seatPrice * 12;
    return yearlySeatPrice;
};
export const isOfferTeamTier = (offer: Offer) => !!offer.name.match(/_team_/u);
export const isOfferBusinessTier = (offer: Offer) => !!offer.name.match(/_business_/u);
export const getStarterSeats = (starterOffer?: Offer) => starterOffer ? starterOffer.priceRanges[1].startMembers - 1 : 0;
