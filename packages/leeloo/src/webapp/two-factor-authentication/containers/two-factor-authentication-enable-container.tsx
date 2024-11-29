import React, { useCallback, useEffect } from "react";
import classnames from "classnames";
import { TwoFactorAuthenticationError } from "@dashlane/hermes";
import {
  AlertSeverity,
  colors,
  Dialog,
  Paragraph,
} from "@dashlane/ui-components";
import {
  CountryCode,
  TwoFactorAuthenticationEnableFlowStageData,
  TwoFactorAuthenticationEnableFlowStageRequest,
  TwoFactorAuthenticationEnableFlowStageResult,
  TwoFactorAuthenticationEnableStages,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  backTwoFactorAuthenticationEnableFlow,
  continueTwoFactorAuthenticationEnableFlow,
  startTwoFactorAuthenticationEnableFlow,
  stopTwoFactorAuthenticationEnableFlow,
} from "../services";
import { allIgnoreClickOutsideClassName } from "../../variables";
import { useTwoFactorAuthenticationEnableFlow } from "../hooks";
import {
  TwoFactorAuthenticationBackupCodesDialog,
  TwoFactorAuthenticationBackupPhoneDialog,
  TwoFactorAuthenticationCodeDialog,
  TwoFactorAuthenticationFinalizingChangesDialog,
  TwoFactorAuthenticationGenericErrorDialog,
  TwoFactorAuthenticationLoadingDialog,
  TwoFactorAuthenticationLogoutRequiredDialog,
  TwoFactorAuthenticationModeDialog,
  TwoFactorAuthenticationQRCodeDialog,
} from "../components/two-factor-authentication-dialog";
import {
  logTwoFactorAuthenticationEnable6DigitsCodePageView,
  logTwoFactorAuthenticationEnableCancelEvent,
  logTwoFactorAuthenticationEnableCompleteEvent,
  logTwoFactorAuthenticationEnableErrorEvent,
} from "../logs/enable-flow-logs";
import { getTwoFactorAuthenticationCodeLogError } from "../errors/enable";
import { TwoFactorAuthenticationErrorWithMessage } from "../types";
const I18N_KEYS = {
  TWO_FACTOR_AUTHENTICATION_STAGE_HEADER:
    "webapp_account_security_settings_two_factor_authentication_stage_header",
  TWO_FACTOR_AUTHENTICATION_ENABLE_SUCCESS_ALERT:
    "webapp_account_security_settings_two_factor_authentication_enable_success",
  CLOSE_DIALOG: "_common_dialog_dismiss_button",
  BACK: "_common_action_back",
};
type StageComponentProps = {
  handleClickOnBack: (
    params?: TwoFactorAuthenticationEnableFlowStageRequest
  ) => void;
  handleClickOnClose: () => void;
  handleClickOnSubmit: (
    params?: TwoFactorAuthenticationEnableFlowStageRequest
  ) => Promise<TwoFactorAuthenticationEnableFlowStageResult>;
  logEvent?: (errorName: TwoFactorAuthenticationError) => void;
  savedValues?: {
    savedCountryCode?: CountryCode;
    savedPhoneNumber?: string;
    savedAuthenticationType?:
      | TwoFactorAuthenticationType.DEVICE_REGISTRATION
      | TwoFactorAuthenticationType.LOGIN;
  };
};
interface AuthenticationCodeStageProps extends StageComponentProps {
  hideAdditionalActions: true;
  secondaryButtonTitle: string;
  error: TwoFactorAuthenticationErrorWithMessage;
}
const VIEW_MAPPER = {
  [TwoFactorAuthenticationEnableStages.AUTHENTICATION_TYPE]: {
    component: TwoFactorAuthenticationModeDialog,
    showCloseIcon: true,
  },
  [TwoFactorAuthenticationEnableStages.BACKUP_PHONE]: {
    component: TwoFactorAuthenticationBackupPhoneDialog,
    showCloseIcon: true,
  },
  [TwoFactorAuthenticationEnableStages.QR_CODE]: {
    component: TwoFactorAuthenticationQRCodeDialog,
    showCloseIcon: true,
  },
  [TwoFactorAuthenticationEnableStages.LOADING]: {
    component: TwoFactorAuthenticationLoadingDialog,
    showCloseIcon: false,
  },
  [TwoFactorAuthenticationEnableStages.AUTHENTICATION_CODE]: {
    component: TwoFactorAuthenticationCodeDialog,
    showCloseIcon: true,
  },
  [TwoFactorAuthenticationEnableStages.FINALIZING_CHANGES]: {
    component: TwoFactorAuthenticationFinalizingChangesDialog,
    showCloseIcon: false,
  },
  [TwoFactorAuthenticationEnableStages.BACKUP_CODES]: {
    component: TwoFactorAuthenticationBackupCodesDialog,
    showCloseIcon: false,
  },
  [TwoFactorAuthenticationEnableStages.GENERIC_ERROR]: {
    component: TwoFactorAuthenticationGenericErrorDialog,
    showCloseIcon: true,
  },
  [TwoFactorAuthenticationEnableStages.LOGOUT_REQUIRED]: {
    component: TwoFactorAuthenticationLogoutRequiredDialog,
    showCloseIcon: false,
  },
};
interface Props {
  onDialogClose: (cancelled: boolean) => void;
}
export const TwoFactorAuthenticationEnableContainer = ({
  onDialogClose,
}: Props) => {
  const { translate } = useTranslate();
  const successAlert = useAlert();
  const flowData: TwoFactorAuthenticationEnableFlowStageData | null =
    useTwoFactorAuthenticationEnableFlow();
  const onClose = useCallback(
    (cancelled = true) => {
      if (cancelled) {
        logTwoFactorAuthenticationEnableCancelEvent();
      }
      typeof onDialogClose === "function" && onDialogClose(cancelled);
    },
    [onDialogClose]
  );
  const stage = flowData?.stage;
  const viewData = flowData?.viewData;
  const savedValues = flowData?.savedValues;
  useEffect(() => {
    if (!stage) {
      startTwoFactorAuthenticationEnableFlow();
    }
    return () => {
      stopTwoFactorAuthenticationEnableFlow();
    };
  }, []);
  useEffect(() => {
    if (stage === TwoFactorAuthenticationEnableStages.SUCCESS) {
      logTwoFactorAuthenticationEnableCompleteEvent();
      successAlert.showAlert(
        translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_ENABLE_SUCCESS_ALERT),
        AlertSeverity.SUCCESS
      );
      onClose(false);
    }
  }, [stage]);
  const stageComponentProps:
    | StageComponentProps
    | AuthenticationCodeStageProps = {
    handleClickOnBack: backTwoFactorAuthenticationEnableFlow,
    handleClickOnClose: onClose,
    handleClickOnSubmit: continueTwoFactorAuthenticationEnableFlow,
    savedValues,
    ...viewData,
  };
  switch (stage) {
    case TwoFactorAuthenticationEnableStages.AUTHENTICATION_CODE:
      (
        stageComponentProps as AuthenticationCodeStageProps
      ).hideAdditionalActions = true;
      (stageComponentProps as AuthenticationCodeStageProps).logEvent =
        logTwoFactorAuthenticationEnable6DigitsCodePageView;
      (
        stageComponentProps as AuthenticationCodeStageProps
      ).secondaryButtonTitle = I18N_KEYS.BACK;
      if (viewData?.error) {
        const { logErrorName, errorMessage } =
          getTwoFactorAuthenticationCodeLogError(viewData.error.code);
        logTwoFactorAuthenticationEnableErrorEvent(logErrorName);
        (stageComponentProps as AuthenticationCodeStageProps).error = {
          message: errorMessage,
          code: viewData.error.code,
        };
      }
      break;
    case TwoFactorAuthenticationEnableStages.GENERIC_ERROR:
      (stageComponentProps as StageComponentProps).logEvent =
        logTwoFactorAuthenticationEnableErrorEvent;
      break;
  }
  return stage && VIEW_MAPPER[stage] ? (
    <Dialog
      isOpen
      modalContentClassName={classnames(allIgnoreClickOutsideClassName)}
      disableOutsideClickClose
      disableScrolling
      disableUserInputTrap
      disableEscapeKeyClose
      closeIconName={
        VIEW_MAPPER[stage].showCloseIcon
          ? translate(I18N_KEYS.CLOSE_DIALOG)
          : undefined
      }
      onClose={onClose}
    >
      {viewData?.currentStep ? (
        <Paragraph size="medium" color={colors.grey00}>
          {translate(I18N_KEYS.TWO_FACTOR_AUTHENTICATION_STAGE_HEADER, {
            stageIndex: viewData?.currentStep,
            totalStages: viewData?.totalSteps,
          })}
        </Paragraph>
      ) : null}
      {React.createElement(VIEW_MAPPER[stage].component, stageComponentProps)}
    </Dialog>
  ) : null;
};
