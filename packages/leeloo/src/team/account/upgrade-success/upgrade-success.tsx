import { useContext, useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { BackIcon, Button, FlexContainer, Paragraph, } from '@dashlane/ui-components';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { NavBarContext } from 'team/page/nav-layout/nav-layout';
import { BillingDetails } from '../upgrade';
import { useBillingSeatDetails } from '../upgrade/add-seats/useBillingSeatDetails';
import { CostDetailsForTier } from '../upgrade/add-seats/teamPlanCalculator';
import { OrderSummary } from './components/order-summary';
import { NewSeatsInfo } from './components/new-seats-info';
import { CreditCardSummary } from './components/credit-card-summary';
import { FriendsAndFamilyInfo } from './components/friends-and-family-info';
export interface UpgradeSuccessProps {
    planTier: SpaceTier;
    onNavigateBack: () => void;
    onGetPastReceipts: () => void;
    lastBillingDetails: BillingDetails;
    lastAdditionalSeatsDetails: CostDetailsForTier[];
}
export const UpgradeSuccess = ({ planTier, lastBillingDetails, lastAdditionalSeatsDetails, onGetPastReceipts, onNavigateBack, }: UpgradeSuccessProps) => {
    const { translate } = useTranslate();
    const [additionalSeatsDetails, setAdditionalSeatsDetails] = useState(lastAdditionalSeatsDetails);
    const [billingDetails, setBillingDetails] = useState(lastBillingDetails);
    const { additionalSeatsCount } = useBillingSeatDetails({
        billingDetails,
        additionalSeatsDetails,
    });
    const backButton = (<div>
      <Button type="button" nature="ghost" onClick={onNavigateBack}>
        <FlexContainer alignItems="center">
          <BackIcon size={14}/>
          <Paragraph bold sx={{ marginLeft: '14px', color: 'ds.text.neutral.standard' }}>
            {translate('team_account_teamplan_changeplan_back')}
          </Paragraph>
        </FlexContainer>
      </Button>
    </div>);
    const isBusiness = planTier === SpaceTier.Business;
    const { setNavBarChildren } = useContext(NavBarContext);
    useEffect(() => {
        setNavBarChildren(backButton);
        return () => {
            setNavBarChildren(null);
            onNavigateBack();
        };
    }, []);
    useEffect(() => {
        setBillingDetails(lastBillingDetails);
        setAdditionalSeatsDetails(lastAdditionalSeatsDetails);
    }, [lastBillingDetails, lastAdditionalSeatsDetails]);
    return (<FlexContainer flexDirection="column" gap="32px" sx={{ padding: '32px', flexWrap: 'nowrap' }}>
      <FlexContainer gap="16px" sx={{ flexWrap: 'nowrap' }}>
        <FlexContainer flexDirection="column" gap="16px" sx={{ flexGrow: '2', maxWidth: '632px' }}>
          <NewSeatsInfo onGetPastReceipts={onGetPastReceipts} isBusiness={isBusiness} additionalSeats={additionalSeatsCount}/>
          {isBusiness ? <FriendsAndFamilyInfo /> : null}
        </FlexContainer>
        <FlexContainer flexDirection="column" gap="16px" sx={{ flexGrow: '1' }}>
          <OrderSummary billingDetails={billingDetails} additionalSeatsDetails={additionalSeatsDetails}/>
          <CreditCardSummary />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>);
};
