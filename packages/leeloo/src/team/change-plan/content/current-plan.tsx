import { DataStatus } from '@dashlane/carbon-api-consumers';
import { B2BOffers } from '@dashlane/team-admin-contracts';
import { FlexContainer, jsx, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import { isBusinessTier, isStarterTier, isTeamTier, } from 'libs/account/helpers';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { ChangePlanCard } from 'team/change-plan/layout/change-plan-card';
import { getStarterSeats, getYearlySeatPrice } from 'team/change-plan/utils';
interface CurrentPlanProps {
    currentSeats: number;
    teamOffers?: B2BOffers;
}
export const CurrentPlan = ({ currentSeats, teamOffers }: CurrentPlanProps) => {
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatus();
    const isStarter = premiumStatus.status === DataStatus.Success &&
        isStarterTier(premiumStatus.data);
    const isTeam = premiumStatus.status === DataStatus.Success &&
        isTeamTier(premiumStatus.data);
    const isBusiness = premiumStatus.status === DataStatus.Success &&
        isBusinessTier(premiumStatus.data);
    const currency = teamOffers?.businessOffer?.currency;
    const businessSeatPrice = teamOffers?.businessOffer
        ? getYearlySeatPrice({
            offer: teamOffers.businessOffer,
        })
        : null;
    const teamSeatPrice = teamOffers?.teamOffer
        ? getYearlySeatPrice({
            offer: teamOffers.teamOffer,
        })
        : null;
    const starterSeatPrice = teamOffers?.starterOffer
        ? getYearlySeatPrice({
            offer: teamOffers.starterOffer,
        })
        : null;
    const starterSeats = getStarterSeats(teamOffers?.starterOffer);
    const currentYearlyPrice = isStarter && starterSeatPrice && currency
        ? translate.price(currency, (starterSeatPrice * starterSeats) / 100, {
            notation: 'compact',
        })
        : isTeam && teamSeatPrice && currency
            ? translate.price(currency, (teamSeatPrice * currentSeats) / 100, {
                notation: 'compact',
            })
            : isBusiness && businessSeatPrice && currency
                ? translate.price(currency, (businessSeatPrice * currentSeats) / 100, {
                    notation: 'compact',
                })
                : null;
    return (<ChangePlanCard title={translate('team_account_teamplan_changeplan_current_plan_header')}>
      <FlexContainer flexDirection="column" gap="16px" sx={{ marginTop: '16px' }}>
        <div sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 10px',
            justifyContent: 'space-between',
            backgroundColor: 'ds.container.agnostic.neutral.quiet',
        }}>
          <Paragraph bold color={'ds.text.neutral.standard'}>
            {isStarter ? (translate('team_account_teamplan_changeplan_current_plan_starter')) : isTeam ? (translate('manage_subscription_plan_name_dashlane_team')) : isBusiness ? (translate('manage_subscription_plan_name_dashlane_business')) : (<LoadingIcon size={30} color={'ds.text.neutral.standard'}/>)}
          </Paragraph>
          <Paragraph color={'ds.text.neutral.standard'}>
            {currentYearlyPrice
            ? translate('team_account_teamplan_changeplan_current_plan_per_year', {
                cost: currentYearlyPrice,
            })
            : null}
          </Paragraph>
        </div>
      </FlexContainer>
    </ChangePlanCard>);
};
