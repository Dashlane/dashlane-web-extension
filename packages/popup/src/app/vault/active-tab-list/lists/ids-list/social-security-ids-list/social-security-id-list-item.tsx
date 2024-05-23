import React from 'react';
import { Field, ItemType } from '@dashlane/hermes';
import { useToast } from '@dashlane/design-system';
import { SocialSecurityId, VaultItemType } from '@dashlane/vault-contracts';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import useTranslate from 'src/libs/i18n/useTranslate';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import { SocialSecurityIdIcon } from './social-security-id-icon';
import { CopyIconButton } from 'src/app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button';
import { useCopyAction } from 'src/app/vault/detail-views/credential-detail-view/useCopyAction';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SectionRow } from '../../common';
export const I18N_KEYS = {
    SOCIAL_SECURITY_NUMBER_COPY: 'tab/all_items/ids/social_security/detail_view/actions/copy_number',
    SOCIAL_SECURITY_NUMBER_COPIED: 'tab/all_items/ids/social_security/detail_view/actions/number_copied_to_clipboard',
};
export interface Props {
    item: SocialSecurityId;
    listContainerRef?: React.RefObject<HTMLElement>;
    listHeaderRef?: React.RefObject<HTMLElement>;
}
const SocialSecurityIdComponent = ({ item, listContainerRef, listHeaderRef, }: Props) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const { id, idName, spaceId, idNumber } = item;
    const openSocialSecurityIdDetailView = () => {
        logSelectVaultItem(id, ItemType.SocialSecurity);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.SocialSecurityId, id);
    };
    const socialSecurityNumberCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.SOCIAL_SECURITY_NUMBER_COPIED),
        showToast,
        itemType: VaultItemType.SocialSecurityId,
        field: Field.SocialSecurityNumber,
        itemId: id,
        isProtected: false,
        value: idNumber,
    });
    return (<SectionRow key={id} thumbnail={<SocialSecurityIdIcon />} itemSpaceId={spaceId} title={idName} subtitle={idNumber} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openSocialSecurityIdDetailView} actions={<CopyIconButton text={translate(I18N_KEYS.SOCIAL_SECURITY_NUMBER_COPY)} copyAction={() => {
                void socialSecurityNumberCopyAction();
            }}/>}/>);
};
export const SocialSecurityIdListItem = React.memo(SocialSecurityIdComponent);
