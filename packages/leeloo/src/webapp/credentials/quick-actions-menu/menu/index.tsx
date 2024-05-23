import React from 'react';
import classnames from 'classnames';
import { CheckIcon, colors, CopyIcon, CopyPasswordIcon, EditIcon, OpenWebsiteIcon, ShareIcon, CloseIcon as XIcon, } from '@dashlane/ui-components';
import { Origin, PageView } from '@dashlane/hermes';
import { DataStatus, useModuleQueries } from '@dashlane/framework-react';
import { Permission, sharingItemsApi } from '@dashlane/sharing-contracts';
import { carbonConnector } from 'libs/carbon/connector';
import { assertUnreachable } from 'libs/assert-unreachable';
import { InjectedTranslateProps, withTranslate } from 'libs/i18n/withTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { editPanelIgnoreClickOutsideClassName } from 'webapp/variables';
import { getCredentialSharing } from 'webapp/sharing-invite/helpers';
import { LockedItemType, ProtectedItemsUnlockerProps, UnlockerAction, } from 'webapp/unlock-items/types';
import { useDialog } from 'webapp/dialog';
import { SharingInviteDialog } from 'webapp/sharing-invite/sharing-invite-dialog';
import { SharingLimitReachedDialog } from 'webapp/sharing-invite/limit-reached';
import { useIsAllowedToShare } from 'libs/carbon/hooks/useIsAllowedToShare';
import { withProtectedItemsUnlocker } from 'webapp/unlock-items';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import { CollectionQuickActions } from '../collection-quick-actions';
import { MenuItem } from './menu-item';
import styles from './styles.css';
const { accessibleValidatorGreen, accessibleValidatorRed } = colors;
const I18N_KEYS = {
    EDIT_ITEM: 'webapp_credentials_quick_actions_edit_item',
    GO_TO_WEBSITE: 'webapp_credentials_quick_actions_go_to_website',
    COPY_PASSWORD: 'webapp_credentials_quick_actions_copy_password',
    COPY_PASSWORD_OK: 'webapp_credentials_quick_actions_copy_password_feedback_ok',
    COPY_PASSWORD_NOT_OK: 'webapp_credentials_quick_actions_copy_password_feedback_not_ok',
    COPY_LOGIN: 'webapp_credentials_quick_actions_copy_login',
    COPY_LOGIN_OK: 'webapp_credentials_quick_actions_copy_login_feedback_ok',
    COPY_LOGIN_NOT_OK: 'webapp_credentials_quick_actions_copy_login_feedback_not_ok',
    COPY_EMAIL: 'webapp_credentials_quick_actions_copy_email',
    COPY_EMAIL_OK: 'webapp_credentials_quick_actions_copy_email_feedback_ok',
    COPY_EMAIL_NOT_OK: 'webapp_credentials_quick_actions_copy_email_feedback_not_ok',
    SHARE: 'webapp_sharing_invite_share',
};
const CLOSE_POPUP_DURATION_MS = 900;
export const menuMaxHeight = 48 * 4 +
    1 +
    16 * 2;
