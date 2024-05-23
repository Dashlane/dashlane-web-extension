import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { NoteItemView, SecretItemView } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { jsx, TextInput } from '@dashlane/design-system';
import { useModuleQuery } from '@dashlane/framework-react';
import { SearchIcon } from '@dashlane/ui-components';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { carbonConnector } from 'libs/carbon/connector';
import { useData } from 'libs/carbon/hooks/use-item-data';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import { useGetCollectionsForUserOrGroupData } from 'libs/hooks/use-get-collections-for-user-or-group';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { ContentCard } from 'webapp/panel/standard/content-card';
import { Panel, PanelHeader } from 'webapp/panel';
import GroupAvatar from 'webapp/sharing-center/group/list/group-avatar.svg';
import { MembersList } from 'webapp/sharing-center/group/members-list/members-list';
import { useUserGroup } from 'webapp/sharing-center/group/useUserGroup';
import { useUserGroupMembers } from 'webapp/sharing-center/group/useUserGroupMembers';
import { BottomPanelBar } from 'webapp/sharing-center/layout/bottom-panel-bar/bottom-panel-bar';
import { ItemsList } from 'webapp/sharing-center/shared/items-list/items-list';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import { PanelBody } from '../../layout/panel-body';
import styles from './group-panel-styles.css';
const I18N_KEYS = {
    COLLECTIONS_HEADER: 'webapp_sharing_center_panel_collections_header',
    ITEMS_HEADER: 'webapp_sharing_center_panel_items_header',
    PANEL_ITEMS_SHARED: 'webapp_sharing_center_panel_items_shared',
    PANEL_MEMBERS: 'webapp_sharing_center_panel_members',
    MEMBERS_SEARCH: 'webapp_sharing_center_panel_members_search',
    ITEMS_SEARCH: 'webapp_sharing_center_panel_items_search',
};
interface GroupPanelProps {
    match: {
        params?: {
            uuid?: string;
        };
    };
    onClose: () => void;
}
export enum UserGroupTabs {
    ITEMS,
    MEMBERS
}
const getProperUUID = (paramUUID: string | undefined): string => `{${paramUUID ?? ''}}`;
export const GroupPanel = ({ onClose, match }: GroupPanelProps) => {
    const { currentSpaceId: spaceId } = useTeamSpaceContext();
    const groupId = getProperUUID(match.params?.uuid);
    const [itemSearchValue, setItemSearchValue] = useState('');
    const [memberSearchValue, setMemberSearchValue] = useState('');
    const [activeTab, setActiveTab] = useState(UserGroupTabs.ITEMS);
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslate();
    const userGroup = useUserGroup(groupId);
    const userGroupNotes = useData(carbonConnector.getNotes, carbonConnector.liveNotes, {
        spaceId,
        filterQuery: itemSearchValue === '' ? null : itemSearchValue,
        additionalFilters: [
            {
                field: 'groupIds',
                type: 'contains',
                value: groupId,
            },
        ],
    });
    const userGroupSecrets = useData(carbonConnector.getSecrets, carbonConnector.liveSecrets, {
        spaceId,
        filterQuery: itemSearchValue === '' ? null : itemSearchValue,
        additionalFilters: [
            {
                field: 'groupIds',
                type: 'contains',
                value: groupId,
            },
        ],
    });
    const userGroupCredentials = useData(carbonConnector.getCredentials, carbonConnector.liveCredentials, {
        spaceId,
        filterQuery: itemSearchValue === '' ? null : itemSearchValue,
        additionalFilters: [
            {
                field: 'groupIds',
                type: 'contains',
                value: groupId,
            },
        ],
    });
    const collections = useGetCollectionsForUserOrGroupData(groupId) || [];
    const filteredCollections = !itemSearchValue
        ? collections
        : collections?.filter((collection) => collection.name.toLowerCase().includes(itemSearchValue.toLowerCase())) || [];
    const userGroupNotesItems = userGroupNotes.status === DataStatus.Success
        ? userGroupNotes.data.items
        : [];
    const userGroupNotesIds = userGroupNotesItems.map((secureNote: NoteItemView) => secureNote.id);
    const { data: secureNoteData } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.SecureNote],
        ids: userGroupNotesIds,
    });
    const userGroupSecretsItems = userGroupSecrets.status === DataStatus.Success
        ? userGroupSecrets.data.items
        : [];
    const userGroupSecretsIds = userGroupSecretsItems.map((secret: SecretItemView) => secret.id);
    const { data: secretData } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Secret],
        ids: userGroupSecretsIds,
    });
    const userGroupMembers = useUserGroupMembers(groupId, memberSearchValue);
    useEffect(() => {
        if (userGroup.status === DataStatus.Loading ||
            userGroupNotes.status === DataStatus.Loading ||
            userGroupSecrets.status === DataStatus.Loading ||
            userGroupCredentials.status === DataStatus.Loading ||
            userGroupMembers.status === DataStatus.Loading) {
            setIsLoading(true);
        }
        else {
            setIsLoading(false);
        }
    }, [
        userGroup,
        userGroupNotes,
        userGroupSecrets,
        userGroupCredentials,
        userGroupMembers,
    ]);
    const tabs = [
        {
            active: activeTab === UserGroupTabs.ITEMS,
            label: translate(I18N_KEYS.PANEL_ITEMS_SHARED),
            onClick: () => {
                setActiveTab(UserGroupTabs.ITEMS);
            },
        },
        {
            active: activeTab === UserGroupTabs.MEMBERS,
            label: translate(I18N_KEYS.PANEL_MEMBERS),
            onClick: () => {
                setActiveTab(UserGroupTabs.MEMBERS);
            },
        },
    ];
    const updateSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
        if (activeTab === UserGroupTabs.ITEMS) {
            setItemSearchValue(event.currentTarget.value);
        }
        else {
            setMemberSearchValue(event.currentTarget.value);
        }
    };
    const searchInputLabel = activeTab === UserGroupTabs.ITEMS
        ? translate(I18N_KEYS.ITEMS_SEARCH)
        : translate(I18N_KEYS.MEMBERS_SEARCH);
    return (<Panel onNavigateOut={onClose} ignoreClickOutsideClassName={allIgnoreClickOutsideClassName}>
      <PanelHeader icon={<img src={GroupAvatar} width={98} height={98} className={styles.groupImgIcon}/>} title={userGroup.status === DataStatus.Success
            ? userGroup.data
                ? userGroup.data.name
                : ''
            : ''} tabs={tabs}/>
      <PanelBody input={<TextInput aria-label={searchInputLabel} placeholder={searchInputLabel} prefixIcon={<SearchIcon />} width={300} onChange={updateSearchValue}/>}>
        {isLoading ? (<LoadingSpinner size={30} containerStyle={{
                height: '100%',
            }}/>) : activeTab === UserGroupTabs.ITEMS ? (<>
            {filteredCollections.length ? (<ContentCard title={translate(I18N_KEYS.COLLECTIONS_HEADER)} additionalSx={{ mb: '12px' }}>
                <ItemsList collections={filteredCollections} credentials={[]} notes={[]} secrets={[]} entity={{
                    type: 'userGroup',
                    name: userGroup.status === DataStatus.Success
                        ? userGroup.data?.name
                        : '',
                    groupId,
                }}/>
              </ContentCard>) : null}

            <ContentCard title={translate(I18N_KEYS.ITEMS_HEADER)}>
              <ItemsList credentials={userGroupCredentials.status === DataStatus.Success
                ? userGroupCredentials.data.items
                : []} notes={secureNoteData?.secureNotesResult.items ?? []} secrets={secretData?.secretsResult.items ?? []} entity={{
                type: 'userGroup',
                name: userGroup.status === DataStatus.Success
                    ? userGroup.data?.name
                    : '',
                groupId,
            }}/>
            </ContentCard>
          </>) : (<MembersList members={userGroupMembers.status === DataStatus.Success
                ? userGroupMembers.data.items
                : []}/>)}
      </PanelBody>
      <BottomPanelBar onClose={onClose} selectedGroups={[groupId]}/>
    </Panel>);
};
