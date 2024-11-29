import { useEffect, useState } from "react";
import { Flex, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { Lee } from "../../lee";
import { SetupLayout } from "../../webapp/layout/setup-layout";
import { InfoSubmitOptions } from "../account-creation-form/info-form/info-form";
import { useAccountCreationForm } from "../hooks/use-account-creation-form";
import { FlowStepper } from "./flow-stepper/flow-stepper";
import { AdminTrialAccountCreationStep, StepConfiguration } from "./types";
import { AddEmailStep } from "./add-email-step";
import { InstallExtensionStep } from "./install-extension-step";
import { MasterPasswordStep } from "./master-password-step";
import { logAdminSkipClick } from "../account-creation-form/logs";
const STEP_I18N_KEYS = {
  SUBMIT_FORM: "webapp_auth_panel_submit_form_step",
  VERIFY_EMAIL: "webapp_auth_panel_verify_email_step",
  INSTALL_EXTENSION: "webapp_auth_panel_install_extension_step",
  CREATE_MASTER_PASSWORD: "webapp_auth_panel_create_master_password_step",
  FLOW_TITLE: "webapp_auth_panel_create_your_account_title",
};
interface AdminTrialAccountCreationProps {
  lee: Lee;
}
export const AdminTrialAccountCreation = ({
  lee,
}: AdminTrialAccountCreationProps) => {
  const { translate } = useTranslate();
  const staticSteps = [
    {
      step: AdminTrialAccountCreationStep.SubmitTrialForm,
      disabled: false,
      done: true,
      label: translate(STEP_I18N_KEYS.SUBMIT_FORM),
    },
    {
      step: AdminTrialAccountCreationStep.VerifyEmail,
      disabled: false,
      done: true,
      label: translate(STEP_I18N_KEYS.VERIFY_EMAIL),
    },
  ];
  const dynamicSteps = [
    {
      step: AdminTrialAccountCreationStep.InstallExtension,
      disabled: false,
      done: false,
      skipped: false,
      label: translate(STEP_I18N_KEYS.INSTALL_EXTENSION),
    },
    {
      step: AdminTrialAccountCreationStep.EnterMasterPassword,
      disabled: true,
      done: false,
      label: translate(STEP_I18N_KEYS.CREATE_MASTER_PASSWORD),
    },
  ];
  const [stepStatus, setStepStatus] = useState<Array<StepConfiguration>>([
    ...staticSteps,
    ...dynamicSteps,
  ]);
  const { emailQueryParam, withSkipButtonQueryParam } =
    useAccountCreationForm();
  const [login, setLogin] = useState(emailQueryParam);
  const [hasBeenRedirected, setHasBeenRedirected] = useState(false);
  const [adminHasSkippedInstall, setAdminHasSkippedInstall] = useState(false);
  const [currentStep, setCurrentStep] = useState(
    AdminTrialAccountCreationStep.EnterAccountEmail
  );
  const goToStep = (step: AdminTrialAccountCreationStep): void => {
    setCurrentStep(step);
  };
  useEffect(() => {
    if (emailQueryParam) {
      setLogin(emailQueryParam);
    }
  }, [emailQueryParam]);
  useEffect(() => {
    if (!APP_PACKAGED_IN_EXTENSION && !adminHasSkippedInstall) {
      goToStep(AdminTrialAccountCreationStep.InstallExtension);
    }
    if (APP_PACKAGED_IN_EXTENSION) {
      setStepStatus([
        ...staticSteps,
        {
          step: AdminTrialAccountCreationStep.InstallExtension,
          disabled: false,
          done: true,
          skipped: false,
          label: translate(STEP_I18N_KEYS.INSTALL_EXTENSION),
        },
        {
          step: AdminTrialAccountCreationStep.EnterMasterPassword,
          disabled: false,
          done: false,
          label: translate(STEP_I18N_KEYS.CREATE_MASTER_PASSWORD),
        },
      ]);
    }
  }, [adminHasSkippedInstall, currentStep]);
  const handleSkipInstallExtensionClick = (): void => {
    setStepStatus([
      ...staticSteps,
      {
        step: AdminTrialAccountCreationStep.InstallExtension,
        disabled: true,
        done: false,
        skipped: true,
        label: translate(STEP_I18N_KEYS.INSTALL_EXTENSION),
      },
      {
        step: AdminTrialAccountCreationStep.EnterMasterPassword,
        disabled: false,
        done: false,
        label: translate(STEP_I18N_KEYS.CREATE_MASTER_PASSWORD),
      },
    ]);
    goToStep(AdminTrialAccountCreationStep.EnterAccountEmail);
    setAdminHasSkippedInstall(true);
    logAdminSkipClick();
  };
  const onEnterAccountEmail = (info: InfoSubmitOptions): void => {
    setLogin(info.login ?? "");
    goToStep(AdminTrialAccountCreationStep.EnterMasterPassword);
  };
  const onSubmitMasterPassword = () => {
    goToStep(AdminTrialAccountCreationStep.ConfirmMasterPassword);
  };
  return (
    <SetupLayout>
      <Flex flexDirection="column" alignItems="center" gap="40px">
        <Paragraph textStyle="ds.title.section.large">
          {translate(STEP_I18N_KEYS.FLOW_TITLE)}
        </Paragraph>

        <FlowStepper currentStep={currentStep} steps={stepStatus} />

        {currentStep === AdminTrialAccountCreationStep.EnterAccountEmail ? (
          <AddEmailStep
            lee={lee}
            loginValue={login}
            setLoginValue={setLogin}
            onSubmit={onEnterAccountEmail}
            hasBeenRedirected={hasBeenRedirected}
            setHasBeenRedirected={setHasBeenRedirected}
          />
        ) : null}

        {currentStep === AdminTrialAccountCreationStep.InstallExtension ? (
          <InstallExtensionStep
            email={login}
            showSkipInstallButton={withSkipButtonQueryParam}
            handleSkipButton={handleSkipInstallExtensionClick}
          />
        ) : null}

        {[
          AdminTrialAccountCreationStep.EnterMasterPassword,
          AdminTrialAccountCreationStep.ConfirmMasterPassword,
        ].includes(currentStep) ? (
          <MasterPasswordStep
            lee={lee}
            login={login}
            onSubmit={onSubmitMasterPassword}
          />
        ) : null}
      </Flex>
    </SetupLayout>
  );
};
