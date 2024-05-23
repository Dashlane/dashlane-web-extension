import React from 'react';
import { Dialog } from '@dashlane/design-system';
import { assertUnreachable } from 'libs/assert-unreachable';
import useTranslate from 'libs/i18n/useTranslate';
import { CantDeleteReason, DeleteTranslations, } from 'webapp/personal-data/edit/types';
const getCantDeleteTitle = (translations: DeleteTranslations, reason: CantDeleteReason): string | undefined => {
    const { groupSharingTitle, lastAdminTitle, genericErrorTitle } = translations;
    switch (reason) {
        case CantDeleteReason.LastAdmin:
            return lastAdminTitle;
        case CantDeleteReason.GroupSharing:
            return groupSharingTitle;
        case CantDeleteReason.Generic:
            return genericErrorTitle;
        default:
            return assertUnreachable(reason);
    }
};
const getCantDeleteSubtitle = (translations: DeleteTranslations, reason: CantDeleteReason): string | undefined => {
    const { groupSharingSubtitle, lastAdminSubtitle, genericErrorSubtitle } = translations;
    switch (reason) {
        case CantDeleteReason.LastAdmin:
            return lastAdminSubtitle;
        case CantDeleteReason.GroupSharing:
            return groupSharingSubtitle;
        case CantDeleteReason.Generic:
            return genericErrorSubtitle;
        default:
            return assertUnreachable(reason);
    }
};
interface CantDeleteDialogProps {
    reason: CantDeleteReason;
    translations: DeleteTranslations;
    goToSharingAccess: () => void;
    closeCantDeleteDialog: () => void;
}
export const CantDeleteDialog = ({ reason, translations, goToSharingAccess, closeCantDeleteDialog, }: CantDeleteDialogProps): JSX.Element => {
    const { translate } = useTranslate();
    const title = getCantDeleteTitle(translations, reason);
    const subtitle = getCantDeleteSubtitle(translations, reason);
    return (<Dialog isOpen onClose={closeCantDeleteDialog} title={title ?? ''} closeActionLabel={translate('_common_dialog_dismiss_button')} actions={reason === CantDeleteReason.LastAdmin || CantDeleteReason.GroupSharing
            ? {
                primary: {
                    children: translations.lastAdminActionLabel,
                    onClick: () => {
                        goToSharingAccess();
                        closeCantDeleteDialog();
                    },
                },
            }
            : undefined}>
      {subtitle}
    </Dialog>);
};
