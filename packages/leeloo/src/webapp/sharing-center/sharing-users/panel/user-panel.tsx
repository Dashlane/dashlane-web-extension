import { useEffect, useState } from 'react';
import { NoteItemView, SecretItemView } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { jsx, TextInput } from '@dashlane/design-system';
import { useModuleQuery } from '@dashlane/framework-react';
import { SearchIcon } from '@dashlane/ui-components';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { AvatarWithAbbreviatedText } from 'libs/dashlane-style/avatar/avatar-with-abbreviated-text';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import useTranslate from 'libs/i18n/useTranslate';
import { useData } from 'libs/carbon/hooks/use-item-data';
import { carbonConnector } from 'libs/carbon/connector';
import { useGetCollectionsForUserOrGroupData } from 'libs/hooks/use-get-collections-for-user-or-group';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { ContentCard } from 'webapp/panel/standard/content-card';
import { Panel, PanelHeader } from 'webapp/panel';
import { ItemsList } from 'webapp/sharing-center/shared/items-list/items-list';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import { BottomPanelBar } from 'webapp/sharing-center/layout/bottom-panel-bar/bottom-panel-bar';
import { PanelBody } from '../../layout/panel-body';
const I18N_KEYS = {
    COLLECTIONS_HEADER: 'webapp_sharing_center_panel_collections_header',
    ITEMS_HEADER: 'webapp_sharing_center_panel_items_header',
    ITEMS_SEARCH: 'webapp_sharing_center_panel_items_search',
    PERMISSION_BUTTON: 'webapp_sharing_center_panel_permission_button',
};
interface UserPanelProps {
    onClose: () => void;
    match: {
        params?: {
            id?: string;
        };
    };
}
export const UserPanel = ({ onClose, match }: UserPanelProps) => {
    const { currentSpaceId: spaceId } = useTeamSpaceContext();
    const userId = match.params?.id ?? '';
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const collections = useGetCollectionsForUserOrGroupData(userId) || [];
    const filteredCollections = !searchValue
        ? collections
        : collections?.filter((collection) => collection.name.toLowerCase().includes(searchValue.toLowerCase())) || [];
    const { translate } = useTranslate();
    const sharingUserNotes = useData(carbonConnector.getNotes, carbonConnector.liveNotes, {
        spaceId,
        filterQuery: searchValue === '' ? null : searchValue,
        additionalFilters: [
            {
                field: 'sharingUserIds',
                type: 'contains',
                value: userId,
            },
        ],
    });
    const sharingUserSecrets = useData(carbonConnector.getSecrets, carbonConnector.liveSecrets, {
        spaceId,
        filterQuery: searchValue === '' ? null : searchValue,
        additionalFilters: [
            {
                field: 'sharingUserIds',
                type: 'contains',
                value: userId,
            },
        ],
    });
    const sharingUserCredentials = useData(carbonConnector.getCredentials, carbonConnector.liveCredentials, {
        spaceId,
        filterQuery: searchValue === '' ? null : searchValue,
        additionalFilters: [
            {
                field: 'sharingUserIds',
                type: 'contains',
                value: userId,
            },
        ],
    });
    const sharedUserNotes = sharingUserNotes.status === DataStatus.Success
        ? sharingUserNotes.data.items
        : [];
    const sharedSecureNoteIds = sharedUserNotes.map(({ id }: NoteItemView) => id);
    const { data: secureNoteData } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.SecureNote],
        ids: sharedSecureNoteIds,
    });
    const sharedUserSecrets = sharingUserSecrets.status === DataStatus.Success
        ? sharingUserSecrets.data.items
        : [];
    const sharedSecretIds = sharedUserSecrets.map(({ id }: SecretItemView) => id);
    const { data: secretData } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Secret],
        ids: sharedSecretIds,
    });
    useEffect(() => {
        if (sharingUserNotes.status === DataStatus.Loading ||
            sharingUserSecrets.status === DataStatus.Loading ||
            sharingUserCredentials.status === DataStatus.Loading) {
            setIsLoading(true);
        }
        else {
            setIsLoading(false);
        }
    }, [sharingUserNotes, sharingUserSecrets, sharingUserCredentials]);
    useEffect(() => {
        if (sharingUserNotes.status === DataStatus.Success &&
            sharingUserSecrets.status === DataStatus.Success &&
            sharingUserCredentials.status === DataStatus.Success &&
            sharingUserNotes.data.items.length === 0 &&
            sharingUserSecrets.data.items.length === 0 &&
            sharingUserCredentials.data.items.length === 0 &&
            searchValue === '') {
            onClose();
        }
    }, [sharingUserNotes, sharingUserSecrets, sharingUserCredentials, onClose]);
    return (<Panel onNavigateOut={onClose} ignoreClickOutsideClassName={allIgnoreClickOutsideClassName}>
      <PanelHeader icon={<AvatarWithAbbreviatedText email={userId} avatarSize={98} placeholderFontSize={40} placeholderTextType="firstTwoCharacters" avatarStyleOptions={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
            }}/>} title={userId}/>
      <PanelBody input={<TextInput aria-label={translate(I18N_KEYS.ITEMS_SEARCH)} placeholder={translate(I18N_KEYS.ITEMS_SEARCH)} onChange={(e) => setSearchValue(e.target.value)} prefixIcon={<SearchIcon />}/>}>
        {filteredCollections.length ? (<ContentCard title={translate(I18N_KEYS.COLLECTIONS_HEADER)} additionalSx={{ mb: '12px' }}>
            <ItemsList collections={filteredCollections} credentials={[]} notes={[]} secrets={[]} entity={{
                type: 'user',
                alias: userId,
            }}/>
          </ContentCard>) : null}
        {isLoading ? (<LoadingSpinner size={30} containerStyle={{
                height: '100%',
            }}/>) : (<ContentCard title={translate(I18N_KEYS.ITEMS_HEADER)}>
            <ItemsList credentials={sharingUserCredentials.status === DataStatus.Success
                ? sharingUserCredentials.data.items
                : []} notes={secureNoteData?.secureNotesResult.items ?? []} secrets={secretData?.secretsResult.items ?? []} entity={{
                type: 'user',
                alias: userId,
            }}/>
          </ContentCard>)}
      </PanelBody>
      <BottomPanelBar onClose={onClose} selectedUsers={[userId]}/>
    </Panel>);
};
