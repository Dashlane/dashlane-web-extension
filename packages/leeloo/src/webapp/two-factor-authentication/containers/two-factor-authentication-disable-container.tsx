import classnames from 'classnames';
import React, { useCallback, useEffect } from 'react';
import { TwoFactorAuthenticationError } from '@dashlane/hermes';
import { AlertSeverity, Dialog } from '@dashlane/ui-components';
import { TwoFactorAuthenticationDisableStages, TwoFactorAuthenticationFlowStageData, TwoFactorAuthenticationInfoRequestStatus, } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { continueTwoFactorAuthenticationDisableFlow, startTwoFactorAuthenticationDisableFlow, stopTwoFactorAuthenticationDisableFlow, } from 'webapp/two-factor-authentication/services';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import { useTwoFactorAuthenticationDisableFlow, useTwoFactorAuthenticationInfo, } from 'webapp/two-factor-authentication/hooks';
import { TwoFactorAuthenticationBackupCodeDialog, TwoFactorAuthenticationCodeDialog, TwoFactorAuthenticationFinalizingChangesDialog, TwoFactorAuthenticationGenericErrorDialog, TwoFactorAuthenticationLogoutRequiredDialog, } from 'webapp/two-factor-authentication/components/two-factor-authentication-dialog';
import { logTwoFactorAuthenticationDisable6DigitsCodePageView, logTwoFactorAuthenticationDisableBackupCodePageView, logTwoFactorAuthenticationDisableCancelEvent, logTwoFactorAuthenticationDisableCompleteEvent, logTwoFactorAuthenticationDisableConfirmationPageView, logTwoFactorAuthenticationDisableErrorEvent, } from 'webapp/two-factor-authentication/logs/disable-flow-logs';
import { getTwoFactorAuthenticationCodeLogError } from 'webapp/two-factor-authentication/errors/disable';
import { TwoFactorAuthenticationDisableConfirmationDialog } from 'webapp/two-factor-authentication/components/two-factor-authentication-dialog/two-factor-authentication-disable-confirmation-dialog';
import { TwoFactorAuthenticationErrorWithMessage } from 'webapp/two-factor-authentication/types';
import { useUserLogin } from 'libs/hooks/useUserLogin';
type StageComponentProps = {
    handleClickOnBack: () => void;
    handleClickOnSubmit: () => void;
    handleClickOnClose: () => void;
    logEvent?: (errorName?: TwoFactorAuthenticationError) => void;
};
interface AuthenticationCodeStageProps extends StageComponentProps {
    toggleAuthenticationCodeMode: () => void;
    error: TwoFactorAuthenticationErrorWithMessage;
}
interface ConfirmationStageProps extends StageComponentProps {
    isTwoFactorAuthenticationEnforced: boolean;
}
const I18N_KEYS = {
    TWO_FACTOR_AUTHENTICATION_DISABLE_SUCCESS_ALERT: 'webapp_account_security_settings_two_factor_authentication_disable_success',
    CLOSE_DIALOG: '_common_dialog_dismiss_button'
};
const VIEW_MAPPER = {
    [TwoFactorAuthenticationDisableStages.CONFIRMATION]: {
        component: TwoFactorAuthenticationDisableConfirmationDialog,
        componentProps: {
            logEvent: logTwoFactorAuthenticationDisableConfirmationPageView,
        },
        showCloseIcon: true,
    },
    [TwoFactorAuthenticationDisableStages.AUTHENTICATION_CODE]: {
        component: TwoFactorAuthenticationCodeDialog,
        componentProps: {
            logEvent: logTwoFactorAuthenticationDisable6DigitsCodePageView,
        },
        target: TwoFactorAuthenticationDisableStages.BACKUP_CODE,
        showCloseIcon: true,
    },
    [TwoFactorAuthenticationDisableStages.BACKUP_CODE]: {
        component: TwoFactorAuthenticationBackupCodeDialog,
        componentProps: {
            logEvent: logTwoFactorAuthenticationDisableBackupCodePageView,
        },
        target: TwoFactorAuthenticationDisableStages.AUTHENTICATION_CODE,
        showCloseIcon: true,
    },
    [TwoFactorAuthenticationDisableStages.FINALIZING_CHANGES]: {
        component: TwoFactorAuthenticationFinalizingChangesDialog,
        showCloseIcon: false,
    },
    [TwoFactorAuthenticationDisableStages.GENERIC_ERROR]: {
        component: TwoFactorAuthenticationGenericErrorDialog,
        componentProps: {
            logEvent: logTwoFactorAuthenticationDisableErrorEvent,
        },
        showCloseIcon: true,
    },
    [TwoFactorAuthenticationDisableStages.LOGOUT_REQUIRED]: {
        component: TwoFactorAuthenticationLogoutRequiredDialog,
        showCloseIcon: false,
    },
};
interface Props {
    onDialogClose: () => void;
}
export const TwoFactorAuthenticationDisableContainer = ({ onDialogClose, }: Props) => {
    const { translate } = useTranslate();
    const flowData: TwoFactorAuthenticationFlowStageData | null = useTwoFactorAuthenticationDisableFlow();
    const twoFactorAuthenticationInfo = useTwoFactorAuthenticationInfo();
    const isTwoFactorAuthenticationEnforced = twoFactorAuthenticationInfo?.status ===
        TwoFactorAuthenticationInfoRequestStatus.READY &&
        twoFactorAuthenticationInfo.isTwoFactorAuthenticationEnforced;
    const successAlert = useAlert();
    const onClose = useCallback((cancelled = true) => {
        if (cancelled) {
            logTwoFactorAuthenticationDisableCancelEvent();
        }
        typeof onDialogClose === 'function' && onDialogClose();
    }, [onDialogClose]);
    const stage = flowData?.stage;
    useEffect(() => {
        if (stage === TwoFactorAuthenticationDisableStages.SUCCESS) {
            logTwoFactorAuthenticationDisableCompleteEvent();
            successAlert.showAlert(translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_DISABLE_SUCCESS_ALERT), AlertSeverity.SUCCESS);
            onClose(false);
        }
    }, [stage]);
    useEffect(() => {
        if (!stage) {
            startTwoFactorAuthenticationDisableFlow();
        }
        return () => {
            stopTwoFactorAuthenticationDisableFlow();
        };
    }, []);
    const login = useUserLogin();
    if (stage && VIEW_MAPPER[stage]) {
        const stageComponentProps: StageComponentProps | AuthenticationCodeStageProps = {
            handleClickOnBack: onClose,
            handleClickOnSubmit: continueTwoFactorAuthenticationDisableFlow,
            handleClickOnClose: onClose,
            ...VIEW_MAPPER[stage]?.componentProps,
        };
        (stageComponentProps as Partial<{
            login: string;
        }>).login = login;
        const error = flowData?.viewData?.error;
        switch (stage) {
            case TwoFactorAuthenticationDisableStages.BACKUP_CODE:
            case TwoFactorAuthenticationDisableStages.AUTHENTICATION_CODE:
                if (error) {
                    const { logErrorName, errorMessage } = getTwoFactorAuthenticationCodeLogError(error.code);
                    logTwoFactorAuthenticationDisableErrorEvent(logErrorName);
                    (stageComponentProps as AuthenticationCodeStageProps).error = {
                        message: errorMessage,
                        code: error.code,
                    };
                }
                if (VIEW_MAPPER[stage]?.target) {
                    (stageComponentProps as AuthenticationCodeStageProps).toggleAuthenticationCodeMode = () => {
                        continueTwoFactorAuthenticationDisableFlow({
                            target: VIEW_MAPPER[stage].target,
                        });
                    };
                }
                break;
            case TwoFactorAuthenticationDisableStages.CONFIRMATION:
                (stageComponentProps as ConfirmationStageProps).isTwoFactorAuthenticationEnforced = isTwoFactorAuthenticationEnforced;
                break;
        }
        return (<Dialog isOpen modalContentClassName={classnames(allIgnoreClickOutsideClassName)} disableOutsideClickClose disableScrolling disableUserInputTrap disableEscapeKeyClose closeIconName={VIEW_MAPPER[stage].showCloseIcon
                ? translate(I18N_KEYS.CLOSE_DIALOG)
                : undefined} onClose={onClose}>
        {React.createElement(VIEW_MAPPER[stage].component, stageComponentProps)}
      </Dialog>);
    }
    else {
        return null;
    }
};
