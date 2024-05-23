import React from 'react';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { Permission, sharingItemsApi } from '@dashlane/sharing-contracts';
import { HideIcon, RevealIcon } from '@dashlane/ui-components';
import { CredentialDetailView } from '@dashlane/communication';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import useTranslate from 'src/libs/i18n/useTranslate';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
export const I18N_KEYS = {
    REVEAL_PASSWORD: 'tab/all_items/credential/view/action/reveal_password',
    HIDE_PASSWORD: 'tab/all_items/credential/view/action/hide_password',
    COPY_PASSWORD: 'tab/all_items/credential/view/action/copy_password',
    REVEAL_LIMITED_PASSWORD: 'tab/all_items/credential/view/action/reveal_limited_access_password',
    COPY_LIMITED_PASSWORD: 'tab/all_items/credential/view/action/copy_limited_access_password',
};
interface PasswordActionsProps {
    credentialId: string;
    isPasswordVisible: boolean;
    onShowClick: () => void;
    onHideClick: () => void;
    onCopyClick: () => void;
}
const PasswordActionsComponent: React.FC<PasswordActionsProps> = ({ credentialId, isPasswordVisible, onCopyClick, onHideClick, onShowClick, }) => {
    const { translate } = useTranslate();
    const { data, status } = useModuleQuery(sharingItemsApi, 'getPermissionForItem', {
        itemId: credentialId,
    });
    if (status !== DataStatus.Success) {
        return null;
    }
    const isCredentialLimited = data.permission === Permission.Limited;
    if (isCredentialLimited) {
        return (<>
        <IconButtonWithTooltip tooltipContent={translate(I18N_KEYS.REVEAL_LIMITED_PASSWORD)} tooltipMaxWidth={162} disabled={true} icon={<RevealIcon title={translate(I18N_KEYS.REVEAL_LIMITED_PASSWORD)}/>}/>
        <CopyIconButton copyAction={onCopyClick} text={translate(I18N_KEYS.COPY_LIMITED_PASSWORD)} disabled={true}/>
      </>);
    }
    return (<>
      {!isPasswordVisible ? (<IconButtonWithTooltip tooltipContent={translate(I18N_KEYS.REVEAL_PASSWORD)} tooltipMaxWidth={162} onClick={onShowClick} icon={<RevealIcon title={translate(I18N_KEYS.REVEAL_PASSWORD)}/>}/>) : (<IconButtonWithTooltip tooltipContent={translate(I18N_KEYS.HIDE_PASSWORD)} tooltipMaxWidth={162} onClick={onHideClick} icon={<HideIcon title={translate(I18N_KEYS.HIDE_PASSWORD)}/>}/>)}
      <CopyIconButton copyAction={onCopyClick} text={translate(I18N_KEYS.COPY_PASSWORD)}/>
    </>);
};
export const PasswordActions = React.memo(PasswordActionsComponent);
