import React, { useState } from 'react';
import { Icon } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { VaultHeaderButton } from 'webapp/components/header/vault-header-button';
import { useCollectionPermissionsForUser } from 'webapp/sharing-invite/hooks/use-collection-permissions';
import { EditDialog, EditDialogCollectionProps } from '../dialogs';
type Props = EditDialogCollectionProps & {
    isShared: boolean;
};
export const EditButton = (props: Props) => {
    const { translate } = useTranslate();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { canEdit } = useCollectionPermissionsForUser(props.id);
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const handleClickOnEdit = () => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
        else {
            logPageView(PageView.CollectionEdit);
            setIsEditDialogOpen(true);
        }
    };
    return (<>
      <VaultHeaderButton disabled={!canEdit} onClick={handleClickOnEdit} icon={<Icon name="ActionEditOutlined"/>}>
        {translate('_common_action_edit')}
      </VaultHeaderButton>
      {isEditDialogOpen && (<EditDialog onClose={() => setIsEditDialogOpen(false)} {...props}/>)}
    </>);
};
