export enum PlanType {
    FREE = 'free',
    BUSINESS = 'business',
    TEAM = 'team'
}
export enum ChangePlanState {
    FORM = 'form',
    SUCCESS = 'success'
}
export interface PricingTileData {
    currentPlan?: boolean;
    recommended?: boolean;
    planName: string;
    price: string | null;
    equivalentPrice?: string | null;
    limitedOffer?: boolean;
    heading: {
        key: string;
        variables?: Record<string, unknown>;
    };
    priceDescription1: {
        key: string;
        variables?: Record<string, unknown>;
    };
    priceDescription2: {
        key: string;
        variables?: Record<string, unknown>;
    };
    features: {
        key: string;
        icon: 'check' | 'add';
        loading?: boolean;
        variables?: Record<string, unknown>;
    }[];
    footer?: {
        key: string;
        variables?: Record<string, unknown>;
    };
}
export interface PricingPlanData {
    starter: PricingTileData;
    team: PricingTileData;
    business: PricingTileData;
}
export interface OrderSummaryDataOutput {
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
}