type CopyableElements = 'login' | 'password' | 'email';
export interface BaseProps {
    autoProtected?: boolean;
    closePopover?: () => void;
    id: string;
    login: string;
    email: string;
    onCopyLogin: (success: boolean) => void;
    onCopyEmail: (success: boolean) => void;
    onCopyPassword: (success: boolean) => void;
    onEditItem: () => void;
    onGoToWebsite?: () => void;
    password: string;
    spaceId: string;
    title: string;
}
type Props = BaseProps & InjectedTranslateProps & ProtectedItemsUnlockerProps;
export const MenuComponent = (props: Props) => {
    const isAllowedToShare = useIsAllowedToShare();
    const { openDialog, closeDialog } = useDialog();
    const [loginCopySuccess, setLoginCopySuccess] = React.useState<boolean | undefined>(undefined);
    const [loginShowCopyFeedback, setLoginShowCopyFeedback] = React.useState<boolean>(false);
    const [emailCopySuccess, setEmailCopySuccess] = React.useState<boolean | undefined>(undefined);
    const [emailShowCopyFeedback, setEmailShowCopyFeedback] = React.useState<boolean>(false);
    const [passwordCopySuccess, setPasswordCopySuccess] = React.useState<boolean | undefined>(undefined);
    const [passwordShowCopyFeedback, setPasswordShowCopyFeedback] = React.useState<boolean>(false);
    const [credentialsGloballyRequireMP, setCredentialsGloballyRequireMP] = React.useState<boolean | null>(null);
    const [loginFeedbackTimeoutId, setLoginFeedbackTimeoutId] = React.useState<number>(0);
    const [emailFeedbackTimeoutId, setEmailFeedbackTimeoutId] = React.useState<number>(0);
    const [passwordFeedbackTimeoutId, setPasswordFeedbackTimeoutId] = React.useState<number>(0);
    const { getPermissionForItem: getPermissionForItemResult, sharingEnabled: sharingEnabledResult, } = useModuleQueries(sharingItemsApi, {
        getPermissionForItem: {
            queryParam: {
                itemId: props.id,
            },
        },
        sharingEnabled: {},
    }, []);
    React.useEffect(() => {
        carbonConnector.arePasswordsProtected().then((protectPasswords) => {
            setCredentialsGloballyRequireMP(protectPasswords);
        });
    }, []);
    React.useEffect(() => {
        logPageView(PageView.ItemQuickActionsDropdown);
        return () => {
            window.clearTimeout(loginFeedbackTimeoutId);
            window.clearTimeout(emailFeedbackTimeoutId);
            window.clearTimeout(passwordFeedbackTimeoutId);
        };
    }, []);
    const closePopover = () => {
        if (props.closePopover) {
            props.closePopover();
        }
    };
    const scheduleLoginCopyFeedback = () => {
        setLoginShowCopyFeedback(true);
        const loginCopyFeedbackTimeoutId = window.setTimeout(() => {
            setLoginCopySuccess(undefined);
            setLoginShowCopyFeedback(false);
            closePopover();
        }, CLOSE_POPUP_DURATION_MS);
        setLoginFeedbackTimeoutId(loginCopyFeedbackTimeoutId);
    };
    const scheduleEmailCopyFeedback = () => {
        setEmailShowCopyFeedback(true);
        const emailCopyFeedbackTimeoutId = window.setTimeout(() => {
            setEmailCopySuccess(undefined);
            setEmailShowCopyFeedback(false);
            closePopover();
        }, CLOSE_POPUP_DURATION_MS);
        setEmailFeedbackTimeoutId(emailCopyFeedbackTimeoutId);
    };
    const schedulePasswordCopyFeedback = () => {
        setPasswordShowCopyFeedback(true);
        const passwordCopyFeedbackTimeoutId = window.setTimeout(() => {
            setPasswordShowCopyFeedback(false);
            setPasswordCopySuccess(undefined);
            closePopover();
        }, CLOSE_POPUP_DURATION_MS);
        setPasswordFeedbackTimeoutId(passwordCopyFeedbackTimeoutId);
    };
    const getCopySuccess = (id: CopyableElements) => {
        switch (id) {
            case 'password':
                return passwordCopySuccess;
            case 'login':
                return loginCopySuccess;
            case 'email':
                return emailCopySuccess;
            default:
                assertUnreachable(id);
        }
    };
    const getShowCopyFeedback = (id: CopyableElements) => {
        switch (id) {
            case 'password':
                return passwordShowCopyFeedback;
            case 'login':
                return loginShowCopyFeedback;
            case 'email':
                return emailShowCopyFeedback;
            default:
                assertUnreachable(id);
        }
    };
    const isItemLocked = () => {
        return (!props.areProtectedItemsUnlocked &&
            (props.autoProtected || credentialsGloballyRequireMP));
    };
    const onCopyDone = ({ type, success, callback, }: {
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
        if (type === 'password') {
            setPasswordCopySuccess(success);
        }
        else if (type === 'email') {
            setEmailCopySuccess(success);
        }
        else {
            setLoginCopySuccess(success);
        }
        if (!success) {
            return closePopover();
        }
        switch (type) {
            case 'password':
                schedulePasswordCopyFeedback();
                return;
            case 'login':
                scheduleLoginCopyFeedback();
                return;
            case 'email':
                scheduleEmailCopyFeedback();
                return;
            default:
                assertUnreachable(type);
        }
    };
    const isFeedbackDisplayed = (id: CopyableElements): boolean => {
        return getShowCopyFeedback(id) && typeof getCopySuccess(id) !== 'undefined';
    };
    const getCurrentFeedbackIcon = (id: CopyableElements) => {
        return getCopySuccess(id) ? (<CheckIcon aria-hidden="true" size={20} color={accessibleValidatorGreen}/>) : (<XIcon aria-hidden="true" size={20} color={accessibleValidatorRed}/>);
    };
    const onClickLogin = async () => {
        const success = await navigator.clipboard
            .writeText(props.login)
            .then(() => true)
            .catch(() => false);
        onCopyDone({
            success,
            type: 'login',
            callback: props.onCopyLogin,
        });
    };
    const onClickEmail = async () => {
        const success = await navigator.clipboard
            .writeText(props.email)
            .then(() => true)
            .catch(() => false);
        onCopyDone({
            success,
            type: 'email',
            callback: props.onCopyEmail,
        });
    };
    const onClickPassword = () => {
        const onItemUnlockedCallback = async () => {
            const success = await navigator.clipboard
                .writeText(props.password)
                .then(() => true)
                .catch(() => false);
            onCopyDone({
                success,
                type: 'password',
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
        const { id } = props;
        const sharing = getCredentialSharing(id);
        if (isAllowedToShare && sharing) {
            openDialog(<SharingInviteDialog sharing={sharing} onDismiss={closeDialog} origin={Origin.ItemListView}/>);
        }
        else {
            openDialog(<SharingLimitReachedDialog closeDialog={closeDialog}/>);
        }
        closePopover();
    };
    const { login, email, onEditItem, onGoToWebsite, password, translate } = props;
    const permission = getPermissionForItemResult.data?.permission;
    const isSharingEnabled = Boolean(sharingEnabledResult.data);
    const hasShareAction = isSharingEnabled && permission === Permission.Admin;
    const hasPasswordAction = password &&
        getPermissionForItemResult.status === DataStatus.Success &&
        (permission ? permission === Permission.Admin : true);
    return (<div role="menu" className={classnames(styles.quickActionsMenu, editPanelIgnoreClickOutsideClassName)}>
      <MenuItem onClick={onEditItem} closeOnClick icon={<EditIcon size={20}/>} text={translate(I18N_KEYS.EDIT_ITEM)}/>
      {onGoToWebsite ? (<MenuItem onClick={onGoToWebsite} closeOnClick icon={<OpenWebsiteIcon size={20}/>} text={translate(I18N_KEYS.GO_TO_WEBSITE)}/>) : null}

      {hasPasswordAction ? (<MenuItem onClick={onClickPassword} disabled={credentialsGloballyRequireMP === null} icon={credentialsGloballyRequireMP === null ? (<LoadingSpinner size={20}/>) : isFeedbackDisplayed('password') ? (getCurrentFeedbackIcon('password')) : (<CopyPasswordIcon size={20}/>)} text={isFeedbackDisplayed('password')
                ? passwordCopySuccess
                    ? translate(I18N_KEYS.COPY_PASSWORD_OK)
                    : translate(I18N_KEYS.COPY_PASSWORD_NOT_OK)
                : translate(I18N_KEYS.COPY_PASSWORD)}/>) : null}
      {login ? (<MenuItem onClick={onClickLogin} icon={isFeedbackDisplayed('login') ? (getCurrentFeedbackIcon('login')) : (<CopyIcon size={20}/>)} text={isFeedbackDisplayed('login')
                ? loginCopySuccess
                    ? translate(I18N_KEYS.COPY_LOGIN_OK)
                    : translate(I18N_KEYS.COPY_LOGIN_NOT_OK)
                : translate(I18N_KEYS.COPY_LOGIN)}/>) : null}
      {email ? (<MenuItem onClick={onClickEmail} icon={isFeedbackDisplayed('email') ? (getCurrentFeedbackIcon('email')) : (<CopyIcon size={20}/>)} text={isFeedbackDisplayed('email')
                ? emailCopySuccess
                    ? translate(I18N_KEYS.COPY_EMAIL_OK)
                    : translate(I18N_KEYS.COPY_EMAIL_NOT_OK)
                : translate(I18N_KEYS.COPY_EMAIL)}/>) : null}
      {hasShareAction ? (<MenuItem onClick={onClickShare} closeOnClick icon={<ShareIcon size={20}/>} text={translate(I18N_KEYS.SHARE)}/>) : null}
      <CollectionQuickActions itemId={props.id} itemName={props.title} itemSpaceId={props.spaceId ?? ''}/>
    </div>);
};
export const Menu = withProtectedItemsUnlocker(withTranslate(MenuComponent));
