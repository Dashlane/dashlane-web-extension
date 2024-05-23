import * as React from 'react';
import { CopyIcon, TimeBasedOTP } from '@dashlane/ui-components';
import { useToast } from '@dashlane/design-system';
import { AnonymousCopyVaultItemFieldEvent, DomainType, Field, hashDomain, ItemType, UserCopyVaultItemFieldEvent, } from '@dashlane/hermes';
import { ParsedURL } from '@dashlane/url-parser';
import { VaultItemType } from '@dashlane/vault-contracts';
import { useCredentialOTPData } from 'libs/api';
import { DataStatus } from 'libs/api/types';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'src/libs/logs/logEvent';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
import { useAlertAutofillEngine } from 'src/app/use-autofill-engine';
import styles from './styles.css';
const DEFAULT_VALIDITY_PERIOD_MS = 30 * 1000;
const ALERT_THRESHOLD_MS = 5 * 1000;
export const I18N_KEYS = {
    OTP_LABEL: 'tab/all_items/credential/view/label/otp',
    OTP_TOOLTIP: 'tab/all_items/credential/view/action/copy_otp',
    OTP_COPY_NOTIFICATION: 'tab/all_items/credential/actions/otp_copied_to_clipboard',
};
interface OTPFieldProps {
    credentialId: string;
    credentialUrl: string;
}
const OTPFieldComponent: React.FC<OTPFieldProps> = ({ credentialId, credentialUrl, }) => {
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const credentialOTPData = useCredentialOTPData(credentialId);
    const alertAutofillEngine = useAlertAutofillEngine();
    const handleCopyClick = React.useCallback(async () => {
        if (credentialOTPData.status === DataStatus.Success &&
            !!credentialOTPData.data) {
            await navigator.clipboard.writeText(credentialOTPData.data.code);
            void logEvent(new UserCopyVaultItemFieldEvent({
                itemType: ItemType.Credential,
                field: Field.OtpSecret,
                itemId: credentialId,
                isProtected: false,
            }));
            const rootDomain = new ParsedURL(credentialUrl).getRootDomain();
            void logEvent(new AnonymousCopyVaultItemFieldEvent({
                itemType: ItemType.Credential,
                field: Field.OtpSecret,
                domain: {
                    id: await hashDomain(rootDomain),
                    type: DomainType.Web,
                },
            }));
            void alertAutofillEngine(credentialId, credentialOTPData.data.code, VaultItemType.Credential, Field.OtpCode);
            showToast({
                description: translate(I18N_KEYS.OTP_COPY_NOTIFICATION),
            });
        }
    }, [
        credentialOTPData.status,
        credentialOTPData.data,
        credentialId,
        credentialUrl,
        alertAutofillEngine,
        showToast,
        translate,
    ]);
    const [code, validityEndDate, validityPeriod] = credentialOTPData.status === DataStatus.Success && !!credentialOTPData.data
        ? [
            credentialOTPData.data.code,
            credentialOTPData.data.validityEndDate,
            credentialOTPData.data.validityTime,
        ]
        : [null, Infinity, DEFAULT_VALIDITY_PERIOD_MS];
    return (<div className={styles.container}>
      <TimeBasedOTP code={code} label={translate(I18N_KEYS.OTP_LABEL)} validityEndDate={validityEndDate} validityPeriod={validityPeriod} alertThreshold={ALERT_THRESHOLD_MS}/>
      <div className={styles.actionList}>
        <IconButtonWithTooltip tooltipContent={translate(I18N_KEYS.OTP_TOOLTIP)} tooltipMaxWidth={162} onClick={(event) => {
            if (event.detail === 0) {
                handleCopyClick();
            }
            else {
                handleCopyClick();
                event.currentTarget.blur();
            }
        }} icon={<CopyIcon title={translate(I18N_KEYS.OTP_TOOLTIP)}/>}/>
      </div>
    </div>);
};
export const OTP = React.memo(OTPFieldComponent);
