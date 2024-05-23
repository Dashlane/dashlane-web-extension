import React from 'react';
import { Field, ItemType } from '@dashlane/hermes';
import { FiscalId, VaultItemType } from '@dashlane/vault-contracts';
import { useToast } from '@dashlane/design-system';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import useTranslate from 'src/libs/i18n/useTranslate';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import { useCopyAction } from 'src/app/vault/detail-views/credential-detail-view/useCopyAction';
import { SectionRow } from '../../common';
import { FiscalIdIcon } from './fiscal-id-icon';
export const I18N_KEYS = {
    FISCAL_ID_NUMBER_COPY: 'tab/all_items/ids/fiscal_id/detail_view/actions/copy_number',
    FISCAL_ID_NUMBER_COPIED: 'tab/all_items/ids/fiscal_id/detail_view/actions/copied_clipboard',
};
export interface Props {
    item: FiscalId;
    listContainerRef?: React.RefObject<HTMLElement>;
    listHeaderRef?: React.RefObject<HTMLElement>;
}
const FiscalIdComponent = ({ item, listContainerRef, listHeaderRef, }: Props) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const { id, spaceId, fiscalNumber } = item;
    const openFiscalIdDetailView = () => {
        logSelectVaultItem(id, ItemType.FiscalStatement);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.FiscalId, id);
    };
    const fiscalIdNumberCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.FISCAL_ID_NUMBER_COPIED),
        showToast,
        itemType: VaultItemType.FiscalId,
        field: Field.FiscalNumber,
        itemId: id,
        isProtected: false,
        value: fiscalNumber,
    });
    return (<SectionRow key={id} thumbnail={<FiscalIdIcon />} itemSpaceId={spaceId} title={fiscalNumber} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openFiscalIdDetailView} actions={<CopyIconButton text={translate(I18N_KEYS.FISCAL_ID_NUMBER_COPY)} copyAction={() => {
                void fiscalIdNumberCopyAction();
            }}/>}/>);
};
export const FiscalIdListItem = React.memo(FiscalIdComponent);
