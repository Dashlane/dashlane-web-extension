import { GroupThumbnail } from "@dashlane/design-system";
import {
  CollectionSelectOrigin,
  UserSelectCollectionEvent,
} from "@dashlane/hermes";
import { useSharedCollectionsData } from "../../../../libs/carbon/hooks/useSharedCollections";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { ActionsMenu } from "../../../sidemenu/collections-menu/actions-menu";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import { useSearchContext } from "../../search-context";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultCollectionItemProps } from "../shared/types";
const I18N_KEYS = {
  COLLECTION_ITEM_COUNT:
    "webapp_search_collection_description_item_count_plural",
  COLLECTION_ITEM_COUNT_ZERO:
    "webapp_search_collection_description_item_count_zero",
  SHARED_WITH_PEOPLE_COUNT:
    "webapp_search_collection_description_shared_with_people_count_plural",
  SHARED_WITH_GROUP_COUNT:
    "webapp_search_collection_description_shared_with_group_count_plural",
};
export const CollectionItem = ({
  item: collection,
}: SearchResultCollectionItemProps) => {
  const sharingStatus = useSharedCollectionsData([collection.id]);
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logEvent(
      new UserSelectCollectionEvent({
        collectionId: collection.id,
        collectionSelectOrigin: CollectionSelectOrigin.SearchResults,
      })
    );
    closeSearch();
    redirect(routes.userCollection(collection.id));
  };
  const sharingUserCount = sharingStatus[0]?.users?.length ?? 0;
  const sharingGroupCount = sharingStatus[0]?.userGroups?.length ?? 0;
  const isShared = sharingUserCount + sharingGroupCount > 0;
  const description: string = [
    collection.vaultItems.length
      ? translate(I18N_KEYS.COLLECTION_ITEM_COUNT, {
          count: collection.vaultItems.length,
        })
      : translate(I18N_KEYS.COLLECTION_ITEM_COUNT_ZERO),
    sharingUserCount > 0
      ? translate(I18N_KEYS.SHARED_WITH_PEOPLE_COUNT, {
          count: sharingUserCount,
        })
      : undefined,
    sharingGroupCount > 0
      ? translate(I18N_KEYS.SHARED_WITH_GROUP_COUNT, {
          count: sharingGroupCount,
        })
      : undefined,
  ]
    .filter((text) => !!text)
    .join(" • ");
  const actions = (
    <ActionsMenu
      collection={collection}
      triggerButton={{
        mood: "brand",
        intensity: "supershy",
        size: "small",
      }}
    />
  );
  return (
    <BaseResultItem
      id={collection.id}
      title={collection.name}
      description={description}
      onClick={onClick}
      thumbnail={<GroupThumbnail type="collection" />}
      actions={actions}
      icons={isShared ? ["SharedOutlined"] : undefined}
    />
  );
};
