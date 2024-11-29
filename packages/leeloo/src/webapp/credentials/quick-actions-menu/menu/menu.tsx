import { useEffect, useState } from "react";
import classnames from "classnames";
import { Origin } from "@dashlane/hermes";
import { Permission } from "@dashlane/sharing-contracts";
import { DropdownContent, DropdownItem } from "@dashlane/design-system";
import { assertUnreachable } from "../../../../libs/assert-unreachable";
import {
  InjectedTranslateProps,
  withTranslate,
} from "../../../../libs/i18n/withTranslate";
import { editPanelIgnoreClickOutsideClassName } from "../../../variables";
import { getCredentialSharing } from "../../../sharing-invite/helpers";
import {
  LockedItemType,
  ProtectedItemsUnlockerProps,
  UnlockerAction,
} from "../../../unlock-items/types";
import { useDialog } from "../../../dialog";
import { SharingInviteDialog } from "../../../sharing-invite/sharing-invite-dialog";
import { SharingLimitReachedDialog } from "../../../sharing-invite/limit-reached";
import { withProtectedItemsUnlocker } from "../../../unlock-items";
import { CollectionQuickActions } from "../../../collections/collection-quick-actions";
import styles from "./styles.css";
const I18N_KEYS = {
  EDIT_ITEM: "webapp_credentials_quick_actions_edit_item",
  GO_TO_WEBSITE: "webapp_credentials_quick_actions_go_to_website",
  COPY_PASSWORD: "webapp_credentials_quick_actions_copy_password",
  COPY_PASSWORD_OK:
    "webapp_credentials_quick_actions_copy_password_feedback_ok",
  COPY_PASSWORD_NOT_OK:
    "webapp_credentials_quick_actions_copy_password_feedback_not_ok",
  COPY_LOGIN: "webapp_credentials_quick_actions_copy_login",
  COPY_LOGIN_OK: "webapp_credentials_quick_actions_copy_login_feedback_ok",
  COPY_LOGIN_NOT_OK:
    "webapp_credentials_quick_actions_copy_login_feedback_not_ok",
  COPY_EMAIL: "webapp_credentials_quick_actions_copy_email",
  COPY_EMAIL_OK: "webapp_credentials_quick_actions_copy_email_feedback_ok",
  COPY_EMAIL_NOT_OK:
    "webapp_credentials_quick_actions_copy_email_feedback_not_ok",
  SHARE: "webapp_sharing_invite_share",
};
const CLOSE_POPUP_DURATION_MS = 900;
export const menuMaxHeight = 48 * 4 + 1 + 16 * 2;
type CopyableElements = "login" | "password" | "email";
export interface BaseProps {
  autoProtected?: boolean;
  closePopover?: (closeSearchToo?: boolean) => void;
  id: string;
  login: string;
  email: string;
  permission?: Permission;
  isSharingEnabled: boolean;
  isSharingAllowed: boolean;
  isUserFrozen: boolean;
  isCredentialsGloballyProtected: boolean;
  onCopyLogin: (success: boolean) => void;
  onCopyEmail: (success: boolean) => void;
  onCopyPassword: (success: boolean) => void;
  onEditItem: () => void;
  onGoToWebsite?: () => void;
  password: string;
  spaceId: string;
  title: string;
  url?: string;
}
type Props = BaseProps & InjectedTranslateProps & ProtectedItemsUnlockerProps;
export const MenuComponent = (props: Props) => {
  const { openDialog, closeDialog } = useDialog();
  const [loginCopySuccess, setLoginCopySuccess] = useState<boolean | undefined>(
    undefined
  );
  const [loginShowCopyFeedback, setLoginShowCopyFeedback] =
    useState<boolean>(false);
  const [emailCopySuccess, setEmailCopySuccess] = useState<boolean | undefined>(
    undefined
  );
  const [emailShowCopyFeedback, setEmailShowCopyFeedback] =
    useState<boolean>(false);
  const [passwordCopySuccess, setPasswordCopySuccess] = useState<
    boolean | undefined
  >(undefined);
  const [passwordShowCopyFeedback, setPasswordShowCopyFeedback] =
    useState<boolean>(false);
  const [loginFeedbackTimeoutId, setLoginFeedbackTimeoutId] =
    useState<number>(0);
  const [emailFeedbackTimeoutId, setEmailFeedbackTimeoutId] =
    useState<number>(0);
  const [passwordFeedbackTimeoutId, setPasswordFeedbackTimeoutId] =
    useState<number>(0);
  useEffect(() => {
    return () => {
      window.clearTimeout(loginFeedbackTimeoutId);
      window.clearTimeout(emailFeedbackTimeoutId);
      window.clearTimeout(passwordFeedbackTimeoutId);
    };
  }, []);
  const handleClosePopover = (closeSearchToo = false) => {
    if (props.closePopover) {
      props.closePopover(closeSearchToo);
    }
  };
  const scheduleLoginCopyFeedback = () => {
    setLoginShowCopyFeedback(true);
    const loginCopyFeedbackTimeoutId = window.setTimeout(() => {
      setLoginCopySuccess(undefined);
      setLoginShowCopyFeedback(false);
    }, CLOSE_POPUP_DURATION_MS);
    setLoginFeedbackTimeoutId(loginCopyFeedbackTimeoutId);
  };
  const scheduleEmailCopyFeedback = () => {
    setEmailShowCopyFeedback(true);
    const emailCopyFeedbackTimeoutId = window.setTimeout(() => {
      setEmailCopySuccess(undefined);
      setEmailShowCopyFeedback(false);
    }, CLOSE_POPUP_DURATION_MS);
    setEmailFeedbackTimeoutId(emailCopyFeedbackTimeoutId);
  };
  const schedulePasswordCopyFeedback = () => {
    setPasswordShowCopyFeedback(true);
    const passwordCopyFeedbackTimeoutId = window.setTimeout(() => {
      setPasswordShowCopyFeedback(false);
      setPasswordCopySuccess(undefined);
    }, CLOSE_POPUP_DURATION_MS);
    setPasswordFeedbackTimeoutId(passwordCopyFeedbackTimeoutId);
  };
  const getCopySuccess = (id: CopyableElements) => {
    switch (id) {
      case "password":
        return passwordCopySuccess;
      case "login":
        return loginCopySuccess;
      case "email":
        return emailCopySuccess;
      default:
        assertUnreachable(id);
    }
  };
  const getShowCopyFeedback = (id: CopyableElements) => {
    switch (id) {
      case "password":
        return passwordShowCopyFeedback;
      case "login":
        return loginShowCopyFeedback;
      case "email":
        return emailShowCopyFeedback;
      default:
        assertUnreachable(id);
    }
  };
  const isItemLocked = () => {
    return (
      !props.areProtectedItemsUnlocked &&
      (props.autoProtected || props.isCredentialsGloballyProtected)
    );
  };
  const onCopyDone = ({
    type,
    success,
    callback,
  }: {
    type: CopyableElements;
    success: boolean;
    callback?: (isSuccess: boolean) => void;
  }) => {
    if (getCopySuccess(type)) {
      return;
    }
    if (callback) {
      callback(success);
    }
    if (type === "password") {
      setPasswordCopySuccess(success);
    } else if (type === "email") {
      setEmailCopySuccess(success);
    } else {
      setLoginCopySuccess(success);
    }
    if (!success) {
      return handleClosePopover();
    }
    switch (type) {
      case "password":
        schedulePasswordCopyFeedback();
        return;
      case "login":
        scheduleLoginCopyFeedback();
        return;
      case "email":
        scheduleEmailCopyFeedback();
        return;
      default:
        assertUnreachable(type);
    }
  };
  const isFeedbackDisplayed = (id: CopyableElements): boolean => {
    return getShowCopyFeedback(id) && typeof getCopySuccess(id) !== "undefined";
  };
  const getCurrentFeedbackIcon = (id: CopyableElements) => {
    return getCopySuccess(id) ? "CheckmarkOutlined" : "ActionCloseOutlined";
  };
  const onClickLogin = async (e: Event) => {
    e.preventDefault();
    const success = await navigator.clipboard
      .writeText(props.login)
      .then(() => true)
      .catch(() => false);
    onCopyDone({
      success,
      type: "login",
      callback: props.onCopyLogin,
    });
  };
  const onClickEmail = async (e: Event) => {
    e.preventDefault();
    const success = await navigator.clipboard
      .writeText(props.email)
      .then(() => true)
      .catch(() => false);
    onCopyDone({
      success,
      type: "email",
      callback: props.onCopyEmail,
    });
  };
  const onClickPassword = (e: Event) => {
    e.preventDefault();
    const onItemUnlockedCallback = async () => {
      const success = await navigator.clipboard
        .writeText(props.password)
        .then(() => true)
        .catch(() => false);
      onCopyDone({
        success,
        type: "password",
        callback: props.onCopyPassword,
      });
    };
    if (isItemLocked()) {
      return props.openProtectedItemsUnlocker({
        action: UnlockerAction.Copy,
        itemType: LockedItemType.Password,
        successCallback: onItemUnlockedCallback,
        showNeverAskOption: true,
        credentialId: props.id,
      });
    }
    onItemUnlockedCallback();
  };
  const onClickShare = () => {
    handleClosePopover(true);
    const { id, isSharingAllowed } = props;
    const sharing = getCredentialSharing(id);
    if (isSharingAllowed && sharing) {
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
  const { login, email, onEditItem, onGoToWebsite, password, translate } =
    props;
  const hasShareAction =
    props.isSharingEnabled && props.permission === Permission.Admin;
  const hasAdminAccess = props.permission
    ? props.permission === Permission.Admin
    : true;
  const hasPasswordAction = password && hasAdminAccess;
  return (
    <DropdownContent
      className={classnames(
        styles.quickActionsMenu,
        editPanelIgnoreClickOutsideClassName
      )}
    >
      <DropdownItem
        onSelect={onEditItem}
        leadingIcon="ActionEditOutlined"
        label={translate(I18N_KEYS.EDIT_ITEM)}
      />

      {onGoToWebsite ? (
        <DropdownItem
          onSelect={onGoToWebsite}
          leadingIcon="ActionOpenExternalLinkOutlined"
          label={translate(I18N_KEYS.GO_TO_WEBSITE)}
        />
      ) : null}

      {hasPasswordAction && !props.isUserFrozen ? (
        <DropdownItem
          onSelect={onClickPassword}
          leadingIcon={
            isFeedbackDisplayed("password")
              ? getCurrentFeedbackIcon("password")
              : "ActionCopyOutlined"
          }
          label={
            isFeedbackDisplayed("password")
              ? passwordCopySuccess
                ? translate(I18N_KEYS.COPY_PASSWORD_OK)
                : translate(I18N_KEYS.COPY_PASSWORD_NOT_OK)
              : translate(I18N_KEYS.COPY_PASSWORD)
          }
        />
      ) : null}

      {login && !props.isUserFrozen ? (
        <DropdownItem
          onSelect={onClickLogin}
          leadingIcon={
            isFeedbackDisplayed("login")
              ? getCurrentFeedbackIcon("login")
              : "ActionCopyOutlined"
          }
          label={
            isFeedbackDisplayed("login")
              ? loginCopySuccess
                ? translate(I18N_KEYS.COPY_LOGIN_OK)
                : translate(I18N_KEYS.COPY_LOGIN_NOT_OK)
              : translate(I18N_KEYS.COPY_LOGIN)
          }
        />
      ) : null}

      {email && !props.isUserFrozen ? (
        <DropdownItem
          onSelect={onClickEmail}
          leadingIcon={
            isFeedbackDisplayed("email")
              ? getCurrentFeedbackIcon("email")
              : "ActionCopyOutlined"
          }
          label={
            isFeedbackDisplayed("email")
              ? emailCopySuccess
                ? translate(I18N_KEYS.COPY_EMAIL_OK)
                : translate(I18N_KEYS.COPY_EMAIL_NOT_OK)
              : translate(I18N_KEYS.COPY_EMAIL)
          }
        />
      ) : null}

      {hasShareAction && !props.isUserFrozen ? (
        <DropdownItem
          onSelect={onClickShare}
          leadingIcon="ActionShareOutlined"
          label={translate(I18N_KEYS.SHARE)}
        />
      ) : null}

      <CollectionQuickActions
        itemId={props.id}
        itemName={props.title}
        itemSpaceId={props.spaceId ?? ""}
        isSharedWithLimitedRights={!hasAdminAccess}
        itemUrl={props.url}
      />
    </DropdownContent>
  );
};
export const Menu = withProtectedItemsUnlocker(withTranslate(MenuComponent));
