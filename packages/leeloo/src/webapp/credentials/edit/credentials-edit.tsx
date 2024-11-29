import { Redirect } from "react-router-dom";
import { GroupRecipient, UserRecipient } from "@dashlane/communication";
import {
  DataStatus,
  useModuleQueries,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  Credential,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { Permission, sharingItemsApi } from "@dashlane/sharing-contracts";
import {
  autofillSettingsApi,
  linkedWebsitesApi,
} from "@dashlane/autofill-contracts";
import { useSpaces } from "../../../libs/carbon/hooks/useSpaces";
import { useGetItemIdsInSharedCollectionsData } from "../../../libs/hooks/use-are-items-in-shared-collection";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { PreviousPage, previousRoute } from "../../routes";
import { useProtectedItemsUnlocker } from "../../unlock-items";
import { CredentialEditPanelComponent } from "./credentials-edit-component";
interface State {
  previousPage?: PreviousPage;
  entity: UserRecipient | GroupRecipient;
}
interface Props {
  match: {
    params: {
      uuid: string;
    };
  };
  location?: {
    pathname: string;
    state: State;
  };
  onClose: () => void;
}
interface PropsWithCredential extends Props {
  credential: Credential;
}
const CredentialEditComponent = (props: PropsWithCredential) => {
  const { credential } = props;
  const activeSpacesResult = useSpaces();
  const unlockerProps = useProtectedItemsUnlocker();
  const itemsInCollections = useGetItemIdsInSharedCollectionsData([
    credential.id,
  ]);
  const dashlaneDefinedLinkedWebsitesResult = useModuleQuery(
    linkedWebsitesApi,
    "getDashlaneDefinedLinkedWebsites",
    {
      url: credential.URL,
    }
  );
  const credentialPreferencesResult = useModuleQuery(
    autofillSettingsApi,
    "getPreferencesForCredentials",
    {
      credentialIds: [credential.id],
    }
  );
  const {
    getPermissionForItem,
    getSharingStatusForItem,
    getIsLastAdminForItem,
  } = useModuleQueries(
    sharingItemsApi,
    {
      getPermissionForItem: {
        queryParam: {
          itemId: credential.id,
        },
      },
      getSharingStatusForItem: {
        queryParam: {
          itemId: credential.id,
        },
      },
      getIsLastAdminForItem: {
        queryParam: {
          itemId: credential.id,
        },
      },
    },
    []
  );
  if (
    credentialPreferencesResult.status !== DataStatus.Success ||
    dashlaneDefinedLinkedWebsitesResult.status !== DataStatus.Success ||
    getPermissionForItem.status !== DataStatus.Success ||
    getSharingStatusForItem.status !== DataStatus.Success ||
    activeSpacesResult.status !== DataStatus.Success ||
    getIsLastAdminForItem.status !== DataStatus.Success
  ) {
    return null;
  }
  const { isShared, isSharedViaUserGroup } = getSharingStatusForItem.data;
  const { isLastAdmin } = getIsLastAdminForItem.data;
  const isItemInCollection = !!itemsInCollections.length;
  return (
    <CredentialEditPanelComponent
      {...props}
      {...unlockerProps}
      activeSpaces={activeSpacesResult.data}
      dashlaneDefinedLinkedWebsites={dashlaneDefinedLinkedWebsitesResult.data}
      credentialPreferences={credentialPreferencesResult.data[0]}
      isShared={isShared}
      isAdmin={
        isShared && getPermissionForItem.data.permission === Permission.Admin
      }
      isSharedViaUserGroup={isSharedViaUserGroup}
      isItemInCollection={isItemInCollection}
      isLastAdmin={isLastAdmin}
    />
  );
};
export const CredentialEditPanel = (props: Props) => {
  const { data, status } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Credential],
    ids: [`{${props.match.params.uuid}}`],
  });
  const { routes } = useRouterGlobalSettingsContext();
  if (status === DataStatus.Loading) {
    return null;
  }
  if (!data?.credentialsResult.items.length) {
    if (!props.location?.state) {
      return <Redirect to={routes.userCredentials} />;
    }
    return <Redirect to={previousRoute(props.location?.state, routes)} />;
  }
  return (
    <CredentialEditComponent
      {...props}
      credential={data.credentialsResult.items[0]}
    />
  );
};
