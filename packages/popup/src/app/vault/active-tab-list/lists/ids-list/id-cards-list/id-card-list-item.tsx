import React from 'react';
import { Field, ItemType } from '@dashlane/hermes';
import { IdCard, VaultItemType } from '@dashlane/vault-contracts';
import { useToast } from '@dashlane/design-system';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import useTranslate from 'src/libs/i18n/useTranslate';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import { useCopyAction } from 'src/app/vault/detail-views/credential-detail-view/useCopyAction';
import { SectionRow } from '../../common';
import { IdCardIcon } from './id-card-icon';
export const I18N_KEYS = {
    ID_CARD_NUMBER_COPY: 'tab/all_items/ids/id_card/detail_view/actions/copy_number',
    ID_CARD_NUMBER_COPIED: 'tab/all_items/ids/id_card/detail_view/actions/number_copied_to_clipboard',
};
export interface Props {
    item: IdCard;
    listContainerRef?: React.RefObject<HTMLElement>;
    listHeaderRef?: React.RefObject<HTMLElement>;
}
const IdCardComponent = ({ item, listContainerRef, listHeaderRef }: Props) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { id, idName, spaceId, idNumber } = item;
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const openIdCardDetailView = () => {
        logSelectVaultItem(id, ItemType.IdCard);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.IdCard, id);
    };
    const idCardNumberCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.ID_CARD_NUMBER_COPIED),
        showToast,
        itemType: VaultItemType.IdCard,
        field: Field.Number,
        itemId: id,
        isProtected: false,
        value: idNumber,
    });
    return (<SectionRow key={id} thumbnail={<IdCardIcon />} itemSpaceId={spaceId} title={idName} subtitle={idNumber} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openIdCardDetailView} actions={<CopyIconButton text={translate(I18N_KEYS.ID_CARD_NUMBER_COPY)} copyAction={() => {
                void idCardNumberCopyAction();
            }}/>}/>);
};
export const IdCardListItem = React.memo(IdCardComponent);
