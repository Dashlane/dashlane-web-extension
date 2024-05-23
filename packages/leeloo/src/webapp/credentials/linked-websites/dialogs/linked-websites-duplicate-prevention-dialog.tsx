import React from 'react';
import { Button, FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import styles from './styles.css';
export interface LinkedWebsitesDuplicateDialogData {
    credentialName: string;
    linkedWebsite: string;
}
interface Props {
    duplicateData: LinkedWebsitesDuplicateDialogData[];
    onCancel: () => void;
    onSave: () => void;
}
const I18N_KEYS = {
    DIALOG_DUPLICATE_PREVENTION_TITLE_ONE: 'webapp_credential_linked_websites_duplicate_prevention_dialog_title_one',
    DIALOG_DUPLICATE_PREVENTION_DESCRIPTION_ONE: 'webapp_credential_linked_websites_duplicate_prevention_dialog_description_one',
    ADD_WEBSITES_ONE: 'webapp_credential_linked_websites_duplicate_prevention_dialog_add_websites_one',
    DIALOG_DUPLICATE_PREVENTION_TITLE_MULTIPLE: 'webapp_credential_linked_websites_duplicate_prevention_dialog_title_multiple',
    DIALOG_DUPLICATE_PREVENTION_DESCRIPTION_MULTIPLE: 'webapp_credential_linked_websites_duplicate_prevention_dialog_description_multiple',
    ADD_WEBSITES_MULTIPLE: 'webapp_credential_linked_websites_duplicate_prevention_dialog_add_websites_multiple',
    CANCEL: 'webapp_credential_linked_websites_duplicate_prevention_dialog_cancel',
};
export const LinkedWebsitesDuplicateDialog = ({ duplicateData, onCancel, onSave, }: Props) => {
    const { translate } = useTranslate();
    const hasMultiplePotentialDuplicates = duplicateData.length > 1;
    const dialogTitle = hasMultiplePotentialDuplicates
        ? translate(I18N_KEYS.DIALOG_DUPLICATE_PREVENTION_TITLE_MULTIPLE)
        : translate(I18N_KEYS.DIALOG_DUPLICATE_PREVENTION_TITLE_ONE, {
            url: duplicateData[0].linkedWebsite,
        });
    const dialogDescription = hasMultiplePotentialDuplicates
        ? translate(I18N_KEYS.DIALOG_DUPLICATE_PREVENTION_DESCRIPTION_MULTIPLE)
        : translate(I18N_KEYS.DIALOG_DUPLICATE_PREVENTION_DESCRIPTION_ONE, {
            credentialName: duplicateData[0].credentialName,
        });
    const confirmButtonText = hasMultiplePotentialDuplicates
        ? translate(I18N_KEYS.ADD_WEBSITES_MULTIPLE)
        : translate(I18N_KEYS.ADD_WEBSITES_ONE);
    return (<SimpleDialog isOpen showCloseIcon title={dialogTitle} onRequestClose={onCancel} footer={<FlexContainer justifyContent="end" gap="8px">
          <Button type="button" nature="secondary" onClick={onCancel}>
            {translate(I18N_KEYS.CANCEL)}
          </Button>
          <Button type="button" onClick={onSave}>
            {confirmButtonText}
          </Button>
        </FlexContainer>}>
      <div>
        <p>{dialogDescription}</p>
        {hasMultiplePotentialDuplicates ? (<ul className={styles.duplicatesList}>
            {duplicateData.map((duplicate) => (<li key={duplicate.linkedWebsite} className={styles.duplicateItem}>
                {duplicate.linkedWebsite}
              </li>))}
          </ul>) : null}
      </div>
    </SimpleDialog>);
};
