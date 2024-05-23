import { MouseEvent, ReactNode } from 'react';
import { fromUnixTime } from 'date-fns';
import { jsx } from '@dashlane/design-system';
import { SecureNote } from '@dashlane/vault-contracts';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
import LocalizedTimeAgo from 'libs/i18n/localizedTimeAgo';
import { TranslatorInterface } from 'libs/i18n/types';
import useTranslate from 'libs/i18n/useTranslate';
import { logSelectSecureNote } from 'libs/logs/events/vault/select-item';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import Row from 'webapp/list-view/row';
import { NoteTitle } from 'webapp/secure-notes/list/note-title';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
import { NoteCategory } from './note-category';
import { convertNewSecureNoteToView } from '../utils';
import { SX_STYLES } from '../styles';
const displayCreatedAt = (translate: TranslatorInterface, creationDatetime?: number): ReactNode => {
    return creationDatetime ? (<IntelligentTooltipOnOverflow>
      {translate.shortDate(fromUnixTime(creationDatetime))}
    </IntelligentTooltipOnOverflow>) : null;
};
const displayUpdatedAt = (userModificationDatetime?: number): ReactNode => {
    return userModificationDatetime ? (<IntelligentTooltipOnOverflow>
      <LocalizedTimeAgo date={fromUnixTime(userModificationDatetime)}/>
    </IntelligentTooltipOnOverflow>) : null;
};
interface NoteProps {
    note: SecureNote;
}
export const NoteRow = ({ note }: NoteProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const isNoteLocked = note.isSecured && !areProtectedItemsUnlocked;
    const { translate } = useTranslate();
    const onRowClick = (e: MouseEvent<HTMLElement>) => {
        logSelectSecureNote(note.id);
        if (isNoteLocked) {
            e.preventDefault();
            e.stopPropagation();
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.SecureNote,
                successCallback: () => {
                    redirect(routes.userSecureNote(note.id));
                },
            });
        }
        else {
            redirect(routes.userSecureNote(note.id));
        }
    };
    const rowData = [
        {
            key: 'title',
            content: <NoteTitle note={convertNewSecureNoteToView(note)}/>,
        },
        {
            key: 'category',
            content: <NoteCategory categoryId={note.categoryId}/>,
            sxProps: SX_STYLES.CATEGORY_CELL,
        },
        {
            key: 'createdAt',
            content: displayCreatedAt(translate, note.creationDatetime),
            sxProps: SX_STYLES.CREATED_CELL,
        },
        {
            key: 'updatedAt',
            content: displayUpdatedAt(note.userModificationDatetime),
            sxProps: SX_STYLES.UPDATED_CELL,
        },
    ];
    return <Row key={note.id} onClick={onRowClick} data={rowData}/>;
};
