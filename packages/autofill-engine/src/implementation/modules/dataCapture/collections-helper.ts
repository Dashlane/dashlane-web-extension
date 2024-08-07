import { Collection, OperationType } from "@dashlane/vault-contracts";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import { firstValueFrom } from "rxjs";
import { Permission, ShareableCollection } from "@dashlane/sharing-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { CreateCredentialResult } from "@dashlane/communication";
import { WebcardCollectionData } from "../../../types";
import { boolean } from "zod";
export const retriveLocalAndSharedCollections = async (
  context: AutofillEngineContext
): Promise<Array<WebcardCollectionData>> => {
  const collectionResult = await firstValueFrom(
    context.connectors.grapheneClient.vaultOrganization.queries.queryCollections(
      {}
    )
  );
  const sharedCollectionResult = await firstValueFrom(
    context.connectors.grapheneClient.sharingCollections.queries.sharedCollectionsWithItems()
  );
  const collections: Collection[] = isSuccess(collectionResult)
    ? getSuccess(collectionResult).collections
    : [];
  const sharedCollections = isSuccess(sharedCollectionResult)
    ? getSuccess(sharedCollectionResult)
    : [];
  const webcardCollectionsData = [...collections, ...sharedCollections].map(
    (collection: Collection | ShareableCollection): WebcardCollectionData => {
      if ("isShared" in collection) {
        return collection as WebcardCollectionData;
      }
      return { ...collection, isShared: false };
    }
  );
  return webcardCollectionsData.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
};
const updateSharedCollection = async (
  context: AutofillEngineContext,
  selectedCollection: WebcardCollectionData,
  credentialToAdd: CreateCredentialResult
) => {
  const collectionPermission = {
    collectionId: selectedCollection.id,
    permission: Permission.Admin,
  };
  await context.connectors.grapheneClient.sharingCollections.commands.addItemsToCollections(
    {
      collectionPermissions: [collectionPermission],
      itemIds: [credentialToAdd.credentialId],
    }
  );
};
const updateLocalCollection = async (
  context: AutofillEngineContext,
  selectedCollection: WebcardCollectionData,
  credentialToAdd: CreateCredentialResult
) => {
  await context.connectors.grapheneClient.vaultOrganization.commands.updateCollection(
    {
      id: selectedCollection.id,
      collection: {
        vaultItems: [
          {
            id: credentialToAdd.credentialId,
          },
        ],
      },
      operationType: OperationType.APPEND_VAULT_ITEMS,
    }
  );
};
export const updateCollection = async (
  context: AutofillEngineContext,
  selectedCollection: WebcardCollectionData,
  credentialToAdd: CreateCredentialResult
) => {
  const updateCollectionPromise = selectedCollection.isShared
    ? updateSharedCollection(context, selectedCollection, credentialToAdd)
    : updateLocalCollection(context, selectedCollection, credentialToAdd);
  await updateCollectionPromise;
};
