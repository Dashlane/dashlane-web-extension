import { useState } from "react";
import {
  Checkbox,
  Heading,
  IndeterminateLoader,
  SearchField,
} from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  DialogBody,
  DialogFooter,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import {
  SortDirection,
  VaultItemType,
  vaultSearchApi,
} from "@dashlane/vault-contracts";
import { useSubscriptionCode } from "../../../libs/hooks/use-subscription-code";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import { useTeamSpaceContext } from "../../../team/settings/components/TeamSpaceContext";
import { ShareInviteCredentialsList } from "../credentials/credentials-list";
import { useSharedItemIds } from "../hooks/useSharedItemIds";
import { useSharingCapacity } from "../hooks/useSharingCapacity";
import { ItemsTabs, SharingInviteStep } from "../types";
import { NotesList } from "../notes/notes-list";
import { ElementsStepTabs } from "./elements-tabs";
import { SecretsList } from "../secrets/secrets-list";
import { ShareCollectionInfo } from "../../notifications/share-collection-info";
const PAGE_SIZE = 20;
const I18N_KEYS = {
  CLEAR: "webapp_sharing_invite_clear",
  LIMIT_BANNER: "webapp_sharing_invite_free_limit_reached_banner_markup",
  NEXT: "webapp_sharing_invite_next",
  SEARCH_PLACEHOLDER: "webapp_sharing_invite_elements_placeholder",
  SHOW_SELECTED: "webapp_sharing_invite_only_show_selected_elements",
  TITLE: "webapp_sharing_invite_select_elements_title",
};
const freeLimitReachedSx: ThemeUIStyleObject = {
  backgroundColor: "ds.container.expressive.brand.catchy.active",
  color: "ds.text.inverse.catchy",
  lineHeight: "20px",
  padding: "8px 16px",
  width: "100%",
  marginBottom: "24px",
  a: {
    color: "ds.text.inverse.catchy",
    textDecoration: "underline",
    ":focus,:hover,:active": {
      color: "ds.text.inverse.standard",
    },
  },
};
export interface ElementsStepProps {
  elementsOnlyShowSelected: boolean;
  goToStep: (step: SharingInviteStep) => void;
  selectedCredentials: string[];
  selectedNotes: string[];
  selectedSecrets: string[];
  selectNotesTab: () => void;
  selectSecretsTab: () => void;
  selectPasswordsTab: () => void;
  setElementsOnlyShowSelected: React.ChangeEventHandler<HTMLInputElement>;
  tab: ItemsTabs;
}
export const ElementsStep = ({
  elementsOnlyShowSelected,
  selectedCredentials,
  selectedNotes,
  selectedSecrets,
  goToStep,
  selectNotesTab,
  selectSecretsTab,
  selectPasswordsTab,
  setElementsOnlyShowSelected,
  tab,
}: ElementsStepProps) => {
  const subscriptionCode = useSubscriptionCode();
  const { currentSpaceId } = useTeamSpaceContext();
  const [query, setQuery] = useState<string>("");
  const { routes } = useRouterGlobalSettingsContext();
  const sharedItemIds = useSharedItemIds();
  const sharingCapacity = useSharingCapacity();
  const { translate } = useTranslate();
  const [pageNumber, setPageNumber] = useState(1);
  const { data, status } = useModuleQuery(vaultSearchApi, "search", {
    searchQuery: query,
    vaultItemTypes: [
      VaultItemType.Credential,
      VaultItemType.SecureNote,
      VaultItemType.Secret,
    ],
    pageNumber: 1,
    pageSize: PAGE_SIZE * pageNumber,
    propertyFilters:
      currentSpaceId !== null
        ? [
            {
              property: "spaceId",
              value: currentSpaceId,
            },
          ]
        : undefined,
    propertySorting: {
      property: "title",
      direction: SortDirection.Ascend,
    },
    ids: elementsOnlyShowSelected
      ? [...selectedCredentials, ...selectedNotes, ...selectedSecrets]
      : undefined,
  });
  if (status !== DataStatus.Success) {
    return null;
  }
  if (!sharingCapacity) {
    return <IndeterminateLoader mood="brand" />;
  }
  const upgradeTargetPlanUrl = routes.userGoPremium(
    subscriptionCode ?? "",
    "monthly"
  );
  const search = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(event.currentTarget.value);
  const isFreeLimitReached = (): boolean => {
    if (sharingCapacity.type === "unlimited") {
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
  const hasSelection =
    selectedNotes.length > 0 ||
    selectedCredentials.length > 0 ||
    selectedSecrets.length > 0;
  const displayCheckbox = hasSelection || elementsOnlyShowSelected;
  return (
    <>
      <Heading as="h1" sx={{ mb: "16px" }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      {selectedCredentials.length + selectedNotes.length > 1 && (
        <ShareCollectionInfo />
      )}
      <DialogBody>
        <div sx={{ height: "auto" }}>
          <ElementsStepTabs
            selectedCredentials={selectedCredentials}
            selectedNotes={selectedNotes}
            selectedSecrets={selectedSecrets}
            selectNotesTab={selectNotesTab}
            selectSecretsTab={selectSecretsTab}
            selectPasswordsTab={selectPasswordsTab}
            tab={tab}
          />
          <section sx={{ marginBottom: "8px" }}>
            <SearchField
              label={translate(I18N_KEYS.SEARCH_PLACEHOLDER)}
              aria-label={translate(I18N_KEYS.SEARCH_PLACEHOLDER)}
              placeholder={translate(I18N_KEYS.SEARCH_PLACEHOLDER)}
              role="search"
              autoFocus
              onChange={search}
            />
          </section>

          {tab === ItemsTabs.Passwords ? (
            <ShareInviteCredentialsList
              elementsOnlyShowSelected={elementsOnlyShowSelected}
              credentials={data.credentialsResult.items}
              credentialsMatchCount={data.credentialsResult.matchCount}
              setPageNumber={setPageNumber}
            />
          ) : null}
          {tab === ItemsTabs.SecureNotes ? (
            <NotesList
              elementsOnlyShowSelected={elementsOnlyShowSelected}
              freeLimitReached={freeLimitReached}
              secureNotes={data.secureNotesResult.items}
              secureNotesMatchCount={data.secureNotesResult.matchCount}
              setPageNumber={setPageNumber}
            />
          ) : null}
          {tab === ItemsTabs.Secrets ? (
            <SecretsList
              elementsOnlyShowSelected={elementsOnlyShowSelected}
              freeLimitReached={freeLimitReached}
              secrets={data.secretsResult.items}
              secretsMatchCount={data.secretsResult.matchCount}
              setPageNumber={setPageNumber}
            />
          ) : null}
        </div>
      </DialogBody>
      {freeLimitReached ? (
        <div sx={freeLimitReachedSx}>
          {translate.markup(
            I18N_KEYS.LIMIT_BANNER,
            { link: upgradeTargetPlanUrl },
            { linkTarget: "_blank" }
          )}
        </div>
      ) : null}
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.NEXT)}
        primaryButtonOnClick={() => goToStep(SharingInviteStep.Recipients)}
        primaryButtonProps={{ disabled: !hasSelection, type: "button" }}
      >
        {displayCheckbox ? (
          <Checkbox
            checked={elementsOnlyShowSelected}
            label={translate(I18N_KEYS.SHOW_SELECTED)}
            onChange={setElementsOnlyShowSelected}
            sx={{ ml: "0", mr: "auto", pr: "16px" }}
          />
        ) : null}
      </DialogFooter>
    </>
  );
};
