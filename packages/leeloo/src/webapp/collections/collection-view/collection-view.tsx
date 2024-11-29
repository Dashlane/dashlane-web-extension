import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { ClickOrigin, PageView } from "@dashlane/hermes";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Collection } from "@dashlane/vault-contracts";
import { useIsPersonalSpaceDisabled } from "../../../libs/hooks/use-is-personal-space-disabled";
import { logPageView } from "../../../libs/logs/logEvent";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { useTeamSpaceContext } from "../../../team/settings/components/TeamSpaceContext";
import { CredentialsListView } from "../../credentials/list/credentials-list-view";
import { CredentialsProvider } from "../../credentials/credentials-view/credentials-context";
import { SharingProvider } from "../../credentials/credentials-view/sharing-context";
import { HasCredentialsProvider } from "../../credentials/credentials-view/has-credentials-context";
import { MultiselectProvider } from "../../list-view/multi-select";
import {
  CollectionSharingPaywall,
  useCollectionSharingStatus,
} from "../../paywall/paywall/collection-sharing";
import { useCollectionsContext } from "../collections-context";
import { ItemsTabs } from "../../sharing-invite/types";
import { CollectionViewHeader } from "./collection-view-header";
import { CollectionEmptyView } from "./collection-empty-view";
import { SecureNotesListView } from "../../secure-notes/list/secure-notes-list-view";
import { SecureNotesProvider } from "../../secure-notes/secure-notes-view/secure-notes-context";
import { CollectionToggleView } from "./collection-view-header/collection-toggle-view";
import { BaseLayout } from "../../layout/base-layout";
interface RouteParams {
  collectionId: string;
}
const collectionIdFilter = (collectionId: string) => (collection: Collection) =>
  collection.id === collectionId;
export const CollectionView = () => {
  const { routes } = useRouterGlobalSettingsContext();
  const collectionId = `{${useParams<RouteParams>().collectionId}}`;
  const { currentSpaceId } = useTeamSpaceContext();
  const {
    collections,
    sharedCollections,
    isCollectionsLoading,
    updateActiveCollection,
  } = useCollectionsContext();
  const { canShareCollection, hasSharingCollectionPaywall, isAdmin } =
    useCollectionSharingStatus();
  const isPersonalSpaceDisabledResult = useIsPersonalSpaceDisabled();
  const [tab, setTab] = useState(ItemsTabs.Passwords);
  useEffect(() => {
    logPageView(PageView.CollectionDetails);
    return () => updateActiveCollection(null);
  }, []);
  if (
    isCollectionsLoading ||
    isPersonalSpaceDisabledResult.status !== DataStatus.Success
  ) {
    return null;
  }
  const filterForId = collectionIdFilter(collectionId);
  const collection =
    collections.find(filterForId) ?? sharedCollections.find(filterForId);
  if (
    !collection ||
    (currentSpaceId !== null && collection.spaceId !== currentSpaceId)
  ) {
    return <Redirect to={routes.userCredentials} />;
  }
  updateActiveCollection(collection);
  const { vaultItems, ...rest } = collection;
  return (
    <CredentialsProvider ids={vaultItems.map((vaultItem) => vaultItem.id)}>
      <SharingProvider>
        <SecureNotesProvider ids={vaultItems.map((vaultItem) => vaultItem.id)}>
          {hasSharingCollectionPaywall && isAdmin ? (
            <CollectionSharingPaywall
              canShareCollection={canShareCollection}
              sx={{ margin: "24px" }}
              clickOrigin={
                canShareCollection
                  ? ClickOrigin.CollectionsSharingStarterLimitCloseToBeReachedMain
                  : ClickOrigin.CollectionsSharingStarterLimitReachedMain
              }
            />
          ) : null}

          <BaseLayout
            header={
              <CollectionViewHeader
                isPersonalSpaceDisabled={
                  isPersonalSpaceDisabledResult.isDisabled
                }
                vaultItemsIds={vaultItems.map((vaultItem) => vaultItem.id)}
                {...rest}
              />
            }
          >
            {vaultItems.length > 0 ? (
              <HasCredentialsProvider>
                <MultiselectProvider>
                  <CollectionToggleView
                    isNotesViewDisplayed={tab === ItemsTabs.SecureNotes}
                    setTab={setTab}
                  />
                  {tab === ItemsTabs.SecureNotes ? (
                    <div
                      sx={{
                        marginLeft: "42px",
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <SecureNotesListView withLayout={false} />
                    </div>
                  ) : (
                    <CredentialsListView withLayout={false} />
                  )}
                </MultiselectProvider>
              </HasCredentialsProvider>
            ) : (
              <CollectionEmptyView />
            )}
          </BaseLayout>
        </SecureNotesProvider>
      </SharingProvider>
    </CredentialsProvider>
  );
};
