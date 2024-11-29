import { fromUnixTime } from "date-fns";
import {
  Field,
  ItemType,
  Origin,
  PageView,
  UserCopyVaultItemFieldEvent,
} from "@dashlane/hermes";
import { useToast } from "@dashlane/design-system";
import { Secret, VaultItemType } from "@dashlane/vault-contracts";
import { useModuleQueries } from "@dashlane/framework-react";
import { Permission, sharingItemsApi } from "@dashlane/sharing-contracts";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { useActivityLogReport } from "../../hooks/use-activity-log-report";
import { logSelectSecret } from "../../../libs/logs/events/vault/select-item";
import LocalizedTimeAgo from "../../../libs/i18n/localizedTimeAgo";
import IntelligentTooltipOnOverflow from "../../../libs/dashlane-style/intelligent-tooltip-on-overflow";
import {
  useLocation,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { useIsAllowedToShare } from "../../../libs/hooks/use-is-allowed-to-share";
import useTranslate from "../../../libs/i18n/useTranslate";
import { TranslatorInterface } from "../../../libs/i18n/types";
import { useProtectedItemsUnlocker } from "../../unlock-items";
import { LockedItemType, UnlockerAction } from "../../unlock-items/types";
import { SharingInviteDialog } from "../../sharing-invite/sharing-invite-dialog";
import { SharingLimitReachedDialog } from "../../sharing-invite/limit-reached";
import { SecretTitle } from "./secret-title";
import { SecretQuickActions } from "./secret-quick-actions";
import { getSecretSharing } from "../../sharing-invite/helpers";
import { useDialog } from "../../dialog";
import Row from "../../list-view/row";
import styles from "../styles.css";
const displayCreatedAt = (
  translate: TranslatorInterface,
  { creationDatetime }: Secret
): React.ReactNode => {
  return creationDatetime ? (
    <IntelligentTooltipOnOverflow>
      {translate.shortDate(fromUnixTime(creationDatetime))}
    </IntelligentTooltipOnOverflow>
  ) : null;
};
const displayUpdatedAt = ({
  userModificationDatetime,
}: Secret): React.ReactNode => {
  return userModificationDatetime ? (
    <IntelligentTooltipOnOverflow>
      <LocalizedTimeAgo date={fromUnixTime(userModificationDatetime)} />
    </IntelligentTooltipOnOverflow>
  ) : null;
};
interface Props {
  secret: Secret;
}
export const SecretRow = ({ secret }: Props) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { pathname } = useLocation();
  const { showToast } = useToast();
  const { openDialog, closeDialog } = useDialog();
  const isAllowedToShare = useIsAllowedToShare();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { logCopiedSecretContent } = useActivityLogReport();
  const isSecretLocked = secret.isSecured && !areProtectedItemsUnlocked;
  const hasTeamSpaceId = Boolean(secret.spaceId);
  const { translate } = useTranslate();
  const {
    getPermissionForItem: getPermissionForItemResult,
    sharingEnabled: sharingEnabledResult,
  } = useModuleQueries(
    sharingItemsApi,
    {
      getPermissionForItem: {
        queryParam: {
          itemId: secret.id,
        },
      },
      sharingEnabled: {},
    },
    []
  );
  const permission = getPermissionForItemResult.data?.permission;
  const isSharingEnabled = Boolean(sharingEnabledResult.data);
  const hasShareAction = isSharingEnabled && permission === Permission.Admin;
  const secretItemRoute = routes.userVaultItem(
    secret.id,
    VaultItemType.Secret,
    pathname
  );
  const onRowClick = () => {
    logPageView(PageView.ItemSecretDetails);
    logSelectSecret(secret.id);
  };
  const onCopy = (field: "id" | "secret", toastLabel: string) => {
    let value = secret.content;
    if (field === "id") {
      value = new RegExp("^{(.*)}$").test(secret.id)
        ? secret.id.substring(1, secret.id.length - 1)
        : secret.id;
    }
    const copyCallback = async () => {
      logEvent(
        new UserCopyVaultItemFieldEvent({
          itemId: secret.id,
          itemType: ItemType.Secret,
          field: field === "id" ? Field.SecretId : Field.Secret,
          isProtected: secret.isSecured,
        })
      );
      if (hasTeamSpaceId) {
        logCopiedSecretContent(secret.title);
      }
      await navigator.clipboard
        .writeText(value)
        .then(() => showToast({ description: toastLabel }));
    };
    if (isSecretLocked) {
      openProtectedItemsUnlocker({
        action: UnlockerAction.Show,
        itemType: LockedItemType.Secret,
        successCallback: copyCallback,
      });
    } else {
      copyCallback();
    }
  };
  const onShare = () => {
    const sharing = getSecretSharing(secret.id);
    if (isAllowedToShare && sharing) {
      openDialog(
        <SharingInviteDialog
          sharing={sharing}
          onDismiss={closeDialog}
          origin={Origin.ItemListView}
        />
      );
    } else {
      openDialog(<SharingLimitReachedDialog closeDialog={closeDialog} />);
    }
  };
  const rowData = [
    {
      key: "title",
      content: <SecretTitle secret={secret} isShared={!!permission} />,
    },
    {
      key: "createdAt",
      content: displayCreatedAt(translate, secret),
      className: styles.created,
    },
    {
      key: "updatedAt",
      content: displayUpdatedAt(secret),
      className: styles.updated,
    },
  ];
  return (
    <Row
      key={secret.id}
      type={"link"}
      onClick={onRowClick}
      data={rowData}
      link={secretItemRoute}
      actions={
        <SecretQuickActions
          onEdit={onRowClick}
          onCopy={onCopy}
          onShare={onShare}
          hasShareAction={hasShareAction}
        />
      }
    />
  );
};
