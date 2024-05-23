import React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { B2BOffers, Offer } from '@dashlane/team-admin-contracts';
import { FlexContainer, LoadingIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { PricingTile } from '../components/pricing-tile';
import { ChangePlanCard } from '../layout/change-plan-card';
import { getMonthlySeatPrice, getStarterSeats } from '../utils';
import { PricingPlanData } from '../types';
import { BusinessCard } from './business-card';
import { TeamCard } from './team-card';
import { LimitedBusinessOfferData, useLimitedBusinessOfferData, } from 'team/limited-business-offer/use-limited-business-offer-data';
export const usePlansData = (teamOffers: B2BOffers | undefined, limitedBusinessOffer: LimitedBusinessOfferData): PricingPlanData => {
    const { translate } = useTranslate();
    const currency = teamOffers?.businessOffer?.currency;
    const businessSeatPrice = teamOffers?.businessOffer
        ? getMonthlySeatPrice({
            offer: teamOffers.businessOffer,
        })
        : null;
    const teamSeatPrice = teamOffers?.teamOffer
        ? getMonthlySeatPrice({
            offer: teamOffers.teamOffer,
        })
        : null;
    const starterSeatPrice = teamOffers?.starterOffer
        ? getMonthlySeatPrice({
            offer: teamOffers.starterOffer,
        })
        : null;
    const starterSeats = getStarterSeats(teamOffers?.starterOffer);
    const monthlyStarterPrice = teamOffers?.starterOffer && starterSeatPrice
        ? starterSeats * starterSeatPrice
        : 0;
    return {
        starter: {
            currentPlan: true,
            planName: 'starter',
            price: starterSeatPrice && currency
                ? translate.price(currency, starterSeatPrice / 100, {
                    notation: 'compact',
                })
                : null,
            heading: { key: 'team_account_teamplan_changeplan_plans_starter_name' },
            priceDescription1: {
                key: 'team_account_teamplan_changeplan_plans_per_seat_month',
            },
            priceDescription2: {
                key: 'team_account_teamplan_changeplan_plans_billed_monthly_at',
                variables: {
                    numberSeats: starterSeats,
                    monthlyPrice: starterSeatPrice && currency
                        ? translate.price(currency, monthlyStarterPrice / 100, {
                            notation: 'compact',
                        })
                        : null,
                },
            },
            features: [
                {
                    key: 'team_account_teamplan_changeplan_plans_seats_flat_rate_markup',
                    icon: 'check',
                    loading: !starterSeatPrice,
                    variables: {
                        numberSeats: starterSeats,
                        monthlyPrice: starterSeatPrice && currency
                            ? translate.price(currency, monthlyStarterPrice / 100, {
                                notation: 'compact',
                            })
                            : null,
                    },
                },
                {
                    icon: 'check',
                    key: 'team_account_teamplan_changeplan_plans_unlimited_passwords',
                },
                {
                    icon: 'check',
                    key: 'team_account_teamplan_changeplan_plans_secure_sharing',
                },
                {
                    icon: 'check',
                    key: 'team_account_teamplan_changeplan_plans_business_and_personal_spaces',
                },
                {
                    icon: 'check',
                    key: 'team_account_teamplan_changeplan_plans_audit_logs',
                },
                {
                    icon: 'check',
                    key: 'team_account_teamplan_changeplan_plans_dark_web_insights',
                },
            ],
            footer: {
                key: 'team_account_teamplan_changeplan_plans_starter_footer_markup',
            },
        },
        team: {
            recommended: !limitedBusinessOffer.hasLimitedOffer,
            planName: 'team',
            price: teamSeatPrice && currency
                ? translate.price(currency, teamSeatPrice / 100, {
                    notation: 'compact',
                })
                : null,
            heading: { key: 'team_account_teamplan_changeplan_plans_name_V2' },
            priceDescription1: {
                key: 'team_account_teamplan_changeplan_plans_per_seat_month',
            },
            priceDescription2: {
                key: 'team_account_teamplan_changeplan_plans_billed_anually',
            },
            features: [
                {
                    key: 'team_account_teamplan_changeplan_plans_everything_in_starter_markup',
                    icon: 'check',
                },
                {
                    key: 'team_account_teamplan_changeplan_plans_unlimited_seats',
                    icon: 'add',
                },
                {
                    key: 'team_account_teamplan_changeplan_plans_vpn_for_wifi_protection',
                    icon: 'add',
                },
            ],
        },
        business: {
            planName: 'business',
            price: businessSeatPrice && currency
                ? translate.price(currency, businessSeatPrice / 100, {
                    notation: 'compact',
                })
                : null,
            equivalentPrice: limitedBusinessOffer.hasLimitedOffer && businessSeatPrice && currency
                ? limitedBusinessOffer.translatedEquivalentPrice
                : null,
            limitedOffer: limitedBusinessOffer.hasLimitedOffer,
            heading: {
                key: 'team_account_teamplan_changeplan_plans_business_name_V2',
            },
            priceDescription1: {
                key: 'team_account_teamplan_changeplan_plans_per_seat_month',
            },
            priceDescription2: {
                key: 'team_account_teamplan_changeplan_plans_billed_anually',
            },
            features: [
                {
                    key: 'team_account_teamplan_changeplan_plans_everything_in_team_markup',
                    icon: 'check',
                },
                {
                    icon: 'add',
                    key: 'team_account_teamplan_changeplan_plans_sso_integration',
                },
                {
                    icon: 'add',
                    key: 'team_account_teamplan_changeplan_plans_scim_provisioning',
                },
                {
                    icon: 'add',
                    key: 'team_account_teamplan_changeplan_plans_free_friends_family_plan',
                },
                {
                    icon: 'add',
                    key: 'team_account_teamplan_changeplan_plans_phone_support',
                },
            ],
        },
    };
};
interface PlansProps {
    selectedOffer?: Offer;
    handleSelection: (selectedOffer: Offer) => void;
    teamOffers?: B2BOffers;
}
export const Plans = ({ selectedOffer, handleSelection, teamOffers, }: PlansProps) => {
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatus();
    const limitedBusinessOffer = useLimitedBusinessOfferData();
    const data = usePlansData(teamOffers, limitedBusinessOffer);
    const loading = premiumStatus.status !== DataStatus.Success || !premiumStatus.data;
    const showStarter = premiumStatus.status === DataStatus.Success &&
        premiumStatus.data.planName === '2022_team_starter_tier';
    const { businessOffer, teamOffer } = teamOffers ?? {};
    return (<ChangePlanCard title={translate('team_account_teamplan_changeplan_plans')}>
      {loading ? (<FlexContainer alignItems="center" justifyContent="center">
          <LoadingIcon size={30} color="black"/>
        </FlexContainer>) : showStarter ? (<FlexContainer sx={{
                height: '100%',
                display: 'flex',
                gap: '16px',
                paddingTop: '8px',
            }}>
          <PricingTile plan={data.starter}/>
          <PricingTile plan={data.team} handleSelectClick={teamOffer ? () => handleSelection(teamOffer) : undefined} selected={teamOffer ? selectedOffer?.name === teamOffer?.name : false}/>
          <PricingTile plan={data.business} handleSelectClick={businessOffer ? () => handleSelection(businessOffer) : undefined} selected={businessOffer
                ? selectedOffer?.name === businessOffer?.name
                : false}/>
        </FlexContainer>) : (<FlexContainer alignItems="center" flexWrap="unset">
          <TeamCard />
          <BusinessCard businessOffer={businessOffer} selected={businessOffer
                ? selectedOffer?.name === businessOffer?.name
                : false} handleSelectClick={businessOffer ? () => handleSelection(businessOffer) : undefined}/>
        </FlexContainer>)}
    </ChangePlanCard>);
};
