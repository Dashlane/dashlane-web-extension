import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Paragraph } from "@dashlane/design-system";
import { BrowseComponent, PageView, SignupFlowStep } from "@dashlane/hermes";
import { GridContainer } from "@dashlane/ui-components";
import { Lee } from "../../lee";
import { handleAccountCreationSubmit } from "./handleFormsSubmitted";
import { InfoForm, InfoSubmitOptions } from "./info-form/info-form";
import {
  ConfirmSubmitOptions,
  MasterPasswordForm,
} from "./confirm/masterpassword-form";
import { UserPendingInvitationScreen } from "../user-pending-invitation-screen/user-pending-invitation-screen";
import { logPageView } from "../../libs/logs/logEvent";
import { useHistory } from "../../libs/router";
import { logUserWebAccountCreationEvent } from "../../libs/logs/events/create-account/createAccount";
import {
  getUserFunnelCookieExtension,
  getUserFunnelCookieWebsite,
} from "../../libs/logs/getUserFunnelCookie";
import { ChooseAccountTypeScreen } from "./choose-account-type-screen";
import { EnterPinCodeScreen } from "./enter-pin-code-screen";
import { ConfirmPinCodeScreen } from "./confirm-pin-code-screen";
import { createSignUpCookie } from "../helpers";
import { InstallExtensionScreen } from "./install-extension-screen";
import { logAdminSkipClick, logUserSignupToDashlaneEvent } from "./logs";
import { AccountCreationFlowType, AccountCreationStep } from "../types";
import { useAccountCreationForm } from "../hooks/use-account-creation-form";
import useTranslate from "../../libs/i18n/useTranslate";
const stepToPageView: Record<AccountCreationStep, PageView> = {
  enterAccountEmail: PageView.AccountCreationEmail,
  chooseAccountType: PageView.AccountCreation,
  enterMasterPassword: PageView.AccountCreationCreateMasterPassword,
  confirmMasterPassword: PageView.AccountCreationConfirmMasterPassword,
  enterPinCode: PageView.AccountCreation,
  confirmPinCode: PageView.AccountCreation,
  installExtensionB2B: PageView.AccountCreationInstallExtension,
  installExtensionB2C: PageView.AccountCreationInstallExtension,
  pendingInvitation: PageView.JoinDashlaneTeamPendingInvitation,
  expiredInvitation: PageView.JoinDashlaneTeamExpiredInvitation,
};
interface AccountCreationFormProps {
  lee: Lee;
  signUpFlow: AccountCreationFlowType;
  currentStep: AccountCreationStep;
  setCurrentStep: (currentStep: AccountCreationStep) => void;
  isAcceptTeamInviteCheckDone: boolean;
}
const STEP_NUMBERS: Record<AccountCreationStep, number> = {
  [AccountCreationStep.InstallExtensionB2C]: 1,
  [AccountCreationStep.EnterPinCode]: 2,
  [AccountCreationStep.ConfirmPinCode]: 3,
  [AccountCreationStep.InstallExtensionB2B]: 0,
  [AccountCreationStep.ConfirmMasterPassword]: 0,
  [AccountCreationStep.ChooseAccountType]: 0,
  [AccountCreationStep.EnterMasterPassword]: 0,
  [AccountCreationStep.ExpiredInvitation]: 0,
  [AccountCreationStep.PendingInvitation]: 0,
  [AccountCreationStep.EnterAccountEmail]: 0,
};
const BACK_STEP: Record<AccountCreationStep, AccountCreationStep> = {
  [AccountCreationStep.ChooseAccountType]:
    AccountCreationStep.EnterAccountEmail,
  [AccountCreationStep.EnterMasterPassword]:
    AccountCreationStep.ChooseAccountType,
  [AccountCreationStep.EnterPinCode]: AccountCreationStep.EnterAccountEmail,
  [AccountCreationStep.ConfirmMasterPassword]:
    AccountCreationStep.EnterMasterPassword,
  [AccountCreationStep.ConfirmPinCode]: AccountCreationStep.EnterPinCode,
  [AccountCreationStep.InstallExtensionB2C]:
    AccountCreationStep.ChooseAccountType,
  [AccountCreationStep.ExpiredInvitation]:
    AccountCreationStep.EnterAccountEmail,
  [AccountCreationStep.PendingInvitation]:
    AccountCreationStep.EnterAccountEmail,
  [AccountCreationStep.InstallExtensionB2B]:
    AccountCreationStep.InstallExtensionB2B,
  [AccountCreationStep.EnterAccountEmail]:
    AccountCreationStep.EnterAccountEmail,
};
const I18N_KEYS = {
  BACK_LABEL: "webapp_auth_panel_standalone_account_creation_back_label",
};
export const AccountCreationForm = ({
  lee,
  signUpFlow,
  currentStep,
  setCurrentStep,
  isAcceptTeamInviteCheckDone,
}: AccountCreationFormProps) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const {
    emailQueryParam,
    prefilledTeamKey,
    isFromMassDeployment,
    createPasswordlessAccount,
  } = useAccountCreationForm();
  const [login, setLogin] = useState(emailQueryParam);
  const [hasBeenRedirected, setHasBeenRedirected] = useState(false);
  const [adminHasSkippedInstall, setAdminHasSkippedInstall] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const isEmployeeSignUp = signUpFlow === AccountCreationFlowType.EMPLOYEE;
  const isAdminSignUp = signUpFlow === AccountCreationFlowType.ADMIN;
  const isB2CSignup = signUpFlow === AccountCreationFlowType.B2C;
  const isCurrentStepInstallExtension =
    currentStep === AccountCreationStep.InstallExtensionB2B ||
    currentStep === AccountCreationStep.InstallExtensionB2C;
  const logActiveStepPageView = useCallback(
    (step?: AccountCreationStep) => {
      if (isCurrentStepInstallExtension) {
        return;
      }
      if (stepToPageView[step ?? currentStep]) {
        logPageView(
          stepToPageView[step ?? currentStep],
          isAdminSignUp ? BrowseComponent.Tac : BrowseComponent.MainApp
        );
      }
    },
    [currentStep, isAdminSignUp]
  );
  const goToStep = (step: AccountCreationStep): void => {
    setCurrentStep(step);
    logActiveStepPageView(step);
  };
  useEffect(() => {
    if (
      !APP_PACKAGED_IN_EXTENSION &&
      signUpFlow !== AccountCreationFlowType.B2C &&
      !adminHasSkippedInstall
    ) {
      goToStep(AccountCreationStep.InstallExtensionB2B);
    }
  }, [currentStep]);
  useEffect(() => {
    logActiveStepPageView();
  }, [logActiveStepPageView]);
  useEffect(() => {
    if (isEmployeeSignUp) {
      logPageView(
        isCurrentStepInstallExtension
          ? PageView.JoinDashlaneTeamInstallExtension
          : PageView.AccountCreationEmail
      );
      logUserSignupToDashlaneEvent(
        isCurrentStepInstallExtension
          ? SignupFlowStep.InstallExtension
          : SignupFlowStep.EnterEmailAddress,
        prefilledTeamKey,
        isFromMassDeployment
      );
    }
  }, [currentStep, prefilledTeamKey, isEmployeeSignUp, isFromMassDeployment]);
  useEffect(() => {
    if (emailQueryParam) {
      setLogin(emailQueryParam);
    }
  }, [emailQueryParam, setLogin]);
  useEffect(() => {
    if (isEmployeeSignUp && !APP_PACKAGED_IN_EXTENSION) {
      createSignUpCookie({
        login,
        prefilledTeamKey,
        flowType: AccountCreationFlowType.EMPLOYEE,
      });
    }
  }, [history, isEmployeeSignUp, login, prefilledTeamKey]);
  const handleSkipInstallExtensionClick = (): void => {
    goToStep(AccountCreationStep.EnterAccountEmail);
    setAdminHasSkippedInstall(true);
    logAdminSkipClick();
  };
  const onEnterAccountEmail = (info: InfoSubmitOptions): void => {
    setLogin(info.login ?? "");
    const isProposedExpired = info.isProposedExpired ?? false;
    if (info.isUserProposed) {
      goToStep(
        isProposedExpired
          ? AccountCreationStep.ExpiredInvitation
          : AccountCreationStep.PendingInvitation
      );
    } else if (isB2CSignup && !info.isUserAccepted) {
      goToStep(AccountCreationStep.ChooseAccountType);
    } else {
      goToStep(AccountCreationStep.EnterMasterPassword);
    }
  };
  const onEnterMasterPassword = async (
    confirmPageOptions: ConfirmSubmitOptions
  ): Promise<void> => {
    const userFunnelCookie = APP_PACKAGED_IN_EXTENSION
      ? await getUserFunnelCookieExtension()
      : await getUserFunnelCookieWebsite();
    goToStep(AccountCreationStep.ConfirmMasterPassword);
    await handleAccountCreationSubmit(
      lee,
      confirmPageOptions,
      login,
      isAdminSignUp
    );
    logUserWebAccountCreationEvent(
      userFunnelCookie,
      confirmPageOptions.emailsTipsAndOffers.valueOr(false)
    );
    if (isEmployeeSignUp) {
      logUserSignupToDashlaneEvent(
        SignupFlowStep.LoginToAccount,
        prefilledTeamKey,
        isFromMassDeployment
      );
    }
  };
  const stepNumber = STEP_NUMBERS[currentStep];
  const goBack = () => {
    setCurrentStep(BACK_STEP[currentStep]);
  };
  return (
    <div
      sx={{
        maxWidth: "650px",
        width: "100%",
        height: "100%",
      }}
    >
      <GridContainer
        gridAutoFlow="column"
        gridTemplateColumns="auto 1fr"
        justifyContent="center"
        alignItems="center"
        sx={{
          visibility: stepNumber > 0 ? "visible" : "hidden",
          marginBottom: "64px",
        }}
      >
        <Button
          intensity="supershy"
          layout="iconLeading"
          icon="ArrowLeftOutlined"
          type="button"
          onClick={goBack}
          data-testid="back"
        >
          {translate(I18N_KEYS.BACK_LABEL)}
        </Button>
        <Paragraph
          sx={{
            textAlign: "right",
          }}
          textStyle="ds.body.helper.regular"
        >
          {stepNumber} / 3
        </Paragraph>
      </GridContainer>

      {currentStep === AccountCreationStep.EnterAccountEmail ? (
        <Flex flexDirection="column" gap={4} sx={{ marginTop: "80px" }}>
          <InfoForm
            hasBeenRedirected={hasBeenRedirected}
            setHasBeenRedirected={setHasBeenRedirected}
            lee={lee}
            onSubmit={onEnterAccountEmail}
            isB2BFlow={isAdminSignUp || isEmployeeSignUp}
            isEmployeeSignUpFlow={isEmployeeSignUp}
            loginValue={login}
            setLoginValue={setLogin}
            isAcceptTeamInviteCheckDone={isAcceptTeamInviteCheckDone}
          />
        </Flex>
      ) : null}
      {currentStep === AccountCreationStep.InstallExtensionB2B ||
      currentStep === AccountCreationStep.InstallExtensionB2C ? (
        <InstallExtensionScreen
          signUpFlow={signUpFlow}
          onSkipInstallExtension={handleSkipInstallExtensionClick}
        />
      ) : null}
      {currentStep === AccountCreationStep.ChooseAccountType ? (
        <ChooseAccountTypeScreen
          onChooseMpBasedAccount={() =>
            goToStep(AccountCreationStep.EnterMasterPassword)
          }
          onChoosePasswordlessAccount={() => {
            if (!APP_PACKAGED_IN_EXTENSION) {
              goToStep(AccountCreationStep.InstallExtensionB2C);
              return;
            }
            goToStep(AccountCreationStep.EnterPinCode);
          }}
        />
      ) : null}

      {currentStep === AccountCreationStep.PendingInvitation ||
      currentStep === AccountCreationStep.ExpiredInvitation ? (
        <UserPendingInvitationScreen
          loginEmail={login}
          invitationIsExpired={
            currentStep === AccountCreationStep.ExpiredInvitation
          }
          handleUserIgnoreAction={goToStep}
        />
      ) : null}
      {currentStep === AccountCreationStep.EnterMasterPassword ||
      currentStep === AccountCreationStep.ConfirmMasterPassword ? (
        <Flex flexDirection="column" gap={4}>
          <MasterPasswordForm
            login={login}
            isEu={lee.carbon.currentLocation.isEu}
            backStep={goToStep}
            onSubmit={onEnterMasterPassword}
            isAdminSignUp={isAdminSignUp}
            isEmployeeSignUp={isEmployeeSignUp}
          />
        </Flex>
      ) : null}
      {currentStep === AccountCreationStep.EnterPinCode ? (
        <EnterPinCodeScreen
          loginEmail={login}
          onEnterPin={(pin: string) => {
            setPinCode(pin);
            goToStep(AccountCreationStep.ConfirmPinCode);
          }}
        />
      ) : null}
      {currentStep === AccountCreationStep.ConfirmPinCode ? (
        <ConfirmPinCodeScreen
          loginEmail={login}
          pinCode={pinCode}
          isEu={lee.carbon.currentLocation.isEu}
          onConfirmPin={createPasswordlessAccount}
        />
      ) : null}
    </div>
  );
};
