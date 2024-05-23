import { Fragment, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { CredentialFilterCriterium, CredentialSortCriterium, NoteFilterCriterium, NoteSortCriterium, } from '@dashlane/communication';
import { Button, TextInput } from '@dashlane/design-system';
import { useModuleQuery } from '@dashlane/framework-react';
import { Checkbox, DialogBody, DialogFooter, Heading, jsx, LoadingIcon, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { SortDirection, VaultItemType, vaultSearchApi, } from '@dashlane/vault-contracts';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { CredentialsList } from 'webapp/sharing-invite/credentials/credentials';
import { useCredentialsCount } from 'webapp/sharing-invite/hooks/useItemsCount';
import { useSharedItemIds } from 'webapp/sharing-invite/hooks/useSharedItemIds';
import { useSharingCapacity } from 'webapp/sharing-invite/hooks/useSharingCapacity';
import { ItemsTabs, SharingInviteStep } from '../types';
import { SHARING_INVITE_CONTENT_HEIGHT } from '../item';
import { NotesList } from '../notes/notes-list';
import { ElementsStepTabs } from './elements-tabs';
import { SecretsList } from '../secrets/secrets-list';
const DEBOUNCE_DELAY_MS = 100;
const SHARING_INVITE_SEARCH_HEIGHT = '50px';
const SHARING_INVITE_TABS_HEIGHT = '48px';
const SHARING_INVITE_FREE_LIMIT_HEIGHT = '36px';
const ELEMENTS_HEIGHT = `calc(${SHARING_INVITE_CONTENT_HEIGHT} - ${SHARING_INVITE_TABS_HEIGHT} - ${SHARING_INVITE_SEARCH_HEIGHT})`;
const ELEMENTS_HEIGHT_WITH_FREE_LIMIT = `calc(${SHARING_INVITE_CONTENT_HEIGHT} - ${SHARING_INVITE_TABS_HEIGHT} - ${SHARING_INVITE_SEARCH_HEIGHT} - ${SHARING_INVITE_FREE_LIMIT_HEIGHT})`;
const I18N_KEYS = {
    CLEAR: 'webapp_sharing_invite_clear',
    LIMIT_BANNER: 'webapp_sharing_invite_free_limit_reached_banner_markup',
    NEXT: 'webapp_sharing_invite_next',
    SEARCH_PLACEHOLDER: 'webapp_sharing_invite_elements_placeholder',
    SHOW_SELECTED: 'webapp_sharing_invite_only_show_selected_elements',
    TITLE: 'webapp_sharing_invite_select_elements_title',
};
const freeLimitReachedSx: ThemeUIStyleObject = {
    backgroundColor: 'ds.container.expressive.brand.catchy.active',
    color: 'ds.text.inverse.catchy',
    lineHeight: '20px',
    padding: '8px 16px',
    width: '100%',
    marginBottom: '24px',
    a: {
        color: 'ds.text.inverse.catchy',
        textDecoration: 'underline',
        ':focus,:hover,:active': {
            color: 'ds.text.inverse.standard',
        },
    },
};
type FilterCriterium = NoteFilterCriterium & CredentialFilterCriterium;
type SortCriterium = NoteSortCriterium & CredentialSortCriterium;
export interface ElementsStepProps {
    elementsOnlyShowSelected: boolean;
    goToStep: (step: SharingInviteStep) => void;
    onCheckCredential: (credentialId: string, checked: boolean) => void;
    onCheckNote: (noteId: string, checked: boolean) => void;
    onCheckSecret: (secretId: string, checked: boolean) => void;
    selectedCredentials: string[];
    selectedNotes: string[];
    selectedSecrets: string[];
    selectNotesTab: () => void;
    selectSecretsTab: () => void;
    selectPasswordsTab: () => void;
    setElementsOnlyShowSelected: React.ChangeEventHandler<HTMLInputElement>;
    tab: ItemsTabs;
}
export const ElementsStep = ({ elementsOnlyShowSelected, goToStep, onCheckCredential, onCheckNote, onCheckSecret, selectedCredentials, selectedNotes, selectedSecrets, selectNotesTab, selectSecretsTab, selectPasswordsTab, setElementsOnlyShowSelected, tab, }: ElementsStepProps) => {
    const accountInfo = useAccountInfo();
    const credentialsCount = useCredentialsCount();
    const { currentSpaceId } = useTeamSpaceContext();
    const [query, setQuery] = useState<string>('');
    const { routes } = useRouterGlobalSettingsContext();
    const searchField = useRef<HTMLInputElement>(null);
    const sharedItemIds = useSharedItemIds();
    const sharingCapacity = useSharingCapacity();
    const { translate } = useTranslate();
    useEffect(() => {
        if (credentialsCount === 0) {
            selectNotesTab();
        }
    }, []);
    const { data: secureNoteData } = useModuleQuery(vaultSearchApi, 'search', {
        searchQuery: query,
        vaultItemTypes: [VaultItemType.SecureNote],
        propertyFilters: currentSpaceId !== null
            ? [
                {
                    property: 'spaceId',
                    value: currentSpaceId,
                },
            ]
            : undefined,
        propertySorting: {
            property: 'title',
            direction: SortDirection.Ascend,
        },
    });
    const { data: secretData } = useModuleQuery(vaultSearchApi, 'search', {
        searchQuery: query,
        vaultItemTypes: [VaultItemType.Secret],
        propertyFilters: currentSpaceId !== null
            ? [
                {
                    property: 'spaceId',
                    value: currentSpaceId,
                },
            ]
            : undefined,
        propertySorting: {
            property: 'title',
            direction: SortDirection.Ascend,
        },
    });
    if (!secureNoteData || !secretData) {
        return null;
    }
    if (!sharingCapacity) {
        return <LoadingIcon color="ds.text.brand.standard"/>;
    }
    const upgradeTargetPlanUrl = routes.userGoPremium(accountInfo?.subscriptionCode, 'monthly');
    const search = () => {
        const query = searchField.current?.value.trim() ?? '';
        setQuery(query);
    };
    const onInputChange = debounce(search, DEBOUNCE_DELAY_MS);
    const clearSearch = () => {
        if (searchField.current) {
            searchField.current.value = '';
        }
        search();
    };
    const getFilterCriteria = (): FilterCriterium[] => {
        const adminFilterCriterium: FilterCriterium = {
            field: 'isLimited',
            type: 'equals',
            value: false,
        };
        const noAttachmentsFilterCriterium: FilterCriterium = {
            field: 'hasAttachments',
            type: 'equals',
            value: false,
        };
        const queryFilterCriterium: FilterCriterium = {
            type: 'matches',
            value: query,
        };
        const onlySelectedCrit: FilterCriterium = {
            field: 'id',
            type: 'in',
            value: [...selectedCredentials, ...selectedNotes],
        };
        const queryFilterCriteriumArray = query ? [queryFilterCriterium] : [];
        const spaceIdFilterCriteriumArray: FilterCriterium[] = currentSpaceId !== null
            ? [
                {
                    field: 'spaceId',
                    value: currentSpaceId,
                    type: 'equals',
                },
            ]
            : [];
        if (elementsOnlyShowSelected) {
            return [onlySelectedCrit, ...queryFilterCriteriumArray];
        }
        return [
            adminFilterCriterium,
            noAttachmentsFilterCriterium,
            ...queryFilterCriteriumArray,
            ...spaceIdFilterCriteriumArray,
        ];
    };
    const getSortCriteria = (): SortCriterium[] => {
        return [
            {
                field: 'title',
                direction: 'ascend',
            },
        ];
    };
    const isFreeLimitReached = (): boolean => {
        if (sharingCapacity.type === 'unlimited') {
            return false;
        }
        const sharedItemIdsSet = new Set(sharedItemIds);
        const notSharedYetSelectedItems = [
            ...selectedNotes,
            ...selectedCredentials,
        ].filter((i) => !sharedItemIdsSet.has(i));
        return notSharedYetSelectedItems.length >= sharingCapacity.remains;
    };
    const freeLimitReached = isFreeLimitReached();
    const hasSelection = selectedNotes.length > 0 || selectedCredentials.length > 0;
    const displayCheckbox = hasSelection || elementsOnlyShowSelected;
    return (<>
      <Heading as="h1" size="small" sx={{ mb: '16px' }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <DialogBody>
        <div sx={{ height: SHARING_INVITE_CONTENT_HEIGHT }}>
          <ElementsStepTabs selectNotesTab={selectNotesTab} selectSecretsTab={selectSecretsTab} selectPasswordsTab={selectPasswordsTab} selectedCredentials={selectedCredentials} selectedNotes={selectedNotes} selectedSecrets={selectedSecrets} tab={tab}/>
          <section sx={{ marginBottom: '8px' }}>
            <TextInput aria-label={translate(I18N_KEYS.SEARCH_PLACEHOLDER)} placeholder={translate(I18N_KEYS.SEARCH_PLACEHOLDER)} role="search" autoFocus onChange={onInputChange} ref={searchField} actionButtons={query.length > 0
            ? [
                <Button key="clear" intensity="supershy" mood="neutral" size="small" onClick={clearSearch}>
                        {translate(I18N_KEYS.CLEAR)}
                      </Button>,
            ]
            : undefined}/>
          </section>
          <div sx={{
            height: freeLimitReached
                ? ELEMENTS_HEIGHT_WITH_FREE_LIMIT
                : ELEMENTS_HEIGHT,
            minHeight: '100px',
        }}>
            {tab === ItemsTabs.Passwords ? (<CredentialsList elementsOnlyShowSelected={elementsOnlyShowSelected} freeLimitReached={freeLimitReached} onCheckCredential={onCheckCredential} selectedCredentials={selectedCredentials} tokenParams={{
                filterCriteria: getFilterCriteria(),
                sortCriteria: getSortCriteria(),
                initialBatchSize: 10,
            }}/>) : null}
            {tab === ItemsTabs.SecureNotes ? (<NotesList elementsOnlyShowSelected={elementsOnlyShowSelected} freeLimitReached={freeLimitReached} onCheckNote={onCheckNote} selectedNotes={selectedNotes} secureNotes={secureNoteData.secureNotesResult.items}/>) : null}
            {tab === ItemsTabs.Secrets ? (<SecretsList elementsOnlyShowSelected={elementsOnlyShowSelected} freeLimitReached={freeLimitReached} onCheckSecret={onCheckSecret} selectedSecrets={selectedSecrets} secrets={secretData.secretsResult.items}/>) : null}
            {freeLimitReached ? (<div sx={freeLimitReachedSx}>
                {translate.markup(I18N_KEYS.LIMIT_BANNER, { link: upgradeTargetPlanUrl }, { linkTarget: '_blank' })}
              </div>) : null}
          </div>
        </div>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.NEXT)} primaryButtonOnClick={() => goToStep(SharingInviteStep.Recipients)} primaryButtonProps={{ disabled: !hasSelection, type: 'button' }}>
        {displayCheckbox ? (<Checkbox checked={elementsOnlyShowSelected} label={translate(I18N_KEYS.SHOW_SELECTED)} onChange={setElementsOnlyShowSelected} sx={{ marginLeft: '0', marginRight: 'auto', paddingRight: '16px' }}/>) : null}
      </DialogFooter>
    </>);
};
