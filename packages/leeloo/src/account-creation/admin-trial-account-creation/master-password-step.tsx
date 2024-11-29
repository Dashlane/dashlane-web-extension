import { useEffect } from "react";
import { BrowseComponent, PageView } from "@dashlane/hermes";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import {
  getUserFunnelCookieExtension,
  getUserFunnelCookieWebsite,
} from "../../libs/logs/getUserFunnelCookie";
import { logUserWebAccountCreationEvent } from "../../libs/logs/events/create-account/createAccount";
import {
  ConfirmSubmitOptions,
  MasterPasswordForm,
} from "../account-creation-form/confirm/masterpassword-form";
import { handleAccountCreationSubmit } from "../account-creation-form/handleFormsSubmitted";
import { StepCard } from "./step-card/step-card";
import { Lee } from "../../lee";
const I18N_KEYS = {
  CARD_TITLE: "webapp_auth_panel_standalone_account_creation_step2_header",
  CONFIRMED_AS:
    "webapp_auth_panel_standalone_account_creation_step2_confirmed_as",
};
interface MasterPasswordStepProps {
  lee: Lee;
  login: string;
  onSubmit: () => void;
}
export const MasterPasswordStep = ({
  lee,
  login,
  onSubmit,
}: MasterPasswordStepProps) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logPageView(
      PageView.AccountCreationCreateMasterPassword,
      BrowseComponent.Tac
    );
  }, []);
  const onEnterMasterPassword = async (
    confirmPageOptions: ConfirmSubmitOptions
  ): Promise<void> => {
    const userFunnelCookie = APP_PACKAGED_IN_EXTENSION
      ? await getUserFunnelCookieExtension()
      : await getUserFunnelCookieWebsite();
    await handleAccountCreationSubmit(lee, confirmPageOptions, login, true);
    logUserWebAccountCreationEvent(
      userFunnelCookie,
      confirmPageOptions.emailsTipsAndOffers.valueOr(false)
    );
    onSubmit();
  };
  return (
    <StepCard
      title={translate(I18N_KEYS.CARD_TITLE)}
      tag={{
        leadingIcon: "CheckmarkOutlined",
        label: translate(I18N_KEYS.CONFIRMED_AS, { login }),
      }}
    >
      <MasterPasswordForm
        login={login}
        isEu={lee.carbon.currentLocation.isEu}
        onSubmit={onEnterMasterPassword}
        isAdminSignUp={true}
        isEmployeeSignUp={false}
        withNewFlow={true}
      />
    </StepCard>
  );
};
