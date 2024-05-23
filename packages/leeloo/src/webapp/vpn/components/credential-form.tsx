import { jsx } from '@dashlane/ui-components';
import { ActivateVpnAccountRequest, VpnAccountStatus, VpnAccountStatusType, } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { TutorialStepStatus } from './tutorial-step';
import { useEffect, useState } from 'react';
import { VpnViewCredentials } from './vpn-view-credential';
import { TutorialStepNumberProp } from './types';
import { ActivationData, CredentialActivationStep, } from './credential-activation-step';
import { useDebounceVpnActivationStatus } from 'webapp/vpn';
import { TutorialStepWrapper } from './tutorial-step-wrapper';
import { useAccountContactInfo } from 'webapp/account/hooks/use-contact-info';
import { useUserLogin } from 'webapp/account/hooks/use-user-login';
const I18N_KEYS = {
    ACTIVATE: {
        HEADING: 'webapp_vpn_page_credential_activate_heading',
    },
    ACTIVATING: {
        HEADING: 'webapp_vpn_page_credential_activating_heading',
    },
};
type CredentialFormProps = {
    vpnCredential: VpnAccountStatus | null;
    generateCredential: ({ email }: ActivateVpnAccountRequest) => void;
} & TutorialStepNumberProp;
export const CredentialForm = ({ stepNumber, vpnCredential, generateCredential, }: CredentialFormProps) => {
    const { translate } = useTranslate();
    const contactInfo = useAccountContactInfo();
    const login = useUserLogin();
    const [isPrivacyConsentChecked, setIsPrivacyConsentChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [defaultEmail, setDefaultEmail] = useState('');
    const { isIntermediate, isActivated, isActivating } = useDebounceVpnActivationStatus(vpnCredential);
    useEffect(() => {
        const contactEmail = contactInfo?.email ?? login ?? '';
        setDefaultEmail(contactEmail);
        setEmail(contactEmail);
    }, [contactInfo, login]);
    const activationData: ActivationData = {
        defaultEmail,
        email,
        isPrivacyConsentChecked,
        setEmail,
        setIsPrivacyConsentChecked,
    };
    const initial = vpnCredential?.status === VpnAccountStatusType.NotFound ||
        vpnCredential?.status === VpnAccountStatusType.Error;
    const inProcess = isActivating() ||
        vpnCredential?.status === VpnAccountStatusType.Activating ||
        isIntermediate();
    const additionalProps = inProcess
        ? { disabled: true }
        : {
            onClick: () => generateCredential({ email }),
        };
    const status = inProcess
        ? TutorialStepStatus.IN_PROCESS
        : TutorialStepStatus.INITIAL;
    const title = inProcess
        ? translate(I18N_KEYS.ACTIVATING.HEADING)
        : translate(I18N_KEYS.ACTIVATE.HEADING);
    return (<TutorialStepWrapper>
      {initial || inProcess ? (<CredentialActivationStep number={stepNumber} options={{ easeIn: false, easeOut: isIntermediate() }} status={status} title={title} {...activationData} {...additionalProps}/>) : null}

      {isActivated() &&
            vpnCredential?.status === VpnAccountStatusType.Activated ? (<VpnViewCredentials email={vpnCredential.email} password={vpnCredential.password} credentialId={vpnCredential.credentialId}/>) : null}
    </TutorialStepWrapper>);
};
