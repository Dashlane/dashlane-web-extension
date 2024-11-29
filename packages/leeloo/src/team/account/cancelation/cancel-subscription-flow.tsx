import { useEffect, useState } from "react";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { useToast } from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  CancellationStatus,
  teamPlanDetailsApi,
  ValidCancelReasons,
} from "@dashlane/team-admin-contracts";
import { DASHLANE_CONTACT_SUPPORT_WITH_CHATBOT } from "../../urls";
import { useDiscontinuedStatus } from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { openUrl } from "../../../libs/external-urls";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { logEvent } from "../../../libs/logs/logEvent";
import useTranslate from "../../../libs/i18n/useTranslate";
import { CancelSubscriptionSurvey } from "./cancel-subscription-survey";
import { CancelSubscriptionConfirmationDialog } from "./cancel-subscription-success-dialog";
import { CancelSubscriptionSideContent } from "./cancel-subscription";
export enum CancelSubscriptionDialog {
  NONE = "none",
  SURVEY = "survey",
  REQUEST_SUCCESS = "requestSentConfirmation",
  REQUEST_ERROR = "requestError",
}
export type ZenDeskRequestStatus = "idle" | "pending" | "finished";
interface CancelSubscriptionFlowProps {
  status: CancellationStatus;
}
const I18N_KEYS = {
  ERROR_MESSAGE: "team_account_cancel_request_error",
};
export const CancelSubscriptionFlow = ({
  status,
}: CancelSubscriptionFlowProps) => {
  const [currentDialog, setCurrentDialog] = useState<CancelSubscriptionDialog>(
    CancelSubscriptionDialog.NONE
  );
  const [requestStatus, setRequestStatus] =
    useState<ZenDeskRequestStatus>("idle");
  const { showToast } = useToast();
  const discontinuedStatus = useDiscontinuedStatus();
  const teamTrialStatus = useTeamTrialStatus();
  const { translate } = useTranslate();
  useEffect(() => {
    if (
      status === CancellationStatus.Unknown ||
      currentDialog === CancelSubscriptionDialog.REQUEST_ERROR
    ) {
      showToast({
        mood: "danger",
        description: translate(I18N_KEYS.ERROR_MESSAGE),
        isManualDismiss: true,
      });
    }
  }, [currentDialog, showToast, status, translate]);
  const { requestTeamPlanCancellation } = useModuleCommands(teamPlanDetailsApi);
  const dataHasLoaded = !discontinuedStatus.isLoading && teamTrialStatus;
  if (!dataHasLoaded) {
    return null;
  }
  if (
    discontinuedStatus.isTeamSoftDiscontinued ||
    teamTrialStatus.isFreeTrial ||
    teamTrialStatus.isGracePeriod
  ) {
    return null;
  }
  const handleCloseCancelSurvey = () => {
    setCurrentDialog(CancelSubscriptionDialog.NONE);
  };
  const handleCloseCancelConfirmation = () => {
    setCurrentDialog(CancelSubscriptionDialog.NONE);
  };
  const handleStartCancelRequest = () => {
    logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.BillingInformation,
        button: Button.CancelSubscription,
      })
    );
    setCurrentDialog(CancelSubscriptionDialog.SURVEY);
  };
  const handleReactivateSubscriptionRequest = () => {
    logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.BillingInformation,
        button: Button.ReactivateSubscription,
      })
    );
    openUrl(DASHLANE_CONTACT_SUPPORT_WITH_CHATBOT);
  };
  const sendCancelRequest = async (reasonsToCancel: ValidCancelReasons[]) => {
    setRequestStatus("pending");
    try {
      const response = await requestTeamPlanCancellation({
        reasons: reasonsToCancel,
      });
      setRequestStatus("finished");
      if (response.tag === "failure") {
        throw new Error("Failed to request team plan cancellation.");
      } else {
        setCurrentDialog(CancelSubscriptionDialog.REQUEST_SUCCESS);
      }
    } catch (error) {
      setCurrentDialog(CancelSubscriptionDialog.REQUEST_ERROR);
    }
  };
  return (
    <>
      <CancelSubscriptionSideContent
        status={status}
        handleClickButton={
          status === CancellationStatus.None
            ? handleStartCancelRequest
            : handleReactivateSubscriptionRequest
        }
      />

      {currentDialog === CancelSubscriptionDialog.SURVEY ? (
        <CancelSubscriptionSurvey
          spaceTier={teamTrialStatus.spaceTier}
          handleClose={handleCloseCancelSurvey}
          sendCancelRequest={sendCancelRequest}
          requestStatus={requestStatus}
        />
      ) : null}

      {currentDialog === CancelSubscriptionDialog.REQUEST_SUCCESS ? (
        <CancelSubscriptionConfirmationDialog
          handleClose={handleCloseCancelConfirmation}
        />
      ) : null}
    </>
  );
};
