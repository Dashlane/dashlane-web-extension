import { EmailField, PasswordField } from "@dashlane/design-system";
import { GridChild, GridContainer } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { CopyToClipboardButton } from "../../../credentials/edit/copy-to-clipboard-control";
import { EMAIL_INPUT_ID, PASSWORD_INPUT_ID } from "../../helpers/constants";
import { logUserCopyEmailEvent, logUserCopyPasswordEvent } from "../../logs";
const I18N_KEYS = {
  EMAIL: "webapp_vpn_page_credential_active_login_label",
  PASSWORD: "webapp_vpn_page_credential_active_password_label",
  HIDE: "webapp_vpn_page_credential_active_hide_password",
  SHOW: "webapp_vpn_page_credential_active_show_password",
};
interface VpnCredentialProps {
  email: string;
  password: string;
  credentialId: string;
}
export const VpnCredential = ({
  email,
  password,
  credentialId,
}: VpnCredentialProps) => {
  const { translate } = useTranslate();
  return (
    <GridContainer
      gridTemplateColumns={"minmax(auto, 464px) auto"}
      gap="16px"
      alignItems="flex-end"
    >
      <EmailField
        sx={{ maxWidth: "464px" }}
        value={email}
        readOnly
        autoComplete="off"
        label={translate(I18N_KEYS.EMAIL)}
        id={EMAIL_INPUT_ID}
      />
      <GridChild>
        <CopyToClipboardButton
          data={email}
          onCopy={logUserCopyEmailEvent(credentialId)}
        />
      </GridChild>

      <form>
        <PasswordField
          sx={{ maxWidth: "464px" }}
          value={password}
          readOnly
          toggleVisibilityLabel={{
            hide: translate(I18N_KEYS.HIDE),
            show: translate(I18N_KEYS.SHOW),
          }}
          autoComplete="off"
          label={translate(I18N_KEYS.PASSWORD)}
          title={translate(I18N_KEYS.PASSWORD)}
          id={PASSWORD_INPUT_ID}
        />
      </form>
      <GridChild>
        <CopyToClipboardButton
          data={password}
          onCopy={logUserCopyPasswordEvent(credentialId)}
        />
      </GridChild>
    </GridContainer>
  );
};
