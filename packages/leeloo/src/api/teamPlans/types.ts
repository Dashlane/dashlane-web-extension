export interface ComputePlanPricingResults {
    renewal: {
        seatsCount: number;
        price: {
            value: number;
            currency: 'eur' | 'usd';
        };
    };
    additionalSeats: {
        seatsCount: number;
        price: {
            value: number;
            currency: 'eur' | 'usd';
        };
    };
}
export interface TeamPlansAddSeatsParams {
    seats: number;
}
