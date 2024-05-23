import { Fragment } from 'react';
import { Heading, jsx } from '@dashlane/ui-components';
import { SharingInviteStep } from './types';
import useTranslate from 'libs/i18n/useTranslate';
import { ProtectedItemsForm } from 'webapp/unlock-items/components/protected-items-form';
import { LockedItemType } from 'webapp/unlock-items/types';
const I18N_KEYS = { LABEL: 'webapp_lock_items_label' };
interface Props {
    goToStep: (step: SharingInviteStep) => void;
    onDismiss: () => void;
}
export const UnlockCollectionDialog = ({ goToStep, onDismiss }: Props) => {
    const { translate } = useTranslate();
    return (<>
      <Heading as="h1" size="small" sx={{ mb: '16px' }}>
        {translate(I18N_KEYS.LABEL)}
      </Heading>
      <ProtectedItemsForm unlockRequest={{
            itemType: LockedItemType.SharedItems,
            successCallback: () => goToStep(SharingInviteStep.CollectionRecipients),
            cancelCallback: onDismiss,
        }}/>
    </>);
};
