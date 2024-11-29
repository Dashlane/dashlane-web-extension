import * as React from "react";
import { InputWithCopyButton } from "../../../../libs/dashlane-style/text-input-with-action-button/input-with-copy-button";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { appendToUrl } from "../../../../libs/url-utils";
import { SSOSettingSectionProps } from "../types";
import Row from "../../base-page/row";
import styles from "./styles.css";
const I18N_KEYS = {
  SSO_CONNECTOR_METADATA: "team_settings_configure_idp_connector_metadata",
  ENTITY_ID: "team_settings_configure_idp_entity_id",
  LOGIN_URL: "team_settings_configure_idp_login_url",
};
export const ConfigureIDP = ({
  isTeamSettingsLoading,
  teamSettings,
}: SSOSettingSectionProps) => {
  const { translate } = useTranslate();
  const [ssoConnectorMetadata, setSSOConnectorMetadata] = React.useState("");
  const [entityID, setEntityID] = React.useState("");
  const [loginURL, setLoginUrl] = React.useState("");
  const ssoServiceProviderUrl = teamSettings?.ssoServiceProviderUrl;
  React.useEffect(() => {
    if (!isTeamSettingsLoading && ssoServiceProviderUrl) {
      setSSOConnectorMetadata(appendToUrl(ssoServiceProviderUrl, "saml"));
      setEntityID(appendToUrl(ssoServiceProviderUrl, "saml/"));
      setLoginUrl(appendToUrl(ssoServiceProviderUrl, "saml/callback"));
    }
  }, [isTeamSettingsLoading, ssoServiceProviderUrl]);
  return (
    <div className={styles.configureIDPContainer}>
      <Row label={translate(I18N_KEYS.SSO_CONNECTOR_METADATA)} centerLabel>
        <InputWithCopyButton
          inputValue={ssoConnectorMetadata}
          textInputProps={{
            fullWidth: true,
            readOnly: true,
          }}
        />
      </Row>
      <Row label={translate(I18N_KEYS.ENTITY_ID)} centerLabel>
        <InputWithCopyButton
          inputValue={entityID}
          textInputProps={{
            fullWidth: true,
            readOnly: true,
          }}
        />
      </Row>
      <Row label={translate(I18N_KEYS.LOGIN_URL)} centerLabel>
        <InputWithCopyButton
          inputValue={loginURL}
          textInputProps={{
            fullWidth: true,
            readOnly: true,
          }}
        />
      </Row>
    </div>
  );
};
