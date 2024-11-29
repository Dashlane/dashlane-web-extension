import { Component, ComponentProps, DragEvent } from "react";
import classNames from "classnames";
import { autofillSettingsApi } from "@dashlane/autofill-contracts";
import { Button, ThemeUIStyleObject } from "@dashlane/design-system";
import { useModuleQueries, useModuleQuery } from "@dashlane/framework-react";
import { sharingItemsApi } from "@dashlane/sharing-contracts";
import { Credential, vaultItemsCrudApi } from "@dashlane/vault-contracts";
import { Lee } from "../../../../lee";
import { Link } from "../../../../libs/router";
import { openUrl } from "../../../../libs/external-urls";
import { logOpenCredentialUrl } from "../../../../libs/logs/events/vault/open-external-vault-item-link";
import {
  CredentialInfo as CredentialInfoBase,
  CredentialInfoSize,
} from "../../../../libs/dashlane-style/credential-info/credential-info";
import { QuickActionsMenu } from "../../../credentials/quick-actions-menu/quick-actions-menu";
import { editPanelIgnoreClickOutsideClassName } from "../../../variables";
import { useIsB2CUserFrozen } from "../../../../libs/frozen-state/hooks/use-is-b2c-user-frozen";
import { useIsAllowedToShare } from "../../../../libs/hooks/use-is-allowed-to-share";
import styles from "./styles.css";
interface CredentialSearchItemProps {
  credential: Credential;
  lee: Lee;
  onSelectCredential: () => void;
  style?: React.CSSProperties;
  sxProps?: Partial<ThemeUIStyleObject>;
}
interface State {
  isMounted: boolean;
  onHover: boolean;
}
type CancelablePromise = {
  promise: Promise<any>;
  cancel: () => void;
};
interface CredentialInfoProps {
  credential: Credential;
  sxProps?: Partial<ThemeUIStyleObject>;
}
const CredentialInfo = ({ credential, sxProps = {} }: CredentialInfoProps) => {
  const { id, itemName, username, email } = credential;
  const { data: credentialPreferences } = useModuleQuery(
    autofillSettingsApi,
    "getPreferencesForCredentials",
    {
      credentialIds: [id],
    }
  );
  const { data: sharingStatus } = useModuleQuery(
    sharingItemsApi,
    "getSharingStatusForItem",
    {
      itemId: credential.id,
    }
  );
  return (
    <CredentialInfoBase
      title={itemName}
      login={username}
      email={email}
      shared={sharingStatus?.isShared}
      autoProtected={credentialPreferences?.[0]?.requireMasterPassword}
      size={CredentialInfoSize.SMALL}
      fullWidth
      sxProps={sxProps}
    />
  );
};
interface GoToButtonProps {
  id: string;
  URL: string;
  label: string;
  disabled: boolean;
}
const GoToButton = ({ id, URL, label, disabled }: GoToButtonProps) => {
  const onClick = (): void => {
    void logOpenCredentialUrl(id, URL);
    openUrl(URL);
  };
  return (
    <Button
      disabled={disabled}
      aria-label={label}
      layout="iconOnly"
      mood="brand"
      intensity="supershy"
      icon="ActionOpenExternalLinkOutlined"
      size="small"
      onClick={onClick}
      tooltip={label}
    />
  );
};
const preventDragAndDrop = (e: DragEvent<HTMLElement>) => e.preventDefault();
const QuickActions = ({
  credential,
  credentialItemRoute,
  triggerButton,
}: Pick<
  ComponentProps<typeof QuickActionsMenu>,
  "credential" | "credentialItemRoute" | "triggerButton"
>) => {
  const { data: isCredentialsGloballyProtected } = useModuleQuery(
    vaultItemsCrudApi,
    "credentialsGloballyProtected"
  );
  const { data: credentialPreferences } = useModuleQuery(
    autofillSettingsApi,
    "getPreferencesForCredentials",
    {
      credentialIds: [credential.id],
    }
  );
  const isAllowedToShare = useIsAllowedToShare();
  const {
    getPermissionForItem: getPermissionForItemResult,
    sharingEnabled: sharingEnabledResult,
  } = useModuleQueries(
    sharingItemsApi,
    {
      getPermissionForItem: {
        queryParam: {
          itemId: credential.id,
        },
      },
      sharingEnabled: {},
    },
    []
  );
  const isUserFrozen = useIsB2CUserFrozen();
  if (
    credentialPreferences === undefined ||
    sharingEnabledResult.data === undefined ||
    isCredentialsGloballyProtected === undefined ||
    isUserFrozen === null
  ) {
    return null;
  }
  return (
    <QuickActionsMenu
      credential={credential}
      credentialItemRoute={credentialItemRoute}
      credentialPreferences={credentialPreferences?.[0]}
      permission={getPermissionForItemResult?.data?.permission}
      isSharingAllowed={isAllowedToShare}
      isSharingEnabled={sharingEnabledResult.data}
      isUserFrozen={isUserFrozen}
      isCredentialsGloballyProtected={isCredentialsGloballyProtected}
      triggerButton={triggerButton}
    />
  );
};
export class CredentialSearchItem extends Component<
  CredentialSearchItemProps,
  State
> {
  private promise: CancelablePromise;
  public constructor(props: CredentialSearchItemProps) {
    super(props);
    this.state = {
      isMounted: false,
      onHover: false,
    };
  }
  public componentDidMount() {
    let isCanceled = false;
    const promise = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (isCanceled) {
          reject();
        } else {
          resolve();
        }
      }, 500);
    })
      .then(() => this.updateState({ isMounted: true }))
      .catch(() => {});
    this.promise = {
      promise,
      cancel: () => {
        isCanceled = true;
      },
    };
  }
  public componentWillUnmount() {
    this.promise.cancel();
    if (this.state.isMounted) {
      this.updateState({ isMounted: false });
    }
  }
  private getButtons() {
    const _ = this.props.lee.translate.namespace(
      "webapp_sidemenu_search_actions_"
    );
    const { credential } = this.props;
    const { id, URL } = credential;
    return this.state.isMounted && this.state.onHover ? (
      <div className={styles.actions}>
        <GoToButton
          id={id}
          URL={URL}
          disabled={!URL}
          label={!URL ? _("no_website") : _("goto_title")}
        />
        <QuickActions
          credential={credential}
          credentialItemRoute={this.props.lee.routes.userCredential(id)}
          triggerButton={{
            layout: "iconOnly",
            size: "small",
            intensity: "supershy",
            mood: "brand",
            icon: "ActionMoreOutlined",
            showCaret: false,
            "aria-label": _("more_title"),
          }}
        />
      </div>
    ) : null;
  }
  private updateState(state: {}) {
    this.setState(Object.assign({}, this.state, state));
  }
  private onItemClick = () => {
    this.props.onSelectCredential();
  };
  public render() {
    const { credential, lee } = this.props;
    return (
      <div
        className={classNames(
          styles.item,
          editPanelIgnoreClickOutsideClassName
        )}
        onMouseLeave={() => this.updateState({ onHover: false })}
        onMouseEnter={() => this.updateState({ onHover: true })}
      >
        <Link
          onClick={this.onItemClick}
          to={lee.routes.userCredential(credential.id)}
          className={styles.link}
          onDragStart={preventDragAndDrop}
          onDrop={preventDragAndDrop}
        >
          <CredentialInfo
            credential={credential}
            sxProps={{
              paddingRight: "16px",
            }}
          />
        </Link>
        {this.getButtons()}
      </div>
    );
  }
}
