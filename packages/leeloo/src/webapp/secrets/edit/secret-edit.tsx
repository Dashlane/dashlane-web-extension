import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  Secret,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import {
  DataStatus,
  useModuleQueries,
  useModuleQuery,
} from "@dashlane/framework-react";
import { GroupRecipient, UserRecipient } from "@dashlane/communication";
import { Permission, sharingItemsApi } from "@dashlane/sharing-contracts";
import { PageView } from "@dashlane/hermes";
import { useProtectedItemsUnlocker } from "../../unlock-items";
import { logPageView } from "../../../libs/logs/logEvent";
import { PreviousPage, previousRoute } from "../../routes";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { SecretEditPanelComponent } from "./secret-edit-component";
interface Props {
  match: {
    params: {
      uuid: string;
    };
  };
  location?: {
    pathname: string;
    state: {
      previousPage?: PreviousPage;
      entity: UserRecipient | GroupRecipient;
    };
  };
}
interface PropsWithSecret extends Props {
  secret: Secret;
}
const SecretEditComponent = (props: PropsWithSecret) => {
  const { secret } = props;
  const unlockerProps = useProtectedItemsUnlocker();
  useEffect(() => {
    logPageView(PageView.ItemSecretDetails);
  }, [secret]);
  const {
    getPermissionForItem,
    getSharingStatusForItem,
    getIsLastAdminForItem,
  } = useModuleQueries(
    sharingItemsApi,
    {
      getPermissionForItem: {
        queryParam: {
          itemId: secret.id,
        },
      },
      getSharingStatusForItem: {
        queryParam: {
          itemId: secret.id,
        },
      },
      getIsLastAdminForItem: {
        queryParam: {
          itemId: secret.id,
        },
      },
    },
    []
  );
  if (
    getPermissionForItem.status !== DataStatus.Success ||
    getSharingStatusForItem.status !== DataStatus.Success ||
    getIsLastAdminForItem.status !== DataStatus.Success
  ) {
    return null;
  }
  const { isShared, isSharedViaUserGroup } = getSharingStatusForItem.data;
  const { isLastAdmin } = getIsLastAdminForItem.data;
  return (
    <SecretEditPanelComponent
      {...props}
      {...unlockerProps}
      isShared={isShared}
      isAdmin={
        isShared && getPermissionForItem.data.permission === Permission.Admin
      }
      isSharedViaUserGroup={isSharedViaUserGroup}
      isLastAdmin={isLastAdmin}
    />
  );
};
export const SecretEditPanel = (props: Props) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { data, status } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Secret],
    ids: [`{${props.match.params.uuid}}`],
  });
  if (status === DataStatus.Loading) {
    return null;
  }
  if (!data?.secretsResult.items.length) {
    if (!props.location?.state) {
      return <Redirect to={routes.userSecrets} />;
    }
    return <Redirect to={previousRoute(props.location.state, routes)} />;
  }
  return (
    <SecretEditComponent {...props} secret={data.secretsResult.items[0]} />
  );
};
