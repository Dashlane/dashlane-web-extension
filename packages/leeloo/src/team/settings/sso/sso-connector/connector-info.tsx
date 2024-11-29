import * as React from "react";
import { TeamSettings } from "@dashlane/communication";
import { FieldWithButton } from "../../../../libs/dashlane-style/field-with-button";
import useTranslate from "../../../../libs/i18n/useTranslate";
import Row from "../../base-page/row";
import styles from "./styles.css";
const I18N_KEYS = {
  CONNECTOR_URL_TITLE: "team_settings_connector_url_title",
  CONNECTOR_URL_DESCRIPTION: "team_settings_connector_url_description",
  CONNECTOR_URL_PLACEHOLDER: "team_settings_connector_url_placeholder",
  CONNECTOR_URL_ERROR: "team_settings_connector_url_error",
  CONNECTOR_EDIT: "team_settings_connector_edit",
  CONNECTOR_SAVE: "team_settings_connector_save",
  CONNECTOR_SAVING: "team_settings_connector_saving",
  CONNECTOR_SUCCESS: "team_settings_connector_success",
  PROVIDER_METADATA_TITLE: "team_settings_connector_metadata_title",
  PROVIDER_METADATA_PLACEHOLDER: "team_settings_connector_metadata_placeholder",
  PROVIDER_METADATA_ERROR: "team_settings_connector_metadata_error",
};
interface ConnectorInfoProps {
  saveIdpMetadata: (metadata: string) => Promise<void>;
  saveConnectorURL: (url: string) => Promise<void>;
  isTeamSettingsLoading: boolean;
  teamSettings?: TeamSettings;
}
export const ConnectorInfo = ({
  isTeamSettingsLoading,
  saveConnectorURL,
  saveIdpMetadata,
  teamSettings,
}: ConnectorInfoProps) => {
  const { translate } = useTranslate();
  return (
    <>
      <Row label={translate(I18N_KEYS.PROVIDER_METADATA_TITLE)}>
        <div className={styles.connectorInfoContainer}>
          <FieldWithButton
            isDisabled={isTeamSettingsLoading}
            multiLine
            defaultValue={teamSettings?.ssoIdpMetadata ?? ""}
            saveBtnLabel={translate(I18N_KEYS.CONNECTOR_SAVE)}
            savingBtnLabel={translate(I18N_KEYS.CONNECTOR_SAVING)}
            editBtnLabel={translate(I18N_KEYS.CONNECTOR_EDIT)}
            placeholder={translate(I18N_KEYS.PROVIDER_METADATA_PLACEHOLDER)}
            successMessage={translate(I18N_KEYS.CONNECTOR_SUCCESS)}
            onSave={saveIdpMetadata}
            inputFieldClassName={styles.inputField}
            textFieldClassName={styles.textField}
          />
        </div>
      </Row>
      <Row
        label={translate(I18N_KEYS.CONNECTOR_URL_TITLE)}
        labelHelper={translate(I18N_KEYS.CONNECTOR_URL_DESCRIPTION)}
      >
        <div className={styles.connectorInfoContainer}>
          <FieldWithButton
            isDisabled={isTeamSettingsLoading}
            defaultValue={teamSettings?.ssoServiceProviderUrl ?? ""}
            saveBtnLabel={translate(I18N_KEYS.CONNECTOR_SAVE)}
            savingBtnLabel={translate(I18N_KEYS.CONNECTOR_SAVING)}
            editBtnLabel={translate(I18N_KEYS.CONNECTOR_EDIT)}
            placeholder={translate(I18N_KEYS.CONNECTOR_URL_PLACEHOLDER)}
            successMessage={translate(I18N_KEYS.CONNECTOR_SUCCESS)}
            onSave={saveConnectorURL}
            textFieldClassName={styles.textField}
          />
        </div>
      </Row>
    </>
  );
};
