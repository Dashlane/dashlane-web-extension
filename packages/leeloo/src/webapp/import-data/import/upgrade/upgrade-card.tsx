import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { ClickOrigin, Button as HermesButton, UserClickEvent, } from '@dashlane/hermes';
import { Badge, Button, Heading, jsx, Paragraph, } from '@dashlane/design-system';
import { Card } from '@dashlane/ui-components';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { useIsFreeB2CUser } from 'libs/carbon/hooks/useNodePremiumStatus';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
const GET_PREMIUM_URL = '*****';
const I18N_KEYS = {
    UPGRADE_BADGE: 'webapp_import_upgrade_badge',
    CARD_TITLE: 'webapp_import_upgrade_title',
    CARD_DESCRIPTION: 'webapp_import_upgrade_description',
    UPGRADE_BUTTON: 'webapp_import_upgrade_button',
};
export const UpgradeCard = () => {
    const { translate } = useTranslate();
    const accountInfo = useAccountInfo();
    const handleClickUpgradePremium = () => {
        const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${accountInfo?.subscriptionCode ?? ''}`;
        void logEvent(new UserClickEvent({
            clickOrigin: ClickOrigin.ImportDataPasswordLimitReached,
            button: HermesButton.BuyDashlane,
        }));
        openUrl(buyDashlaneLink);
    };
    const { isLoading, isFreeB2C } = useIsFreeB2CUser();
    const hasB2CPasswordLimitFF = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.B2CRestrictPasswordFreePlanPhase2);
    if (isLoading || !hasB2CPasswordLimitFF || !isFreeB2C) {
        return null;
    }
    return (<Card sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            marginTop: '32px',
            background: 'ds.container.agnostic.neutral.supershy',
            borderRadius: '8px',
            gap: '8px',
            border: '1px solid ds.border.neutral.quiet.idle',
            maxWidth: '479px',
            height: '250px',
        }}>
      <Badge mood="brand" intensity="quiet" label={translate(I18N_KEYS.UPGRADE_BADGE)} iconName="PremiumOutlined" layout="iconLeading"/>
      <Heading as="h1" textStyle="ds.title.block.medium" color="ds.text.neutral.standard">
        {translate(I18N_KEYS.CARD_TITLE)}
      </Heading>
      <Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.standard">
        {translate(I18N_KEYS.CARD_DESCRIPTION)}
      </Paragraph>
      <Button sx={{ marginTop: '22px', alignSelf: 'flex-end' }} mood="brand" intensity="quiet" icon="PremiumOutlined" layout="iconLeading" onClick={handleClickUpgradePremium}>
        {translate(I18N_KEYS.UPGRADE_BUTTON)}
      </Button>
    </Card>);
};
