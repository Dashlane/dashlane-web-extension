import { VpnAccountStatus } from '@dashlane/communication';
export interface TutorialStepNumberProp {
    stepNumber: number;
    vpnCredential: VpnAccountStatus | null;
}
