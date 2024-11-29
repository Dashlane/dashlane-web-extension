import { useEffect, useState } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { TextInput } from "@dashlane/design-system";
import { useModuleQuery } from "@dashlane/framework-react";
import { SearchIcon } from "@dashlane/ui-components";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
import { Credential, Secret, SecureNote } from "@dashlane/vault-contracts";
import { AvatarWithAbbreviatedText } from "../../../../libs/dashlane-style/avatar/avatar-with-abbreviated-text";
import LoadingSpinner from "../../../../libs/dashlane-style/loading-spinner";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useGetCollectionsForUserOrGroupData } from "../../../../libs/hooks/use-get-collections-for-user-or-group";
import { useTeamSpaceContext } from "../../../../team/settings/components/TeamSpaceContext";
import { ContentCard } from "../../../panel/standard/content-card";
import { Panel, PanelHeader } from "../../../panel";
import { ItemsList } from "../../shared/items-list/items-list";
import { allIgnoreClickOutsideClassName } from "../../../variables";
import { BottomPanelBar } from "../../layout/bottom-panel-bar/bottom-panel-bar";
import { PanelBody } from "../../layout/panel-body";
const I18N_KEYS = {
  COLLECTIONS_HEADER: "webapp_sharing_center_panel_collections_header",
  ITEMS_HEADER: "webapp_sharing_center_panel_items_header",
  ITEMS_SEARCH: "webapp_sharing_center_panel_items_search",
  PERMISSION_BUTTON: "webapp_sharing_center_panel_permission_button",
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
  const userId = match.params?.id ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const collections = useGetCollectionsForUserOrGroupData(userId) || [];
  const filteredCollections = !searchValue
    ? collections
    : collections?.filter((collection) =>
        collection.name.toLowerCase().includes(searchValue.toLowerCase())
      ) || [];
  const { translate } = useTranslate();
  const sharedItemsData = useModuleQuery(
    sharingItemsApi,
    "getUserSharedVaultItems",
    {
      userId,
      groupId: "",
      query: searchValue,
      spaceId,
    }
  );
  useEffect(() => {
    if (sharedItemsData.status === DataStatus.Loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [sharedItemsData]);
  useEffect(() => {
    if (
      sharedItemsData.status === DataStatus.Success &&
      !sharedItemsData.data?.sharedCredentials.length &&
      !sharedItemsData.data?.sharedSecureNotes.length &&
      !sharedItemsData.data?.sharedSecrets.length &&
      searchValue === ""
    ) {
      onClose();
    }
  }, [sharedItemsData, searchValue, onClose]);
  return (
    <Panel
      onNavigateOut={onClose}
      ignoreClickOutsideClassName={allIgnoreClickOutsideClassName}
    >
      <PanelHeader
        icon={
          <AvatarWithAbbreviatedText
            email={userId}
            avatarSize={98}
            placeholderFontSize={40}
            placeholderTextType="firstTwoCharacters"
            avatarStyleOptions={{
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          />
        }
        title={userId}
      />
      <PanelBody
        input={
          <TextInput
            aria-label={translate(I18N_KEYS.ITEMS_SEARCH)}
            placeholder={translate(I18N_KEYS.ITEMS_SEARCH)}
            onChange={(e) => setSearchValue(e.target.value)}
            prefixIcon={<SearchIcon />}
          />
        }
      >
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
                type: "user",
                alias: userId,
              }}
            />
          </ContentCard>
        ) : null}
        {isLoading ? (
          <LoadingSpinner
            size={30}
            containerStyle={{
              height: "100%",
            }}
          />
        ) : (
          <ContentCard title={translate(I18N_KEYS.ITEMS_HEADER)}>
            <ItemsList
              credentials={
                (sharedItemsData.data?.sharedCredentials as Credential[]) ?? []
              }
              notes={
                (sharedItemsData.data?.sharedSecureNotes as SecureNote[]) ?? []
              }
              secrets={(sharedItemsData.data?.sharedSecrets as Secret[]) ?? []}
              entity={{
                type: "user",
                alias: userId,
              }}
            />
          </ContentCard>
        )}
      </PanelBody>
      <BottomPanelBar onClose={onClose} selectedUsers={[userId]} />
    </Panel>
  );
};
