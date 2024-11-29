import { useEffect, useState } from "react";
import { Button } from "@dashlane/design-system";
import {
  DownloadIcon,
  OpenWebsiteIcon,
  Tooltip,
} from "@dashlane/ui-components";
import { downloadFile } from "../../../../libs/file-download/file-download";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { openUrl } from "../../../../libs/external-urls";
import { carbonConnector } from "../../../../libs/carbon/connector";
import colors from "../../../../libs/dashlane-style/globals/color-variables.css";
import Row from "../../base-page/row";
import { SSO_SETUP_GUIDE } from "../../../urls";
import { KeyGeneratorDisplay } from "./key-generator-display";
import styles from "./styles.css";
const I18N_KEYS = {
  INSTALLER_TITLE: "team_settings_connector_installer_title",
  INSTALLER_DESCRIPTION: "team_settings_connector_installer_description",
  INSTALLER_BUTTON: "team_settings_connector_installer_button",
  INSTALLER_CONFIG_BUTTON: "team_settings_connector_installer_config_button",
  INSTALLER_TOOLTIP: "team_settings_connector_installer_tooltip",
  INSTALLER_ERROR: "team_settings_connector_installer_error",
  INSTALLER_DOCUMENTATION_TITLE:
    "team_settings_connector_installer_setup_title",
  INSTALLER_DOCUMENTATION_DESCRIPTION:
    "team_settings_connector_installer_setup_description",
  GENERATOR_HELPER_WARNING: "team_settings_connector_generator_instance_help",
};
const CONFIG_FILE_NAME = "dashlane-sso-config.txt";
interface InstallerProps {
  isTeamSettingsLoading: boolean;
  isSsoEnabled: boolean;
  idpMetadata: string;
  connectorUrl: string;
}
export const Installer = ({
  isTeamSettingsLoading,
  isSsoEnabled,
  idpMetadata,
  connectorUrl,
}: InstallerProps) => {
  const { translate } = useTranslate();
  const [configError, setConfigError] = useState("");
  const [connectorKey, setConnectorKey] = useState("");
  useEffect(() => {
    setConfigError("");
  }, [idpMetadata, connectorUrl]);
  const generateKey = async () => {
    const key = await carbonConnector.generateSSOConnectorKey();
    setConnectorKey(key);
  };
  const createAndDownloadConfigScript = async () => {
    setConfigError("");
    const createConfigResponse = await carbonConnector.createSSOConnectorConfig(
      {
        connectorUrl,
        connectorKey,
        idpMetadata,
      }
    );
    if (createConfigResponse.success) {
      downloadFile(createConfigResponse.config, CONFIG_FILE_NAME, "text/plain");
    } else if (!createConfigResponse.success) {
      setConfigError(createConfigResponse.error.code);
    }
  };
  const openInstallerScriptDocumentation = () => openUrl(SSO_SETUP_GUIDE);
  const hasNeededConfigInfo = Boolean(
    idpMetadata && connectorUrl && (connectorKey || isSsoEnabled)
  );
  return (
    <>
      <KeyGeneratorDisplay
        keyValue={connectorKey}
        onGenerateClicked={generateKey}
        isGeneratorDisabled={isSsoEnabled}
        generatorDisabledText={translate(I18N_KEYS.GENERATOR_HELPER_WARNING)}
      />
      <Row
        label={translate(I18N_KEYS.INSTALLER_TITLE)}
        labelHelper={translate(I18N_KEYS.INSTALLER_DESCRIPTION)}
      >
        <div
          className={
            isTeamSettingsLoading
              ? styles.loading
              : styles.installerButtonContainer
          }
        >
          <Tooltip
            content={translate(I18N_KEYS.INSTALLER_TOOLTIP)}
            passThrough={hasNeededConfigInfo}
            sx={{ maxWidth: "210px" }}
          >
            <Button
              type="button"
              aria-describedby="configError"
              disabled={!hasNeededConfigInfo}
              onClick={createAndDownloadConfigScript}
            >
              <div className={styles.downloadIcon}>
                <DownloadIcon color={colors["--white"]} />
              </div>
              {translate(I18N_KEYS.INSTALLER_CONFIG_BUTTON)}
            </Button>
            {configError ? (
              <p id="configError" className={styles.errorText}>
                {translate(I18N_KEYS.INSTALLER_ERROR)}
              </p>
            ) : null}
          </Tooltip>
        </div>
      </Row>
      <Row
        label={translate(I18N_KEYS.INSTALLER_DOCUMENTATION_TITLE)}
        labelHelper={translate(I18N_KEYS.INSTALLER_DOCUMENTATION_DESCRIPTION)}
      >
        <div
          className={
            isTeamSettingsLoading
              ? styles.loading
              : styles.installerButtonContainer
          }
        >
          <Tooltip
            content={translate(I18N_KEYS.INSTALLER_TOOLTIP)}
            passThrough={hasNeededConfigInfo}
            sx={{ maxWidth: "210px" }}
          >
            <Button
              type="button"
              disabled={!hasNeededConfigInfo}
              onClick={openInstallerScriptDocumentation}
            >
              <div className={styles.openIcon}>
                <OpenWebsiteIcon color={colors["--white"]} />
              </div>
              {translate(I18N_KEYS.INSTALLER_BUTTON)}
            </Button>
          </Tooltip>
        </div>
      </Row>
    </>
  );
};
