import React from 'react';
import { Field, ItemType } from '@dashlane/hermes';
import { DriversLicense, VaultItemType } from '@dashlane/vault-contracts';
import { useToast } from '@dashlane/design-system';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import useTranslate from 'src/libs/i18n/useTranslate';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import { useCopyAction } from 'src/app/vault/detail-views/credential-detail-view/useCopyAction';
import { SectionRow } from '../../common';
import { DriverLicenseIcon } from './driver-license-icon';
export interface Props {
    item: DriversLicense;
    listContainerRef?: React.RefObject<HTMLElement>;
    listHeaderRef?: React.RefObject<HTMLElement>;
}
export const I18N_ACTION_KEYS = {
    NUMBER_COPY: 'tab/all_items/ids/driver_licenses/actions/copy_number',
    NUMBER_COPIED: 'tab/all_items/ids/driver_licenses/actions/number_copied_to_clipboard',
};
const DriverLicenseComponent = ({ item, listContainerRef, listHeaderRef, }: Props) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const { id, idName, spaceId, idNumber } = item;
    const driverLicenseNumberCopyAction = useCopyAction({
        showToast,
        itemType: VaultItemType.DriversLicense,
        itemId: id,
        isProtected: false,
        toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
        field: Field.Number,
        value: idNumber,
    });
    const openDriverLicenseDetailView = () => {
        logSelectVaultItem(id, ItemType.DriverLicence);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.DriversLicense, id);
    };
    return (<SectionRow key={id} thumbnail={<DriverLicenseIcon />} itemSpaceId={spaceId} title={idName} subtitle={idNumber} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openDriverLicenseDetailView} actions={<CopyIconButton text={translate(I18N_ACTION_KEYS.NUMBER_COPY)} copyAction={() => {
                void driverLicenseNumberCopyAction();
            }}/>}/>);
};
export const DriverLicenseListItem = React.memo(DriverLicenseComponent);
