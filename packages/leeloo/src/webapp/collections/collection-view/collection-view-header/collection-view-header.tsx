import { useState } from "react";
import {
  Button,
  DropdownContent,
  DropdownMenu,
  DropdownTriggerButton,
  Heading,
  Icon,
} from "@dashlane/design-system";
import { ShareableCollection } from "@dashlane/sharing-contracts";
import { SpaceAndSharingIconsRow } from "../../../components/space-and-sharing-icons/space-and-sharing-icons-row";
import { Header } from "../../../components/header/header";
import { AccountMenuAndBellNotifications } from "./account-menu-and-bell-notifications";
import { DeleteButton } from "./delete-button";
import { EditButton } from "./edit-button";
import { SharedAccessButton } from "./shared-access-button";
import { ShareCollectionButton } from "./share-collection-button";
import {
  AddItemsDialog,
  DeleteDialog,
  EditDialog,
  SharedAccessDialog,
} from "../dialogs";
import { useFeatureFlip } from "@dashlane/framework-react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { MultiselectProvider } from "../../../list-view/multi-select";
type Props = Omit<ShareableCollection, "vaultItems"> & {
  isPersonalSpaceDisabled: boolean;
  vaultItemsIds: string[];
};
export const CollectionViewHeader = ({
  isShared = false,
  isPersonalSpaceDisabled,
  vaultItemsIds,
  ...collection
}: Props) => {
  const [isSharedAccessDialogOpen, setIsSharedAccessDialogOpen] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddItemsDialogOpen, setIsAddItemsDialogOpen] = useState(false);
  const isAddToCollectionFFEnabled = useFeatureFlip(
    "sharingVault_web_bulkaddtocollection_dev"
  );
  const { translate } = useTranslate();
  return (
    <Header
      sx={{ marginRight: "16px" }}
      startWidgets={
        <SpaceAndSharingIconsRow
          isShared={isShared}
          spaceId={isPersonalSpaceDisabled ? undefined : collection.spaceId}
        >
          <Heading
            as="h1"
            textStyle="ds.title.section.large"
            color="ds.text.neutral.catchy"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {collection.name}
          </Heading>
        </SpaceAndSharingIconsRow>
      }
      endWidget={
        <>
          {isAddToCollectionFFEnabled && (
            <Button
              icon={<Icon name="ActionAddOutlined" />}
              layout="iconLeading"
              onClick={() => setIsAddItemsDialogOpen(true)}
            >
              {translate("webapp_collection_bulk_action_add_items")}
            </Button>
          )}
          {collection?.spaceId ? (
            <ShareCollectionButton id={collection.id} />
          ) : null}
          <DropdownMenu align="end">
            <DropdownTriggerButton
              aria-label="More"
              icon="ActionMoreOutlined"
              layout="iconOnly"
              mood="neutral"
              intensity="quiet"
              id="collection-action-more"
            />
            <DropdownContent>
              {isShared ? (
                <SharedAccessButton
                  id={collection.id}
                  setIsSharedAccessDialogOpen={setIsSharedAccessDialogOpen}
                />
              ) : null}
              <EditButton
                setIsEditDialogOpen={setIsEditDialogOpen}
                {...collection}
              />
              <DeleteButton
                id={collection.id}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              />
            </DropdownContent>
          </DropdownMenu>
          {AccountMenuAndBellNotifications}

          <SharedAccessDialog
            isOpen={isSharedAccessDialogOpen}
            onClose={() => setIsSharedAccessDialogOpen(false)}
            id={collection.id}
          />

          <EditDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            isShared={isShared}
            {...collection}
          />

          <DeleteDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            isShared={isShared}
            id={collection.id}
            name={collection.name}
            setIsSharedAccessDialogOpen={setIsSharedAccessDialogOpen}
          />

          <MultiselectProvider key={String(isAddItemsDialogOpen)}>
            <AddItemsDialog
              isOpen={isAddItemsDialogOpen}
              onClose={() => setIsAddItemsDialogOpen(false)}
              collectionName={collection.name}
              spaceId={collection.spaceId}
              isSharedCollection={isShared}
              collectionId={collection.id}
              vaulItemsInCollection={vaultItemsIds}
            />
          </MultiselectProvider>
        </>
      }
    />
  );
};
