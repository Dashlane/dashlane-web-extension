import { jsx } from '@dashlane/design-system';
import { autofillNotificationsApi } from '@dashlane/autofill-contracts';
import { DataStatus, useFeatureFlip, useModuleQuery, } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { useIsB2BTrial } from 'libs/hooks/use-is-b2b-trial';
import { useIsB2CTrial } from 'libs/hooks/use-is-b2c-trial';
import { AutofillDisabledNotification } from './autofill-disabled-notification/autofill-disabled-notification';
import { BusinessTrialBanner } from './b2b-trial-banner/b2b-trial-banner';
import { B2CTrialBanner } from './b2c-trial-banner/b2c-trial-banner';
const B2C_POST_TRIAL_BANNER_FF = FEATURE_FLIPS_WITHOUT_MODULE.B2CWebPostTrialBanner;
export interface FooterAlertComponentProps {
    embeddedAlertIsShown: boolean;
}
export const FooterAlertWrapper = ({ embeddedAlertIsShown, }: FooterAlertComponentProps) => {
    const hasB2CPostTrialBannerFF = useFeatureFlip(B2C_POST_TRIAL_BANNER_FF);
    const isB2BTrial = useIsB2BTrial();
    const isB2CTrial = useIsB2CTrial();
    const getAutofillDisabledNotificationStatus = useModuleQuery(autofillNotificationsApi, 'getAutofillDisabledOnLoginsAndFormsNotificationStatus');
    if (isB2BTrial === null ||
        isB2CTrial === null ||
        hasB2CPostTrialBannerFF === null ||
        hasB2CPostTrialBannerFF === undefined ||
        getAutofillDisabledNotificationStatus.status !== DataStatus.Success) {
        return null;
    }
    const showB2BTrialBanner = isB2BTrial && !embeddedAlertIsShown;
    const showB2CTrialBanner = isB2CTrial && !embeddedAlertIsShown;
    const showB2CPostTrialBanner = !isB2CTrial &&
        !isB2BTrial &&
        !embeddedAlertIsShown &&
        hasB2CPostTrialBannerFF;
    const showAutofillDisabledNotification = getAutofillDisabledNotificationStatus.data;
    return showAutofillDisabledNotification ? (<AutofillDisabledNotification />) : showB2BTrialBanner ? (<BusinessTrialBanner />) : showB2CTrialBanner ? (<B2CTrialBanner />) : showB2CPostTrialBanner ? (<B2CTrialBanner isPostTrial={true}/>) : null;
};
