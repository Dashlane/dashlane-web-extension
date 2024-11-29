import { ClickOrigin } from "@dashlane/hermes";
import {
  CollectionSharingPaywall,
  useCollectionSharingStatus,
} from "../../paywall/paywall/collection-sharing";
export const CollectionsOverviewPaywall = () => {
  const { canShareCollection, hasSharingCollectionPaywall, isAdmin } =
    useCollectionSharingStatus();
  if (!hasSharingCollectionPaywall || !isAdmin) {
    return null;
  }
  return (
    <CollectionSharingPaywall
      canShareCollection={canShareCollection}
      sx={{
        margin: "16px 32px",
      }}
      clickOrigin={
        canShareCollection
          ? ClickOrigin.CollectionsSharingStarterLimitCloseToBeReachedMain
          : ClickOrigin.CollectionsSharingStarterLimitReachedMain
      }
    />
  );
};
