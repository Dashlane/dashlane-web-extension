import React from 'react';
import { Field, ItemType } from '@dashlane/hermes';
import { Passport, VaultItemType } from '@dashlane/vault-contracts';
import { useToast } from '@dashlane/design-system';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import useTranslate from 'src/libs/i18n/useTranslate';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { useCopyAction } from 'src/app/vault/detail-views/credential-detail-view/useCopyAction';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import { SectionRow } from '../../common';
import { PassportIcon } from './passport-icon';
export const I18N_KEYS = {
    PASSPORT_NUMBER_COPY: 'tab/all_items/ids/passport/detail_view/actions/copy_number',
    PASSPORT_NUMBER_COPIED: 'tab/all_items/ids/passport/detail_view/actions/number_copied_to_clipboard',
};
export interface Props {
    item: Passport;
    listContainerRef?: React.RefObject<HTMLElement>;
    listHeaderRef?: React.RefObject<HTMLElement>;
}
const PassportComponent = ({ item, listContainerRef, listHeaderRef, }: Props) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const { id, idName, spaceId, idNumber } = item;
    const openPassportDetailView = () => {
        logSelectVaultItem(id, ItemType.Passport);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.Passport, id);
    };
    const passportNumberCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.PASSPORT_NUMBER_COPIED),
        showToast,
        itemType: VaultItemType.Passport,
        field: Field.Password,
        itemId: id,
        isProtected: false,
        value: idNumber,
    });
    return (<SectionRow key={id} thumbnail={<PassportIcon />} itemSpaceId={spaceId} title={idName} subtitle={idNumber} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openPassportDetailView} actions={<CopyIconButton text={translate(I18N_KEYS.PASSPORT_NUMBER_COPY)} copyAction={() => {
                void passportNumberCopyAction();
            }}/>}/>);
};
export const PassportListItem = React.memo(PassportComponent);
