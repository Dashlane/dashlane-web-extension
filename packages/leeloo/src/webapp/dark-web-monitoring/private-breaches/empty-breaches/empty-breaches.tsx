import * as React from 'react';
import { FlexContainer } from '@dashlane/ui-components';
import { Button, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { DataLeaksEmail } from '@dashlane/password-security-contracts';
import { openDashlaneUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    TEXT_NO_EMAIL: 'webapp_darkweb_leaks_empty_leaks_no_email',
    TEXT_NO_LEAK: 'webapp_darkweb_leaks_empty_leaks_no_leak',
    TEXT_GO_PREMIUM: 'webapp_darkweb_leaks_empty_leaks_go_premium_text',
    BUTTON_ADD_EMAIL: 'webapp_darkweb_leaks_empty_leaks_add_email',
    BUTTON_GO_PREMIUM: 'webapp_darkweb_leaks_empty_leaks_go_premium_button',
};
export interface EmptyBreachesProps {
    hasDataLeakCapability: boolean;
    emails: null | DataLeaksEmail[];
    availableEmailSpots: number;
    onOpenAddDialog: () => void;
    premiumUrl: string;
}
export const EmptyBreaches = ({ emails, availableEmailSpots, hasDataLeakCapability, onOpenAddDialog, premiumUrl, }: EmptyBreachesProps) => {
    const { translate } = useTranslate();
    const getTextKey = React.useCallback(() => {
        if (!hasDataLeakCapability) {
            return I18N_KEYS.TEXT_GO_PREMIUM;
        }
        return emails?.length === 0
            ? I18N_KEYS.TEXT_NO_EMAIL
            : I18N_KEYS.TEXT_NO_LEAK;
    }, [emails, hasDataLeakCapability]);
    if (!emails) {
        return null;
    }
    const showAddEmailButton = hasDataLeakCapability && emails?.length === 0;
    const showGoPremiumButton = !hasDataLeakCapability;
    const canAddEmail = hasDataLeakCapability && availableEmailSpots > 0;
    const goToPremium = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        openDashlaneUrl(premiumUrl, {
            type: 'darkWebMonitoring',
            action: 'goPremium',
        });
    };
    return (<div data-testid="empty-breaches" sx={{
            maxWidth: '340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '64px 40px',
            boxSizing: 'content-box',
            margin: '0 auto',
            gap: '16px',
        }}>
      <Icon name="FeatureDarkWebMonitoringOutlined" color="ds.text.brand.quiet" sx={{ width: '64px', minWidth: '64px', height: '64px' }}/>
      <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard" sx={{ textAlign: 'center' }}>
        {translate(getTextKey())}
      </Paragraph>
      <FlexContainer gap={4} justifyContent="center">
        {showAddEmailButton ? (<Button mood="brand" intensity="catchy" layout="labelOnly" disabled={!canAddEmail} onClick={onOpenAddDialog}>
            {translate(I18N_KEYS.BUTTON_ADD_EMAIL)}
          </Button>) : null}
        {showGoPremiumButton ? (<Button mood="brand" intensity="catchy" layout="labelOnly" onClick={goToPremium}>
            {translate(I18N_KEYS.BUTTON_GO_PREMIUM)}
          </Button>) : null}
      </FlexContainer>
    </div>);
};
