import { DataStatus } from '@dashlane/carbon-api-consumers';
import { DataLeaksEmail, emailMonitoringApi, OptinEmailError, OptoutEmailError, } from '@dashlane/password-security-contracts';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { useSpaces } from 'libs/carbon/hooks/useSpaces';
export const MAX_MONITORED_EMAIL_SLOTS = 5;
export interface UseDarkWebMonitoringEmails {
    isLoading: boolean;
    emails?: DataLeaksEmail[];
    limit: number;
    b2bAssociatedEmail: string | null;
    optinEmail: (email: string) => Promise<Result<undefined, OptinEmailError>>;
    optoutEmail: (email: string) => Promise<Result<undefined, OptoutEmailError>>;
}
export const useDarkWebMonitoringEmails = (): UseDarkWebMonitoringEmails => {
    const result = useModuleQuery(emailMonitoringApi, 'emailList');
    const spaces = useSpaces();
    const { optinEmail: optinEmailCommand, optoutEmail: optoutEmailCommand } = useModuleCommands(emailMonitoringApi);
    const optinEmail = (email: string) => optinEmailCommand({ email });
    const optoutEmail = (email: string) => optoutEmailCommand({ email });
    if (spaces.status === DataStatus.Loading ||
        result.status === DataStatus.Loading) {
        return {
            isLoading: true,
            limit: MAX_MONITORED_EMAIL_SLOTS,
            b2bAssociatedEmail: null,
            optinEmail,
            optoutEmail,
        };
    }
    const b2bAssociatedEmail = spaces.status === DataStatus.Success && spaces.data.length > 0
        ? spaces?.data[0].associatedEmail
        : null;
    return {
        isLoading: false,
        emails: result.data,
        limit: MAX_MONITORED_EMAIL_SLOTS,
        b2bAssociatedEmail,
        optinEmail,
        optoutEmail,
    };
};
