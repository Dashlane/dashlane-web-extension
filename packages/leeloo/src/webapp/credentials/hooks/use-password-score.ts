import { passwordHealthApi } from '@dashlane/password-security-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
export const usePasswordScore = (password: string) => useModuleQuery(passwordHealthApi, 'scoreForPassword', {
    password,
});
