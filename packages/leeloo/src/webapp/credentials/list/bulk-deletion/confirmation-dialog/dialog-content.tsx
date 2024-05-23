import { Fragment } from 'react';
import { Credential } from '@dashlane/vault-contracts';
import { DialogFooter, jsx, LoadingIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { CredentialInfo, CredentialInfoSize, } from 'libs/dashlane-style/credential-info/credential-info';
import { minimalisticScrollbarStyle } from 'webapp/vault/styles';
interface Props {
    credentialsToBeDeleted: Credential[];
    onConfirm?: () => void;
    onCancel?: () => void;
    isLoading: boolean;
}
const I18N_KEYS = {
    CONFIRM_ACTION: 'webapp_credentials_multiselect_delete_confirm_dialog_delete_button',
    CANCEL_ACTION: 'webapp_credentials_multiselect_delete_confirm_dialog_cancel_button',
};
export const DialogContent = ({ credentialsToBeDeleted, onConfirm, onCancel, isLoading, }: Props) => {
    const { translate } = useTranslate();
    if (isLoading) {
        return (<LoadingIcon color="ds.text.brand.standard" size="60px" sx={{ margin: '40px auto 20px' }}/>);
    }
    return (<>
      <ul sx={{
            margin: '16px 0',
            marginRight: '-16px',
            overflowY: 'auto',
            maxHeight: '50vh',
            ...minimalisticScrollbarStyle,
        }}>
        {credentialsToBeDeleted.map((credential) => (<li key={`bulkdelete_dialog_list_${credential.id}`} sx={{
                borderBottom: '1px solid',
                borderBottomColor: 'ds.border.neutral.quiet.idle',
                padding: '12px 0',
                marginRight: '32px',
                '&:last-child': {
                    borderBottom: 'none',
                },
            }}>
            <CredentialInfo size={CredentialInfoSize.SMALL} sxProps={{
                overflow: 'hidden',
                userSelect: 'none',
            }} title={credential.itemName} email={credential.email} login={credential.username}/>
          </li>))}
      </ul>
      <footer>
        <DialogFooter intent="danger" primaryButtonTitle={translate(I18N_KEYS.CONFIRM_ACTION)} primaryButtonOnClick={onConfirm} secondaryButtonTitle={translate(I18N_KEYS.CANCEL_ACTION)} secondaryButtonOnClick={onCancel}/>
      </footer>
    </>);
};
