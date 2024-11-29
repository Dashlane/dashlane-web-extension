import { ChangeEvent, useEffect, useState } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { TextInput } from "@dashlane/design-system";
import { useModuleQuery } from "@dashlane/framework-react";
import { SearchIcon } from "@dashlane/ui-components";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
import { Credential, Secret, SecureNote } from "@dashlane/vault-contracts";
import LoadingSpinner from "../../../../libs/dashlane-style/loading-spinner";
import { useGetCollectionsForUserOrGroupData } from "../../../../libs/hooks/use-get-collections-for-user-or-group";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useTeamSpaceContext } from "../../../../team/settings/components/TeamSpaceContext";
import { ContentCard } from "../../../panel/standard/content-card";
import { Panel, PanelHeader } from "../../../panel";
import GroupAvatar from "../list/group-avatar.svg";
import { MembersList } from "../members-list/members-list";
import { useUserGroup } from "../useUserGroup";
import { useUserGroupMembers } from "../useUserGroupMembers";
import { BottomPanelBar } from "../../layout/bottom-panel-bar/bottom-panel-bar";
import { ItemsList } from "../../shared/items-list/items-list";
import { allIgnoreClickOutsideClassName } from "../../../variables";
import { PanelBody } from "../../layout/panel-body";
import styles from "./group-panel-styles.css";
const I18N_KEYS = {
  COLLECTIONS_HEADER: "webapp_sharing_center_panel_collections_header",
  ITEMS_HEADER: "webapp_sharing_center_panel_items_header",
  PANEL_ITEMS_SHARED: "webapp_sharing_center_panel_items_shared",
  PANEL_MEMBERS: "webapp_sharing_center_panel_members",
  MEMBERS_SEARCH: "webapp_sharing_center_panel_members_search",
  ITEMS_SEARCH: "webapp_sharing_center_panel_items_search",
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
  MEMBERS,
}
const getProperUUID = (paramUUID: string | undefined): string =>
  `{${paramUUID ?? ""}}`;
export const GroupPanel = ({ onClose, match }: GroupPanelProps) => {
  const { currentSpaceId: spaceId } = useTeamSpaceContext();
  const groupId = getProperUUID(match.params?.uuid);
  const [itemSearchValue, setItemSearchValue] = useState("");
  const [memberSearchValue, setMemberSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState(UserGroupTabs.ITEMS);
  const [isLoading, setIsLoading] = useState(false);
  const { translate } = useTranslate();
  const userGroup = useUserGroup(groupId);
  const sharedItemsData = useModuleQuery(
    sharingItemsApi,
    "getUserSharedVaultItems",
    {
      userId: "",
      groupId,
      query: itemSearchValue,
      spaceId,
    }
  );
  const collections = useGetCollectionsForUserOrGroupData(groupId) || [];
  const filteredCollections = !itemSearchValue
    ? collections
    : collections?.filter((collection) =>
        collection.name.toLowerCase().includes(itemSearchValue.toLowerCase())
      ) || [];
  const userGroupMembers = useUserGroupMembers(groupId, memberSearchValue);
  useEffect(() => {
    if (
      userGroup.status === DataStatus.Loading ||
      sharedItemsData.status === DataStatus.Loading
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [userGroup, sharedItemsData]);
  const tabs = [
    {
      id: "tab-items-shared",
      contentId: "content-items-shared",
      title: translate(I18N_KEYS.PANEL_ITEMS_SHARED),
      onSelect: () => {
        setActiveTab(UserGroupTabs.ITEMS);
      },
    },
    {
      id: "tab-members",
      contentId: "content-members",
      title: translate(I18N_KEYS.PANEL_MEMBERS),
      onSelect: () => {
        setActiveTab(UserGroupTabs.MEMBERS);
      },
    },
  ];
  const updateSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (activeTab === UserGroupTabs.ITEMS) {
      setItemSearchValue(event.currentTarget.value);
    } else {
      setMemberSearchValue(event.currentTarget.value);
    }
  };
  const searchInputLabel =
    activeTab === UserGroupTabs.ITEMS
      ? translate(I18N_KEYS.ITEMS_SEARCH)
      : translate(I18N_KEYS.MEMBERS_SEARCH);
  return (
    <Panel
      onNavigateOut={onClose}
      ignoreClickOutsideClassName={allIgnoreClickOutsideClassName}
    >
      <PanelHeader
        icon={
          <img
            src={GroupAvatar}
            width={98}
            height={98}
            className={styles.groupImgIcon}
          />
        }
        title={
          userGroup.status === DataStatus.Success
            ? userGroup.data
              ? userGroup.data.name
              : ""
            : ""
        }
        tabs={tabs}
      />
      <PanelBody
        input={
          <TextInput
            aria-label={searchInputLabel}
            placeholder={searchInputLabel}
            prefixIcon={<SearchIcon />}
            width={300}
            onChange={updateSearchValue}
          />
        }
      >
        {isLoading ? (
          <LoadingSpinner
            size={30}
            containerStyle={{
              height: "100%",
            }}
          />
        ) : activeTab === UserGroupTabs.ITEMS ? (
          <div aria-labelledby="tab-items-shared" id="content-items-shared">
            {filteredCollections.length ? (
              <ContentCard
                title={translate(I18N_KEYS.COLLECTIONS_HEADER)}
                additionalSx={{ mb: "12px" }}
              >
                <ItemsList
                  collections={filteredCollections}
                  credentials={[]}
                  notes={[]}
                  secrets={[]}
                  entity={{
                    type: "userGroup",
                    name:
                      userGroup.status === DataStatus.Success
                        ? userGroup.data?.name
                        : "",
                    groupId,
                  }}
                />
              </ContentCard>
            ) : null}

            <ContentCard title={translate(I18N_KEYS.ITEMS_HEADER)}>
              <ItemsList
                credentials={
                  (sharedItemsData.data?.sharedCredentials as Credential[]) ??
                  []
                }
                notes={
                  (sharedItemsData.data?.sharedSecureNotes as SecureNote[]) ??
                  []
                }
                secrets={
                  (sharedItemsData.data?.sharedSecrets as Secret[]) ?? []
                }
                entity={{
                  type: "userGroup",
                  name:
                    userGroup.status === DataStatus.Success
                      ? userGroup.data?.name
                      : "",
                  groupId,
                }}
              />
            </ContentCard>
          </div>
        ) : (
          <div aria-labelledby="tab-members" id="content-members">
            <MembersList members={userGroupMembers} />
          </div>
        )}
      </PanelBody>
      <BottomPanelBar onClose={onClose} selectedGroups={[groupId]} />
    </Panel>
  );
};
