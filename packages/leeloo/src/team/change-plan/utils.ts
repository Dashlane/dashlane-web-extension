import { Offer, Prices } from "@dashlane/team-admin-contracts";
interface GetSeatPricesProps {
  offer: Offer;
  selectedSeatsQty?: number;
}
interface GetSeatPricesLegacyProps {
  offer: Offer;
  currentSeats: number;
  additionalSeats: number;
}
export const getSeatPrices = ({
  offer,
  selectedSeatsQty = 0,
}: GetSeatPricesProps): Prices => {
  const sortedPriceRanges = [...offer.priceRanges].sort(
    (a, b) => a.startMembers - b.startMembers
  );
  const priceRange = sortedPriceRanges.reduce(
    (acc, current) =>
      current.startMembers < selectedSeatsQty &&
      current.startMembers > acc.startMembers
        ? current
        : acc,
    sortedPriceRanges[0]
  );
  return priceRange;
};
export const getSeatPricesLegacy = ({
  offer,
  currentSeats = 0,
  additionalSeats = 0,
}: GetSeatPricesLegacyProps): Prices => {
  const sortedPriceRanges = [...offer.priceRanges].sort(
    (a, b) => a.startMembers - b.startMembers
  );
  const totalSeats = currentSeats + additionalSeats;
  const priceRange = sortedPriceRanges.reduce(
    (acc, current) =>
      current.startMembers < totalSeats &&
      current.startMembers > acc.startMembers
        ? current
        : acc,
    sortedPriceRanges[0]
  );
  return priceRange;
};
export interface GetMonthlySeatPriceInput {
  selectedSeatsQty?: number;
  offer: Offer;
  priceTarget?: keyof Prices;
}
export const getMonthlySeatPrice = ({
  offer,
  selectedSeatsQty,
  priceTarget = "price",
}: GetMonthlySeatPriceInput): number => {
  const seatPrices = getSeatPrices({ offer, selectedSeatsQty });
  const seatPrice = seatPrices[priceTarget];
  const durationInMonths = offer.duration.includes("y") ? 12 : 1;
  const monthlySeatPrice = seatPrice / durationInMonths;
  return monthlySeatPrice;
};
export interface GetYearlySeatPriceInput {
  selectedSeatsQty?: number;
  offer: Offer;
}
export const getYearlySeatPrice = ({
  offer,
  selectedSeatsQty,
}: GetYearlySeatPriceInput): number => {
  const seatPrices = getSeatPrices({ offer, selectedSeatsQty });
  const seatPrice = seatPrices.price;
  const yearlySeatPrice = offer.duration.includes("y")
    ? seatPrice
    : seatPrice * 12;
  return yearlySeatPrice;
};
export interface GetMonthlyPriceInput {
  selectedSeatsQty: number;
  offer: Offer;
}
export const getMonthlyPrice = ({
  offer,
  selectedSeatsQty,
}: GetMonthlyPriceInput): number => {
  const seatPrices = getSeatPrices({ offer, selectedSeatsQty });
  const seatPrice = seatPrices.price;
  const monthlyPrice = (seatPrice * selectedSeatsQty) / 12;
  return monthlyPrice;
};
export interface GetYearlyPriceInput {
  selectedSeatsQty: number;
  offer: Offer;
}
export const getYearlyPrice = ({
  offer,
  selectedSeatsQty,
}: GetMonthlyPriceInput): number => {
  const seatPrices = getSeatPrices({ offer, selectedSeatsQty });
  const seatPrice = seatPrices.price;
  const yearlyPrice = seatPrice * selectedSeatsQty;
  return yearlyPrice;
};
export const isOfferTeamTier = (offer: Offer) => !!offer.name.match(/_team_/u);
export const isOfferBusinessTier = (offer: Offer) =>
  !!offer.name.match(/_business_/u);
export const getStarterSeats = (starterOffer?: Offer) =>
  starterOffer ? starterOffer.priceRanges[1].startMembers - 1 : 0;
