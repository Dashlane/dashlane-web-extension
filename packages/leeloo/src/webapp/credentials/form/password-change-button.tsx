import { Button, jsx } from '@dashlane/design-system';
import { Fragment, memo, useCallback, useState } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { PasswordChangeDialog } from '../../password-change-dialog/components/dialogs/password-change-dialog';
export interface PasswordChangeButtonProps {
    credential: {
        limitedPermissions?: boolean;
        id: string;
    };
}
const PasswordChangeButtonComponent = ({ credential, }: PasswordChangeButtonProps) => {
    const { translate } = useTranslate();
    const [passwordChangeCredentialId, setPasswordChangeCredentialId] = useState<null | string>(null);
    const openPasswordChange = useCallback((credentialId) => setPasswordChangeCredentialId(credentialId), []);
    const closePasswordChange = useCallback(() => setPasswordChangeCredentialId(null), []);
    return (<>
      <Button layout="iconOnly" icon="ActionRefreshOutlined" mood="brand" intensity="supershy" onClick={() => openPasswordChange(credential.id)} disabled={credential.limitedPermissions} tooltip={translate('webapp_credential_edition_autochange')}/>
      {passwordChangeCredentialId && (<PasswordChangeDialog credentialId={passwordChangeCredentialId} dismissCallback={closePasswordChange}/>)}
    </>);
};
export const PasswordChangeButton = memo(PasswordChangeButtonComponent);
