import useTranslate from "../../../../libs/i18n/useTranslate";
import { Step } from "./step/step";
const I18N_KEYS = {
  REQUEST_TITLE:
    "team_settings_master_password_policies_settings_stepper_step_request_title",
  REQUEST_SUBTITLE:
    "team_settings_master_password_policies_settings_stepper_step_request_subtitle",
  APPROVAL_TITLE:
    "team_settings_master_password_policies_settings_stepper_step_approval_title",
  APPROVAL_SUBTITLE:
    "team_settings_master_password_policies_settings_stepper_step_approval_subtitle",
  RECOVER_TITLE:
    "team_settings_master_password_policies_settings_stepper_step_recover_title",
  RECOVER_SUBTITLE:
    "team_settings_master_password_policies_settings_stepper_step_recover_subtitle",
  LOGIN_TITLE:
    "team_settings_master_password_policies_settings_stepper_step_login_title",
  LOGIN_SUBTITLE:
    "team_settings_master_password_policies_settings_stepper_step_login_subtitle",
};
export const Stepper = () => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "row",
        marginBottom: 40,
        gap: "24px",
      }}
    >
      <Step
        index={1}
        header={translate(I18N_KEYS.REQUEST_TITLE)}
        content={translate(I18N_KEYS.REQUEST_SUBTITLE)}
      />

      <Step
        index={2}
        header={translate(I18N_KEYS.APPROVAL_TITLE)}
        content={translate(I18N_KEYS.APPROVAL_SUBTITLE)}
      />
      <Step
        index={3}
        header={translate(I18N_KEYS.RECOVER_TITLE)}
        content={translate(I18N_KEYS.RECOVER_SUBTITLE)}
      />
      <Step
        index={4}
        header={translate(I18N_KEYS.LOGIN_TITLE)}
        content={translate(I18N_KEYS.LOGIN_SUBTITLE)}
      />
    </div>
  );
};
