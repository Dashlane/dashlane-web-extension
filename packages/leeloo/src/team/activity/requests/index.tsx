import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  Icon,
  mergeSx,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { MasterPasswordResetDemand } from "@dashlane/communication";
import { DataStatus, useModuleQueries } from "@dashlane/framework-react";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
import { Lee } from "../../../lee";
import {
  acceptMasterPasswordResetDemand,
  declineMasterPasswordResetDemand,
  getMasterPasswordResetDemandList,
} from "../../../libs/carbon/triggers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { LocaleFormat } from "../../../libs/i18n/helpers";
import { selectTeamAdminData } from "../../../libs/carbon/teamAdminData/selectors";
import Activity from "..";
import { List } from "./requests-list";
const I18N_KEYS = {
  TABLE_EMPTY_LABEL: "team_master_password_reset_table_empty_label",
  TABLE_EMPTY_HELPER: "team_master_password_reset_table_empty_helper",
  DIALOG_ACCEPT_BUTTON_OK: "team_master_password_reset_dialog_accept_button_ok",
  DIALOG_ACCEPT_BUTTON_CANCEL:
    "team_master_password_reset_dialog_accept_button_cancel",
  DIALOG_ACCEPT_TITLE: "team_master_password_reset_dialog_accept_title",
  DIALOG_ACCEPT_CONTENT_BOLD:
    "team_master_password_reset_dialog_accept_content_bold",
  DIALOG_ACCEPT_CONTENT: "team_master_password_reset_dialog_accept_content",
  DIALOG_DECLINE_BUTTON_OK:
    "team_master_password_reset_dialog_decline_button_ok",
  DIALOG_DECLINE_BUTTON_CANCEL:
    "team_master_password_reset_dialog_decline_button_cancel",
  DIALOG_DECLINE_TITLE: "team_master_password_reset_dialog_decline_title",
  DIALOG_DECLINE_CONTENT_BOLD:
    "team_master_password_reset_dialog_decline_content_bold",
  DIALOG_DECLINE_CONTENT: "team_master_password_reset_dialog_decline_content",
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  LIST_CONTAINER: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: "0 auto",
    marginBottom: "16px",
    alignItems: "center",
  },
  NO_ITEMS: {
    border: "dashed 1px ds.border.neutral.standard.idle",
    height: "288px",
    marginTop: "132px",
  },
};
interface Props {
  lee: Lee;
}
interface DialogState {
  dialogType: "accept" | "decline" | null;
  dialogIsVisible: boolean;
  selectedRequest: MasterPasswordResetDemand | null;
}
const RequestsActivity = ({ lee }: Props) => {
  const { translate } = useTranslate();
  const { getTeamId, getTeamPolicies } = useModuleQueries(
    teamPlanDetailsApi,
    {
      getTeamId: {},
      getTeamPolicies: {},
    },
    []
  );
  const teamId = getTeamId.data?.teamId;
  const emptyDialogState: DialogState = {
    dialogIsVisible: false,
    dialogType: null,
    selectedRequest: null,
  };
  const [dialogState, setDialogState] = useState<DialogState>(emptyDialogState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchRequests = useCallback(async () => {
    if (teamId) {
      await getMasterPasswordResetDemandList({ teamId: Number(teamId) });
    }
  }, [teamId]);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        if (getTeamPolicies.data?.recoveryEnabled) {
          await fetchRequests();
          setIsLoading(false);
        }
      } catch (error) {
        console.error(
          `RequestsActivity - fetchStatus failed with error ${error}`
        );
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, [fetchRequests, getTeamPolicies.data]);
  const getRequests = (): MasterPasswordResetDemand[] => {
    const { teams } = selectTeamAdminData(lee.globalState);
    if (teamId === null || teamId === undefined) {
      return [];
    }
    return teams[teamId]?.notifications?.accountRecoveryRequests ?? [];
  };
  const showAcceptConfirmation = (request: MasterPasswordResetDemand) => {
    setDialogState({
      dialogIsVisible: true,
      dialogType: "accept",
      selectedRequest: request,
    });
  };
  const showDeclineConfirmation = (request: MasterPasswordResetDemand) => {
    setDialogState({
      dialogIsVisible: true,
      dialogType: "decline",
      selectedRequest: request,
    });
  };
  const acceptRequest = (): void => {
    if (dialogState.selectedRequest) {
      acceptMasterPasswordResetDemand({
        login: dialogState.selectedRequest.login,
        recoveryKey: dialogState.selectedRequest.recoveryClientKey,
        userPublicKey: dialogState.selectedRequest.publicKey,
      })
        .then(() => {
          fetchRequests();
          setDialogState(emptyDialogState);
        })
        .catch((error: string) => {
          console.error(error);
        });
    }
  };
  const declineRequest = async () => {
    if (!dialogState.selectedRequest) {
      return;
    }
    try {
      await declineMasterPasswordResetDemand({
        login: dialogState.selectedRequest.login,
      });
      fetchRequests();
      setDialogState(emptyDialogState);
    } catch (error) {
      console.error(error);
    }
  };
  const dateFormatter = (date: Date) => {
    return [
      translate.shortDate(date, LocaleFormat.l),
      translate.shortDate(date, LocaleFormat.LT),
    ].join(" - ");
  };
  const getList = () => {
    const requests = getRequests();
    return requests.length ? (
      <div sx={SX_STYLES.LIST_CONTAINER}>
        <List
          onAccept={showAcceptConfirmation}
          onDecline={showDeclineConfirmation}
          dateFormatter={dateFormatter}
          requests={requests}
        />
      </div>
    ) : (
      <div sx={mergeSx([SX_STYLES.LIST_CONTAINER, SX_STYLES.NO_ITEMS])}>
        <Icon
          name="NotificationOutlined"
          sx={{ width: "100px", height: "100px" }}
          color="ds.border.neutral.quiet.idle"
        />
        <Paragraph
          textStyle="ds.title.section.medium"
          sx={{ marginTop: "36px" }}
        >
          {translate(I18N_KEYS.TABLE_EMPTY_LABEL)}
        </Paragraph>
        <Paragraph
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.quiet"
          sx={{ marginTop: "7px" }}
        >
          {translate(I18N_KEYS.TABLE_EMPTY_HELPER)}
        </Paragraph>
      </div>
    );
  };
  const dismissDialog = () => setDialogState(emptyDialogState);
  if (
    getTeamPolicies.status !== DataStatus.Success &&
    getTeamId.status !== DataStatus.Success
  ) {
    return null;
  }
  return (
    <Activity isLoading={isLoading}>
      {getList()}

      <Dialog
        isOpen={
          dialogState.dialogIsVisible && dialogState.dialogType === "accept"
        }
        onClose={dismissDialog}
        closeActionLabel={translate(I18N_KEYS.DIALOG_ACCEPT_BUTTON_CANCEL)}
        actions={{
          primary: {
            children: translate(I18N_KEYS.DIALOG_ACCEPT_BUTTON_OK),
            onClick: acceptRequest,
          },
          secondary: {
            children: translate(I18N_KEYS.DIALOG_ACCEPT_BUTTON_CANCEL),
            onClick: dismissDialog,
          },
        }}
        title={translate(I18N_KEYS.DIALOG_ACCEPT_TITLE)}
      >
        {dialogState.selectedRequest?.login ? (
          <Paragraph textStyle="ds.body.standard.strong">
            {translate(I18N_KEYS.DIALOG_ACCEPT_CONTENT_BOLD, {
              login: dialogState.selectedRequest.login,
            })}
          </Paragraph>
        ) : null}
        <Paragraph>{translate(I18N_KEYS.DIALOG_ACCEPT_CONTENT)}</Paragraph>
      </Dialog>
      <Dialog
        isOpen={
          dialogState.dialogIsVisible && dialogState.dialogType === "decline"
        }
        onClose={dismissDialog}
        closeActionLabel={translate(I18N_KEYS.DIALOG_DECLINE_BUTTON_CANCEL)}
        actions={{
          primary: {
            children: translate(I18N_KEYS.DIALOG_DECLINE_BUTTON_OK),
            onClick: declineRequest,
          },
          secondary: {
            children: translate(I18N_KEYS.DIALOG_DECLINE_BUTTON_CANCEL),
            onClick: dismissDialog,
          },
        }}
        title={translate(I18N_KEYS.DIALOG_DECLINE_TITLE)}
      >
        {dialogState.selectedRequest?.login ? (
          <Paragraph textStyle="ds.body.standard.strong">
            {translate(I18N_KEYS.DIALOG_DECLINE_CONTENT_BOLD, {
              login: dialogState.selectedRequest?.login ?? "",
            })}
          </Paragraph>
        ) : null}
        <Paragraph>{translate(I18N_KEYS.DIALOG_DECLINE_CONTENT)}</Paragraph>
      </Dialog>
    </Activity>
  );
};
export default RequestsActivity;
