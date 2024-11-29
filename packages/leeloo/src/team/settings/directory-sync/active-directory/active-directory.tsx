import { FormEvent, MouseEvent, useCallback, useEffect, useState } from "react";
import { Icon, IndeterminateLoader, Paragraph } from "@dashlane/design-system";
import { GridChild, GridContainer } from "@dashlane/ui-components";
import { PageView } from "@dashlane/hermes";
import { AccountInfo } from "@dashlane/communication";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { AvailableFeatureFlips } from "@dashlane/team-admin-contracts";
import { LeeWithStorage } from "../../../../lee";
import { fromUnixTime } from "date-fns";
import { logPageView } from "../../../../libs/logs/logEvent";
import { LocaleFormat } from "../../../../libs/i18n/helpers";
import useTranslate from "../../../../libs/i18n/useTranslate";
import SwitchWithFeedback from "../../../../libs/dashlane-style/switch";
import { TextField } from "../../../../libs/dashlane-style/text-field/text-field";
import PrimaryButton from "../../../../libs/dashlane-style/buttons/modern/primary";
import SecondaryButton from "../../../../libs/dashlane-style/buttons/modern/secondary";
import { useAlertQueue } from "../../../alerts/use-alert-queue";
import { InviteLinkSharingDialog } from "../../../invite-link-sharing-dialog/invite-link-sharing-dialog";
import { SettingsPage } from "../..";
import { useTeamSpaceContext } from "../../components/TeamSpaceContext";
import { LinkCard, LinkType } from "../../components/layout/link-card";
import { useLastADSyncDate } from "../../hooks/useLastADSyncDate";
import { useInviteLinkData } from "../../hooks/useInviteLinkData";
import { useInviteLinkDataGraphene } from "../../hooks/use-invite-link";
import { ActiveDirectorySettingsLoadedParams } from "./reducer";
import Row from "../../base-page/row";
import { getInviteLinkWithTeamKey } from "../../../urls";
import { TeamPlansActiveDirectorySyncStatus } from "./types";
import { ActiveDirectoryPaywall } from "./active-directory-paywall";
import * as actions from "./reducer";
import { BackPageLayout } from "../../components/layout/back-page-layout";
import { useTeamSettings } from "../../../../team/settings/hooks/useTeamSettings";
import { ShareInviteLinkDialog } from "../../../invite-link-sharing-dialog/share-invite-link-dialog";
import { RowGroup } from "../../base-page/row-group";
const I18N_KEYS = {
  LAST_SUCCESSFUL_SYNC_DATE_VALUE_NEVER:
    "team_settings_active_directory_last_successful_sync_date_value_never",
  LAST_ERROR_MESSAGE_LABEL:
    "team_settings_active_directory_last_error_message_label",
  LAST_ERROR_DATE_LABEL: "team_settings_active_directory_last_error_date_label",
  FAIL_COUNT_LABEL: "team_settings_active_directory_fail_count_label",
  TITLE_HELP: "team_settings_active_directory_title_help",
  HEADER_LABEL: "team_settings_active_directory_header_label",
  HEADER_HELPER: "team_settings_active_directory_header_helper",
  HEADER_BUTTON_LABEL: "team_settings_active_directory_header_button_label",
  TITLE_STATUS: "team_settings_active_directory_title_status",
  LAST_SUCCESSFUL_SYNC_DATE_LABEL:
    "team_settings_active_directory_last_successful_sync_date_label",
  TITLE_SETUP: "team_settings_active_directory_title_setup",
  AUTOMATED_PROVISIONING_LABEL:
    "team_settings_active_directory_automated_provisioning_label",
  AUTOMATED_PROVISIONING_HELPER:
    "team_settings_active_directory_automated_provisioning_helper",
  AUTOMATED_DEPROVISIONING_LABEL:
    "team_settings_active_directory_automated_deprovisioning_label",
  AUTOMATED_DEPROVISIONING_HELPER:
    "team_settings_active_directory_automated_deprovisioning_helper",
  CRON_SCRIPT_LABEL: "team_settings_active_directory_cron_script_label",
  CRON_SCRIPT_HELPER: "team_settings_active_directory_cron_script_helper",
  BUTTON_COPY_FEEDBACK: "team_settings_active_directory_button_copy_feedback",
  BUTTON_COPY_LABEL: "team_settings_active_directory_button_copy_label",
  SWITCH_DEFAULT_ERROR: "_common_generic_error",
  GENERIC_ERROR: "_common_generic_error",
  SHARE_INVITE_LINK_TITLE:
    "team_settings_encryption_service_scim_invite_link_heading",
  SHARE_INVITE_LINK_DESC:
    "team_settings_encryption_service_scim_invite_link_description_first",
  SHARE_INVITE_LINK_CTA:
    "team_settings_encryption_service_scim_invite_link_copy",
};
export interface State {
  activeDirectoryScript: string;
  activeDirectorySyncStatus: TeamPlansActiveDirectorySyncStatus;
  activeDirectorySyncType: string | null;
  isCopied: boolean;
}
interface Props {
  lee: LeeWithStorage<State>;
  disableForm: boolean;
  adSyncEnabled: boolean;
  isAdSyncCapable?: boolean;
  accountInfo: AccountInfo;
}
export const ActiveDirectorySettings = ({
  lee,
  disableForm,
  adSyncEnabled,
  isAdSyncCapable,
  accountInfo,
}: Props) => {
  const { translate } = useTranslate();
  const inviteLinkGrapheneFF = useFeatureFlip(
    AvailableFeatureFlips.WebOnboardingInviteLinkTacMigration
  );
  const teamDataGraphene = useInviteLinkDataGraphene();
  const teamKey =
    teamDataGraphene.status === DataStatus.Success
      ? teamDataGraphene.teamKey
      : undefined;
  const { reportTACError } = useAlertQueue();
  const { lastADSyncDateError, lastADSyncDateLoading, lastADSyncDate } =
    useLastADSyncDate();
  const _shortDate = translate.shortDate;
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [
    isFetchingAutomatedDeprovisioning,
    setIsFetchingAutomatedDeprovisioning,
  ] = useState<boolean>(false);
  const [hasAutoDeprovisioning, setHasAutoDeprovisioning] =
    useState<boolean>(false);
  const [isFetchingAutomatedProvisioning, setIsFetchingAutomatedProvisioning] =
    useState<boolean>(false);
  const [hasAutoProvisioning, setHasAutoProvisioning] =
    useState<boolean>(false);
  const { inviteLinkDataForAdmin, getInviteLinkDataForAdmin } =
    useInviteLinkData();
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [localActiveDirectoryToken, setLocalActiveDirectoryToken] = useState<
    string | undefined
  >(undefined);
  const { teamId } = useTeamSpaceContext();
  const { teamSettings, teamSettingsLoading, updateTeamSettings } =
    useTeamSettings(teamId);
  const calculateAutoDeprovisioning = (syncType: string): boolean =>
    ["full", "deprovision-only"].includes(syncType);
  const calculateAutoProvisioning = (syncType: string): boolean =>
    ["full", "provision-only"].includes(syncType);
  const teamPlans = useCallback(() => {
    if (!lee.apiMiddleware.teamPlans) {
      reportTACError(new Error("teamPlans service missing from apiMiddleware"));
      return null;
    }
    return lee.apiMiddleware.teamPlans;
  }, []);
  useEffect(() => {
    logPageView(PageView.TacSettingsDirectorySyncActiveDirectory);
  }, []);
  useEffect(() => {
    if (inviteLinkGrapheneFF === false) {
      getInviteLinkDataForAdmin();
    }
  }, [getInviteLinkDataForAdmin, inviteLinkGrapheneFF]);
  const generateAdToken = async () => {
    const teamPlansResult = await teamPlans();
    if (!teamPlansResult) {
      return;
    }
    const { activeDirectorySyncStatus, activeDirectoryToken } =
      await teamPlansResult.getADToken();
    setLocalActiveDirectoryToken(activeDirectoryToken);
    return {
      activeDirectorySyncStatus,
      activeDirectoryToken,
    };
  };
  const fetchData = useCallback((): void => {
    if (!teamSettings) {
      return;
    }
    const {
      activeDirectorySyncType,
      activeDirectoryToken,
      activeDirectorySyncStatus,
    } = teamSettings;
    try {
      const activeDirectorySettingsParam = {
        activeDirectorySyncStatus,
        activeDirectorySyncType,
        activeDirectoryToken,
        teamId,
      };
      setLocalActiveDirectoryToken(activeDirectoryToken);
      lee.dispatch(
        actions.activeDirectorySettingsLoaded(
          activeDirectorySettingsParam as ActiveDirectorySettingsLoadedParams
        )
      );
      setHasAutoDeprovisioning(
        calculateAutoDeprovisioning(activeDirectorySyncType ?? "")
      );
      setHasAutoProvisioning(
        calculateAutoProvisioning(activeDirectorySyncType ?? "")
      );
      setIsFetching(false);
    } catch (error) {
      console.error(
        `ActiveDirectorySettings - fetchData: failed with error: ${error}`
      );
    }
  }, [lee, teamId, teamSettings]);
  useEffect(() => {
    if (!teamSettingsLoading) {
      return;
    }
    fetchData();
  }, [_shortDate, teamSettingsLoading, fetchData]);
  if (inviteLinkGrapheneFF === null || inviteLinkGrapheneFF === undefined) {
    return null;
  }
  const copyScript = () => {
    navigator.clipboard.writeText(lee.state.activeDirectoryScript).then(() => {
      lee.dispatch(actions.toggleScriptCopyFeedback(true));
      window.setTimeout(
        () => lee.dispatch(actions.toggleScriptCopyFeedback(false)),
        700
      );
    });
  };
  const calculateSyncType = (
    hasAutoProvisioningValue: boolean,
    hasAutoDeprovisioningValue: boolean
  ): string | null =>
    hasAutoProvisioningValue
      ? hasAutoDeprovisioningValue
        ? "full"
        : "provision-only"
      : hasAutoDeprovisioningValue
      ? "deprovision-only"
      : null;
  const toggleDeprovisioning = async (): Promise<void> => {
    if (isFetchingAutomatedDeprovisioning) {
      return Promise.resolve();
    }
    setIsFetchingAutomatedDeprovisioning(true);
    const newHasAutoDeprovisioning = !hasAutoDeprovisioning;
    const activeDirectorySyncType = calculateSyncType(
      hasAutoProvisioning,
      newHasAutoDeprovisioning
    );
    try {
      await updateTeamSettings({
        activeDirectorySyncType: activeDirectorySyncType,
      });
      lee.dispatch(actions.setActiveDirectorySyncType(activeDirectorySyncType));
      setHasAutoDeprovisioning(newHasAutoDeprovisioning);
      setIsFetchingAutomatedDeprovisioning(false);
    } catch (error) {
      reportTACError(error);
    }
  };
  const toggleProvisioning = async (): Promise<void> => {
    if (isFetchingAutomatedProvisioning) {
      return Promise.resolve();
    }
    setIsFetchingAutomatedProvisioning(true);
    const newHasAutoProvisioning = !hasAutoProvisioning;
    const activeDirectorySyncType = calculateSyncType(
      newHasAutoProvisioning,
      hasAutoDeprovisioning
    );
    try {
      if (!teamSettings) {
        return;
      }
      let { activeDirectorySyncStatus } = teamSettings;
      if (!activeDirectorySyncStatus) {
        const result = await generateAdToken();
        activeDirectorySyncStatus = result?.activeDirectorySyncStatus;
      }
      await updateTeamSettings({
        activeDirectorySyncType: activeDirectorySyncType,
      });
      lee.dispatch(actions.setActiveDirectorySyncType(activeDirectorySyncType));
      setHasAutoProvisioning(newHasAutoProvisioning);
      setIsFetchingAutomatedProvisioning(false);
    } catch (error) {
      reportTACError(error);
    }
  };
  const openHelpPage = () => {
    window.open("__REDACTED__", "_blank");
  };
  const getLastSuccessfulSynchronizationDate = () => {
    if (lastADSyncDateLoading) {
      return <IndeterminateLoader color="ds.oddity.focus" size="medium" />;
    }
    if (lastADSyncDateError) {
      return `${translate(
        I18N_KEYS.GENERIC_ERROR
      )} ${lastADSyncDateError.message.toLowerCase()}`;
    }
    return lastADSyncDate?.lastSuccessfulSyncRequestForTeamUnix
      ? _shortDate(
          fromUnixTime(lastADSyncDate.lastSuccessfulSyncRequestForTeamUnix),
          LocaleFormat.lll
        )
      : translate(I18N_KEYS.LAST_SUCCESSFUL_SYNC_DATE_VALUE_NEVER);
  };
  const getErrorRows = () => {
    const { activeDirectorySyncStatus } = lee.state;
    return activeDirectorySyncStatus?.failedSyncCount ? (
      <>
        <Row label={translate(I18N_KEYS.LAST_ERROR_MESSAGE_LABEL)}>
          <span sx={{ color: "ds.text.danger.standard" }}>
            {activeDirectorySyncStatus.lastFailedSync?.error}
          </span>
        </Row>
        <Row label={translate(I18N_KEYS.LAST_ERROR_DATE_LABEL)}>
          <span sx={{ color: "ds.text.danger.standard" }}>
            {activeDirectorySyncStatus?.lastFailedSync
              ? _shortDate(
                  fromUnixTime(
                    activeDirectorySyncStatus.lastFailedSync.eventDateUnix
                  ),
                  LocaleFormat.lll
                )
              : null}
          </span>
        </Row>
        <Row label={translate(I18N_KEYS.FAIL_COUNT_LABEL)}>
          <span sx={{ color: "ds.text.danger.standard" }}>
            {lee.state.activeDirectorySyncStatus.failedSyncCount}
          </span>
        </Row>
      </>
    ) : null;
  };
  const inviteLink = getInviteLinkWithTeamKey(
    inviteLinkGrapheneFF ? teamKey : inviteLinkDataForAdmin?.teamKey
  );
  const handleCopyInviteLink = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    navigator.clipboard.writeText(inviteLink);
    setShowInviteLinkModal(true);
  };
  const handleClose = () => {
    setShowInviteLinkModal(false);
  };
  return (
    <BackPageLayout title="Active Directory">
      {inviteLinkGrapheneFF ? (
        <ShareInviteLinkDialog
          isOpen={showInviteLinkModal}
          onClose={handleClose}
        />
      ) : (
        <InviteLinkSharingDialog
          showSharingDialog={showInviteLinkModal}
          setShowSharingDialog={setShowInviteLinkModal}
        />
      )}

      <GridContainer
        gap="10px"
        gridTemplateAreas="'mainContent secondaryContent'"
        gridTemplateColumns="auto 1fr"
        alignContent="flex-start"
      >
        <GridChild gridArea="mainContent">
          <SettingsPage>
            {!isAdSyncCapable ? (
              <ActiveDirectoryPaywall accountInfo={accountInfo} />
            ) : null}
            <RowGroup title={translate(I18N_KEYS.TITLE_HELP)}>
              <Row
                label={translate(I18N_KEYS.HEADER_LABEL)}
                labelHelper={translate(I18N_KEYS.HEADER_HELPER)}
              >
                <div>
                  <PrimaryButton
                    label={translate(I18N_KEYS.HEADER_BUTTON_LABEL)}
                    onClick={() => openHelpPage()}
                  />
                </div>
              </Row>
            </RowGroup>

            <RowGroup title={translate(I18N_KEYS.TITLE_STATUS)}>
              <Row label={translate(I18N_KEYS.LAST_SUCCESSFUL_SYNC_DATE_LABEL)}>
                {getLastSuccessfulSynchronizationDate()}
              </Row>
              {getErrorRows()}
            </RowGroup>

            <RowGroup title={translate(I18N_KEYS.TITLE_SETUP)}>
              <Row
                label={translate(I18N_KEYS.AUTOMATED_PROVISIONING_LABEL)}
                labelHelper={translate(I18N_KEYS.AUTOMATED_PROVISIONING_HELPER)}
              >
                <SwitchWithFeedback
                  genericErrorMessage={translate(
                    I18N_KEYS.SWITCH_DEFAULT_ERROR
                  )}
                  isDisabled={
                    isFetching || isFetchingAutomatedProvisioning || disableForm
                  }
                  saveValueFunction={toggleProvisioning}
                  value={hasAutoProvisioning}
                />
              </Row>
              <Row
                label={translate(I18N_KEYS.AUTOMATED_DEPROVISIONING_LABEL)}
                labelHelper={translate(
                  I18N_KEYS.AUTOMATED_DEPROVISIONING_HELPER
                )}
              >
                <SwitchWithFeedback
                  genericErrorMessage={translate(
                    I18N_KEYS.SWITCH_DEFAULT_ERROR
                  )}
                  isDisabled={
                    isFetching ||
                    isFetchingAutomatedDeprovisioning ||
                    disableForm
                  }
                  saveValueFunction={toggleDeprovisioning}
                  value={hasAutoDeprovisioning}
                />
              </Row>
              <Row
                label={translate(I18N_KEYS.CRON_SCRIPT_LABEL)}
                labelHelper={translate(I18N_KEYS.CRON_SCRIPT_HELPER)}
              >
                <TextField
                  defaultValue={lee.state.activeDirectoryScript}
                  isDisabled
                  multiLine
                  style={{
                    backgroundColor:
                      "ds.container.expressive.neutral.quiet.active",
                    fontSize: "12px",
                    height: "180px",
                    width: "300px",
                  }}
                />
                <div>
                  <SecondaryButton
                    label={
                      lee.state.isCopied
                        ? translate(I18N_KEYS.BUTTON_COPY_FEEDBACK)
                        : translate(I18N_KEYS.BUTTON_COPY_LABEL)
                    }
                    onClick={() => copyScript()}
                    disabled={!localActiveDirectoryToken}
                  />
                </div>
              </Row>
            </RowGroup>
          </SettingsPage>
        </GridChild>
        {adSyncEnabled ? (
          <GridChild
            gridArea="secondaryContent"
            sx={{ maxWidth: "500px", minWidth: "250px" }}
            alignSelf="flex-start"
          >
            <LinkCard
              linkProps={{
                linkType: LinkType.ExternalLink,
              }}
              heading={translate(I18N_KEYS.SHARE_INVITE_LINK_TITLE)}
              description={
                <div>
                  <Paragraph sx={{ mb: "8px" }}>
                    {translate(I18N_KEYS.SHARE_INVITE_LINK_DESC)}
                  </Paragraph>
                  <Paragraph
                    as="a"
                    onClick={handleCopyInviteLink}
                    sx={{ display: "flex", gap: "4px" }}
                    href="_blank"
                  >
                    {translate(I18N_KEYS.SHARE_INVITE_LINK_CTA)}
                    <Icon
                      color="ds.text.brand.standard"
                      name="ActionCopyOutlined"
                      size="medium"
                    />
                  </Paragraph>
                </div>
              }
            />
          </GridChild>
        ) : null}
      </GridContainer>
    </BackPageLayout>
  );
};
