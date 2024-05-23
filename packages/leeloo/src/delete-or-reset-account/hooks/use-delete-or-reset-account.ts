import { CompleteFlowResultErrorCode, deleteOrResetAccountApi, UserAuthenticationMethod, } from '@dashlane/account-contracts';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { isFailure } from '@dashlane/framework-types';
export interface UseDeleteOrResetAccount {
    userAuthenticationMethod: UserAuthenticationMethod | null;
    isFlowCompleted: boolean;
    initiateFlow: (login: string) => Promise<string | undefined>;
    completeFlow: (token: string, isDelete: boolean) => Promise<CompleteFlowResultErrorCode | null>;
}
export const useDeleteOrResetAccount = (): UseDeleteOrResetAccount => {
    const accountVerificationResult = useModuleQuery(deleteOrResetAccountApi, 'userAuthenticationMethod');
    const isFlowCompletedResult = useModuleQuery(deleteOrResetAccountApi, 'isFlowCompleted');
    const { initiateFlow, completeFlow } = useModuleCommands(deleteOrResetAccountApi);
    return {
        userAuthenticationMethod: accountVerificationResult.status === DataStatus.Success
            ? accountVerificationResult.data
            : null,
        isFlowCompleted: isFlowCompletedResult.status === DataStatus.Success &&
            isFlowCompletedResult.data,
        initiateFlow: async (login) => {
            const result = await initiateFlow({ login });
            if (isFailure(result)) {
                return result.error.tag;
            }
            return undefined;
        },
        completeFlow: async (token, isDelete) => {
            const result = await completeFlow({ token, isDelete });
            if (isFailure(result)) {
                return result.error.tag;
            }
            return null;
        },
    };
};
