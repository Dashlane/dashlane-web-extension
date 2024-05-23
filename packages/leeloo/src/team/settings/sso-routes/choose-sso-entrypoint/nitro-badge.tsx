import { DomainVerificationStatus, SsoProvisioning, } from '@dashlane/sso-scim-contracts';
import { Badge, jsx } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    NEW_LABEL: 'team_new_label',
};
const STEPS_MAP = {
    NONE: 0,
    IDP_APPLICATION: 1,
    IDP_METADATA: 2,
    DOMAIN_NAME: 3,
    DOMAIN_VERIFICATION: 4,
    TEST_SSO: 5,
    ENABLE_SSO: 6,
};
const TOTAL_STEPS = Object.keys(STEPS_MAP).length - 1;
const I18N_VALUES = {
    NEW: 'new',
    STEPS: (strings: TemplateStringsArray, current: number, total: number) => `step ${current} of ${total}`,
};
const calculateStepNumber = (nitroState: SsoProvisioning): number => {
    if (!nitroState.global.isTeamProvisionedInNitro) {
        return STEPS_MAP.NONE;
    }
    if (nitroState.enableSSO.ssoEnabled) {
        return STEPS_MAP.ENABLE_SSO;
    }
    const firstDomainName = nitroState.domainSetup[0]?.domainName;
    if (nitroState.domainVerificationInfo[firstDomainName]?.verificationStatus ===
        DomainVerificationStatus.enum?.valid) {
        return STEPS_MAP.DOMAIN_VERIFICATION;
    }
    if (firstDomainName) {
        return STEPS_MAP.DOMAIN_NAME;
    }
    if (nitroState.idpMetadata.metadataValue) {
        return STEPS_MAP.IDP_METADATA;
    }
    if (nitroState.global.isTeamProvisionedInNitro) {
        return STEPS_MAP.IDP_APPLICATION;
    }
    return STEPS_MAP.NONE;
};
export const NitroBadge = ({ nitroStateStatus, nitroState, }: {
    nitroStateStatus: DataStatus;
    nitroState?: SsoProvisioning;
}) => {
    const { translate } = useTranslate();
    if (nitroStateStatus !== DataStatus.Success || !nitroState) {
        return null;
    }
    const currentStep = calculateStepNumber(nitroState);
    if (currentStep === 0) {
        return (<Badge label={translate(I18N_KEYS.NEW_LABEL)} mood="brand" intensity="quiet"/>);
    }
    return (<Badge label={I18N_VALUES.STEPS `${currentStep}${TOTAL_STEPS}`} mood="neutral" intensity="quiet"/>);
};
