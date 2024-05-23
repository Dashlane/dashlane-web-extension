import * as React from 'react';
import { RevisionNumber } from '@dashlane/communication';
import { DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    DETAIL: 'webapp_sharing_invite_success_detail',
    DISMISS: '_common_alert_dismiss_button',
    SUCCESS: 'webapp_sharing_invite_success',
};
export interface SharingSuccessProps {
    itemsCount: RevisionNumber;
    isLoading: boolean;
    onDismiss: () => void;
}
export const SharingSuccess = ({ itemsCount, isLoading, onDismiss, }: SharingSuccessProps) => {
    const { translate } = useTranslate();
    return (<>
      <DialogTitle title={translate(I18N_KEYS.SUCCESS, { count: itemsCount })}/>
      <DialogBody>
        <Paragraph>
          {translate(I18N_KEYS.DETAIL, {
            count: itemsCount,
        })}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.DISMISS)} primaryButtonOnClick={onDismiss} primaryButtonProps={{ disabled: isLoading, type: 'button' }}/>
    </>);
};
