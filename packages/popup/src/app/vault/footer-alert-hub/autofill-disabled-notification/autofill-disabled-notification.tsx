import { memo, useState } from 'react';
import { Button, jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import { DataStatus, useFeatureFlips, useModuleCommands, } from '@dashlane/framework-react';
import { autofillNotificationsApi } from '@dashlane/autofill-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { usePremiumStatusData } from 'libs/api';
import { useActiveTabContext } from 'app/tabs/ActiveTabContext';
import { getTabNumbers, isAccountBusinessAdmin } from 'app/helpers';
import { ADMIN_TAB_DEV_FF, ADMIN_TAB_FF } from 'src/app';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    CONTAINER: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        width: 'fill',
        height: '49px',
        border: 'none',
        borderTop: '1px solid',
        borderTopColor: 'ds.border.neutral.quiet.idle',
        '&:hover': {
            cursor: 'pointer',
        },
    },
};
const I18N_KEYS = {
    CONTENT: 'embed_alert_autofill_disabled_content',
    DISMISS_LABEL: 'embed_alert_autofill_disabled_dismiss',
};
export const AutofillDisabledNotificationComponent = () => {
    const { translate } = useTranslate();
    const { setAutofillDisabledOnLoginsAndFormsNotificationStatus } = useModuleCommands(autofillNotificationsApi);
    const { setActiveTab } = useActiveTabContext();
    const premiumStatusData = usePremiumStatusData();
    const [isDismissed, setIsDismissed] = useState(false);
    const handleDismiss = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setAutofillDisabledOnLoginsAndFormsNotificationStatus({ status: false });
        setIsDismissed(true);
    };
    const retrievedFFStatus = useFeatureFlips();
    const isAdminTabEnabled = retrievedFFStatus.status === DataStatus.Success &&
        !!(retrievedFFStatus.data[ADMIN_TAB_DEV_FF] ||
            retrievedFFStatus.data[ADMIN_TAB_FF]);
    const premiumStatus = premiumStatusData.status === DataStatus.Success
        ? premiumStatusData.data
        : null;
    const isBusinessAdmin = isAccountBusinessAdmin(premiumStatus);
    const tabNumber = getTabNumbers(isBusinessAdmin, isAdminTabEnabled);
    const handleClick = () => setActiveTab(tabNumber.AUTOFILL);
    if (isDismissed) {
        return null;
    }
    return (<div role="button" tabIndex={0} onClick={handleClick} sx={SX_STYLES.CONTAINER}>
      <span>{translate(I18N_KEYS.CONTENT)}</span>
      <Button mood="brand" intensity="supershy" layout="labelOnly" size="small" onClick={handleDismiss}>
        {translate(I18N_KEYS.DISMISS_LABEL)}
      </Button>
    </div>);
};
export const AutofillDisabledNotification = memo(AutofillDisabledNotificationComponent);
