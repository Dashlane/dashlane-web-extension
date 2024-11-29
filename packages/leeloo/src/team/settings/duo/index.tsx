import { FocusEvent, FormEvent, useEffect, useRef, useState } from "react";
import { DataStatus } from "@dashlane/framework-react";
import { LeeWithStorage } from "../../../lee";
import * as actions from "./reducer";
import { ApiResponseError } from "../../../api/types";
import { SettingsPage } from "..";
import SwitchWithFeedback from "../../../libs/dashlane-style/switch";
import Row from "../base-page/row";
import { TextField } from "../../../libs/dashlane-style/text-field/text-field";
import PrimaryButton from "../../../libs/dashlane-style/buttons/modern/primary";
import SecondaryButton from "../../../libs/dashlane-style/buttons/modern/secondary";
import { FormButton } from "./form-button";
import settingsStyles from "../styles.css";
import styles from "./styles.css";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useAlertQueue } from "../../alerts/use-alert-queue";
import { useTeamDuoInfo } from "../hooks/use-team-duo-info";
const I18N_KEYS = {
  UPLOAD_CSV_FEEDBACK_ERROR: "team_settings_duo_upload_csv_feedback_error",
  UPLOAD_CSV_FEEDBACK_SUCCESS: "team_settings_duo_upload_csv_feedback_success",
  UPLOAD_CSV_FEEDBACK_PROGRESS:
    "team_settings_duo_upload_csv_feedback_progress",
  HEADER_GENERAL: "team_settings_duo_header_general",
  ENABLE_LABEL: "team_settings_duo_enable_label",
  ENABLE_HELPER: "team_settings_duo_enable_helper",
  HEADER_SETUP: "team_settings_duo_header_setup",
  INTEGRATION_KEY_LABEL: "team_settings_duo_integration_key_label",
  INTEGRATION_KEY_HELPER: "team_settings_duo_integration_key_helper",
  INTEGRATION_KEY_HINT: "team_settings_duo_integration_key_hint",
  INTEGRATION_KEY_BUTTON: "team_settings_duo_integration_key_button",
  SECRET_KEY_LABEL: "team_settings_duo_secret_key_label",
  SECRET_KEY_HELPER: "team_settings_duo_secret_key_helper",
  SECRET_KEY_HINT: "team_settings_duo_secret_key_hint",
  SECRET_KEY_BUTTON: "team_settings_duo_secret_key_button",
  API_HOST_LABEL: "team_settings_duo_api_host_label",
  API_HOST_HELPER: "team_settings_duo_api_host_helper",
  API_HOST_HINT: "team_settings_duo_api_host_hint",
  API_HOST_BUTTON: "team_settings_duo_api_host_button",
  HEADER_DIRECTORY: "team_settings_duo_header_directory",
  UPLOAD_CSV_LABEL: "team_settings_duo_upload_csv_label",
  UPLOAD_CSV_HELPER_STEP_ONE: "team_settings_duo_upload_csv_helper_step_one",
  UPLOAD_CSV_HELPER_STEP_TWO: "team_settings_duo_upload_csv_helper_step_two",
  UPLOAD_CSV_HELPER_STEP_THREE:
    "team_settings_duo_upload_csv_helper_step_three",
  UPLOAD_CSV_BUTTON_UPLOAD: "team_settings_duo_upload_csv_button_upload",
  UPLOAD_CSV_BUTTON_DOWNLOAD: "team_settings_duo_upload_csv_button_download",
  UPLOAD_CSV_ERROR_TITLE: "team_settings_duo_upload_csv_error_title",
  UPLOAD_CSV_ERROR_CODE: "team_settings_duo_upload_csv_error_",
  SWITCH_DEFAULT_ERROR: "_common_generic_error",
};
export interface State {
  hasDuo: boolean;
  duoIntegrationKey: string;
  duoSecretKey: string;
  duoApiHostname: string;
}
interface Props {
  lee: LeeWithStorage<State>;
}
const CSV_ACCEPTED_FORMATS = "text/csv, text/plain, .csv";
const DuoSettings = (props: Props) => {
  const { translate } = useTranslate();
  const { reportTACError } = useAlertQueue();
  const _shadowFileInputNode = useRef<HTMLInputElement | null>(null);
  const [isFetchingDuo, setIsFetchingDuo] = useState<boolean>(false);
  const [isFetchingDuoIntegrationKey, setIsFetchingDuoIntegrationKey] =
    useState<boolean>(false);
  const [
    isDuoIntegrationKeySaveButtonDisplayed,
    setIsDuoIntegrationKeySaveButtonDisplayed,
  ] = useState<boolean>(false);
  const [isFetchingDuoSecretKey, setIsFetchingDuoSecretKey] =
    useState<boolean>(false);
  const [
    isDuoSecretKeySaveButtonDisplayed,
    setIsDuoSecretKeySaveButtonDisplayed,
  ] = useState<boolean>(false);
  const [isFetchingDuoApiHostname, setIsFetchingDuoApiHostname] =
    useState<boolean>(false);
  const [isDuoApiHostSaveButtonDisplayed, setIsDuoApiHostSaveButtonDisplayed] =
    useState<boolean>(false);
  const [uploadingErrorCode, setUploadingErrorCode] = useState<string | null>(
    null
  );
  const [uploadingFileIsProcessed, setUploadingFileIsProcessed] =
    useState<boolean>(false);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null
  );
  const getTeamDuoInfo = useTeamDuoInfo();
  const getTeamPlans = () => {
    if (!props.lee.apiMiddleware.teamPlans) {
      reportTACError(new Error("teamPlans service not set in apiMiddleware"));
      return null;
    }
    return props.lee.apiMiddleware.teamPlans;
  };
  const teamPlans = getTeamPlans();
  const getStrongAuth = () => {
    if (!props.lee.apiMiddleware.strongAuth) {
      reportTACError(new Error("strongAuth service not set in apiMiddleware"));
      return null;
    }
    return props.lee.apiMiddleware.strongAuth;
  };
  const strongAuth = getStrongAuth();
  const _selectFile = (): void => {
    _shadowFileInputNode.current?.click();
  };
  const _cancelUpload = (): void => {
    if (!uploadingFileName) {
      return;
    }
    setUploadingFileName(null);
  };
  const _uploadFile = (): void => {
    _cancelUpload();
    const file = _shadowFileInputNode.current?.files?.[0] ?? { name: "" };
    setUploadingFileName(file.name);
    if (strongAuth) {
      strongAuth
        .uploadDuoCsv(file)
        .then(() => {
          setUploadingFileIsProcessed(true);
          setTimeout(() => setUploadingFileName(null), 2000);
        })
        .catch((error: ApiResponseError) => {
          setUploadingErrorCode(error.code.toLowerCase());
          setUploadingFileIsProcessed(true);
        });
    }
  };
  useEffect(() => {
    const _fetchData = (): void => {
      if (getTeamDuoInfo.status === DataStatus.Success && getTeamDuoInfo.data) {
        const { duo, duoIntegrationKey, duoSecretKey, duoApiHostname } =
          getTeamDuoInfo.data;
        props.lee.dispatch(
          actions.duoSettingsLoaded({
            duo,
            duoIntegrationKey,
            duoSecretKey,
            duoApiHostname,
          })
        );
      } else if (getTeamDuoInfo.status === DataStatus.Error) {
        console.error(
          `DuoSettings: fetchData failed with error: ${getTeamDuoInfo.error}`
        );
      }
    };
    _fetchData();
  }, [getTeamDuoInfo.data, getTeamDuoInfo.error, getTeamDuoInfo.status]);
  const _toggleDuo = (): Promise<void> => {
    const hasDuo = !props.lee.state.hasDuo;
    setIsFetchingDuo(true);
    props.lee.dispatch(actions.setDuo(hasDuo));
    return teamPlans
      ?.setSettings({ duo: hasDuo })
      .then(() => setIsFetchingDuo(false))
      .catch(() => {});
  };
  const _setDuoIntegrationKey = (event: FocusEvent<HTMLInputElement>): void => {
    if (isFetchingDuoIntegrationKey) {
      return;
    }
    const duoIntegrationKey = (event.target as HTMLInputElement).value;
    props.lee.dispatch(actions.setDuoIntegrationKey(duoIntegrationKey));
    setIsFetchingDuoIntegrationKey(true);
    setIsDuoIntegrationKeySaveButtonDisplayed(false);
    if (teamPlans) {
      teamPlans
        .setSettings({ duoIntegrationKey })
        .then(() => {
          setIsFetchingDuoIntegrationKey(false);
        })
        .catch(() => {});
    }
  };
  const _setDuoSecretKey = (event: FormEvent<HTMLInputElement>): void => {
    if (isFetchingDuoSecretKey) {
      return;
    }
    const duoSecretKey = (event.target as HTMLInputElement).value;
    props.lee.dispatch(actions.setDuoSecretKey(duoSecretKey));
    setIsFetchingDuoSecretKey(true);
    setIsDuoSecretKeySaveButtonDisplayed(false);
    if (teamPlans) {
      teamPlans
        .setSettings({ duoSecretKey })
        .then(() => {
          setIsFetchingDuoSecretKey(false);
        })
        .catch(() => {});
    }
  };
  const _setDuoApiHostname = (event: FormEvent<HTMLInputElement>): void => {
    if (isFetchingDuoApiHostname) {
      return;
    }
    const duoApiHostname = (event.target as HTMLInputElement).value;
    props.lee.dispatch(actions.setDuoApiHostname(duoApiHostname));
    setIsFetchingDuoApiHostname(true);
    setIsDuoApiHostSaveButtonDisplayed(false);
    if (teamPlans) {
      teamPlans
        .setSettings({ duoApiHostname })
        .then(() => {
          setIsFetchingDuoApiHostname(false);
        })
        .catch(() => {});
    }
  };
  const _getFileElement = () => {
    if (!uploadingFileName) {
      return [
        <div key="header" className={styles.fileTitleHeader}>
          duo_usernames.csv
        </div>,
      ];
    }
    return [
      <div key="header" className={styles.fileTitleHeader}>
        {uploadingFileName}
      </div>,
      <div key="progress" className={styles.fileProgressBackground}>
        <div
          className={
            uploadingFileIsProcessed
              ? styles.fileProgressComplete
              : styles.fileProgress
          }
        />
      </div>,
      <p
        key="hint"
        className={[
          styles.fileTitleHint,
          uploadingFileIsProcessed && uploadingErrorCode
            ? styles.fileTitleHintError
            : styles.fileTitleHintSuccess,
        ].join(" ")}
      >
        {uploadingFileIsProcessed
          ? uploadingErrorCode
            ? translate(I18N_KEYS.UPLOAD_CSV_FEEDBACK_ERROR)
            : translate(I18N_KEYS.UPLOAD_CSV_FEEDBACK_SUCCESS)
          : translate(I18N_KEYS.UPLOAD_CSV_FEEDBACK_PROGRESS)}
      </p>,
    ];
  };
  return (
    <SettingsPage title={translate(I18N_KEYS.HEADER_GENERAL)}>
      <p className={settingsStyles.settingsHeader}>
        {translate(I18N_KEYS.HEADER_GENERAL)}
      </p>
      <Row
        label={translate(I18N_KEYS.ENABLE_LABEL)}
        labelHelper={translate(I18N_KEYS.ENABLE_HELPER)}
      >
        <SwitchWithFeedback
          genericErrorMessage={translate(I18N_KEYS.SWITCH_DEFAULT_ERROR)}
          isDisabled={
            getTeamDuoInfo.status === DataStatus.Loading || isFetchingDuo
          }
          saveValueFunction={_toggleDuo}
          value={props.lee.state.hasDuo}
        />
      </Row>

      <p className={settingsStyles.settingsHeader}>
        {translate(I18N_KEYS.HEADER_SETUP)}
      </p>
      <Row
        label={translate(I18N_KEYS.INTEGRATION_KEY_LABEL)}
        labelHelper={translate(I18N_KEYS.INTEGRATION_KEY_HELPER)}
      >
        <TextField
          containerStyle={{ width: "300px" }}
          inputStyle={{ minHeight: 42 }}
          defaultValue={props.lee.state.duoIntegrationKey}
          isDisabled={isFetchingDuoIntegrationKey}
          onBlur={_setDuoIntegrationKey}
          onFocus={() => setIsDuoIntegrationKeySaveButtonDisplayed(true)}
          placeholder={translate(I18N_KEYS.INTEGRATION_KEY_HINT)}
        />
        {isDuoIntegrationKeySaveButtonDisplayed ||
        isFetchingDuoIntegrationKey ? (
          <div>
            <SecondaryButton
              label={translate(I18N_KEYS.INTEGRATION_KEY_BUTTON)}
              loading={isFetchingDuoIntegrationKey}
            />
          </div>
        ) : null}
      </Row>
      <Row
        label={translate(I18N_KEYS.SECRET_KEY_LABEL)}
        labelHelper={translate(I18N_KEYS.SECRET_KEY_HELPER)}
      >
        <TextField
          containerStyle={{ width: "300px" }}
          inputStyle={{ minHeight: 42 }}
          defaultValue={props.lee.state.duoSecretKey}
          isDisabled={isFetchingDuoSecretKey}
          onBlur={_setDuoSecretKey.bind(this)}
          onFocus={() => setIsDuoSecretKeySaveButtonDisplayed(true)}
          placeholder={translate(I18N_KEYS.SECRET_KEY_HINT)}
        />
        {isDuoSecretKeySaveButtonDisplayed || isFetchingDuoSecretKey ? (
          <div>
            <SecondaryButton
              label={translate(I18N_KEYS.SECRET_KEY_BUTTON)}
              loading={isFetchingDuoSecretKey}
            />
          </div>
        ) : null}
      </Row>
      <Row
        label={translate(I18N_KEYS.API_HOST_LABEL)}
        labelHelper={translate(I18N_KEYS.API_HOST_HELPER)}
      >
        <TextField
          containerStyle={{ width: "300px" }}
          inputStyle={{ minHeight: 42 }}
          defaultValue={props.lee.state.duoApiHostname}
          isDisabled={isFetchingDuoApiHostname}
          onBlur={_setDuoApiHostname.bind(this)}
          onFocus={() => setIsDuoApiHostSaveButtonDisplayed(true)}
          placeholder={translate(I18N_KEYS.API_HOST_HINT)}
        />
        {isDuoApiHostSaveButtonDisplayed || isFetchingDuoApiHostname ? (
          <div>
            <SecondaryButton
              label={translate(I18N_KEYS.API_HOST_BUTTON)}
              loading={isFetchingDuoApiHostname}
            />
          </div>
        ) : null}
      </Row>

      <p className={settingsStyles.settingsHeader}>
        {translate(I18N_KEYS.HEADER_DIRECTORY)}
      </p>
      <Row
        label={translate(I18N_KEYS.UPLOAD_CSV_LABEL)}
        labelHelper={
          <ol className={styles.uploadCsvLabel}>
            <li>{translate(I18N_KEYS.UPLOAD_CSV_HELPER_STEP_ONE)}</li>
            <li>{translate(I18N_KEYS.UPLOAD_CSV_HELPER_STEP_TWO)}</li>
            <li>{translate(I18N_KEYS.UPLOAD_CSV_HELPER_STEP_THREE)}</li>
          </ol>
        }
      >
        <div className={styles.fileContainer}>
          <div className={styles.file}>
            <span className={styles.fileIcon} />
            <div className={styles.fileTitle}>{_getFileElement()}</div>
          </div>
          <div className={styles.fileButtons}>
            <input
              type="file"
              id="file"
              accept={CSV_ACCEPTED_FORMATS}
              ref={_shadowFileInputNode}
              style={{ display: "none" }}
              onChange={_uploadFile.bind(this)}
            />
            <PrimaryButton
              label={translate(I18N_KEYS.UPLOAD_CSV_BUTTON_UPLOAD)}
              onClick={_selectFile.bind(this)}
            />
            <FormButton
              data={{
                login: props.lee.globalState.user.session.login,
                uki: props.lee.globalState.user.session.uki,
              }}
              label={translate(I18N_KEYS.UPLOAD_CSV_BUTTON_DOWNLOAD)}
              style={{ marginLeft: "16px" }}
              targetUri={"__REDACTED__"}
            />
          </div>
          {uploadingErrorCode ? (
            <div className={styles.fileError}>
              <div className={styles.fileErrorTitle}>
                <span className={styles.fileErrorTitleIcon}>!</span>
                {translate(I18N_KEYS.UPLOAD_CSV_ERROR_TITLE)}
              </div>
              <p className={styles.fileErrorContent}>
                {translate(
                  `${I18N_KEYS.UPLOAD_CSV_ERROR_CODE}${uploadingErrorCode}`
                )}
              </p>
            </div>
          ) : null}
        </div>
      </Row>
    </SettingsPage>
  );
};
export default DuoSettings;
