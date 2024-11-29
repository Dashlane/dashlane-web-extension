import { IndeterminateLoader } from "@dashlane/design-system";
import {
  DataStatus,
  useFeatureFlip,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { isFailure, isSuccess } from "@dashlane/framework-types";
import {
  IntegrationPlatform,
  NudgeAction,
  UserSetupNudgesEvent,
} from "@dashlane/hermes";
import { nudgesApi } from "@dashlane/risk-mitigation-contracts";
import { AlertSeverity } from "@dashlane/ui-components";
import { useEffect, useState } from "react";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useAlertQueue } from "../../alerts/use-alert-queue";
import { useNudgesInfoFromUrl } from "./hooks/useNudgesInfoFromUrl";
import { NudgesPostSetup } from "./nudges-post-setup";
import { NudgesSetup } from "./nudges-setup";
import { logEvent } from "../../../libs/logs/logEvent";
import { useCapabilities } from "../../../libs/carbon/hooks/useCapabilities";
const I18N_KEYS = {
  UNKNOWN_ERROR: "_common_generic_error",
  VALIDATION_ERROR: "team_settings_nudges_configuration_validation_error",
  SEND_NUDGE_ERROR: "team_settings_nudges_configuration_send_nudge_error",
};
export const NudgesContent = () => {
  const hasNudgesCapibilityOverrideFF = useFeatureFlip(
    "ace_enforce_nudges_availability"
  );
  const nudgesCapability = useCapabilities(["nudges"]);
  const { reportTACError } = useAlertQueue();
  const slackCode = useNudgesInfoFromUrl()?.code;
  const [isPendingValidation, setIsPendingValidation] = useState(
    Boolean(slackCode)
  );
  const [installationSucceeded, setInstallationSucceeded] = useState(false);
  const isNudgesInstalledResult = useModuleQuery(
    nudgesApi,
    "checkNudgesInstallation"
  );
  const { validateNudgesInstallation, sendNudge } =
    useModuleCommands(nudgesApi);
  const { translate } = useTranslate();
  const alert = useAlert();
  useEffect(() => {
    if (!slackCode) {
      return;
    }
    const validateInstall = async () => {
      try {
        const result = await validateNudgesInstallation({
          authCode: slackCode,
        });
        if (isFailure(result)) {
          alert.showAlert(
            translate(I18N_KEYS.VALIDATION_ERROR),
            AlertSeverity.ERROR
          );
        }
        if (isSuccess(result)) {
          logEvent(
            new UserSetupNudgesEvent({
              action: NudgeAction.CompletedSetup,
              integrationPlatform: IntegrationPlatform.Slack,
            })
          );
          const sendWelcomeMessage = await sendNudge({ type: "welcome" });
          if (isFailure(sendWelcomeMessage)) {
            alert.showAlert(
              translate(I18N_KEYS.SEND_NUDGE_ERROR),
              AlertSeverity.ERROR
            );
          }
          setInstallationSucceeded(true);
        }
      } catch (err) {
        alert.showAlert(
          translate(I18N_KEYS.UNKNOWN_ERROR),
          AlertSeverity.ERROR
        );
      } finally {
        setIsPendingValidation(false);
      }
    };
    validateInstall();
  }, [slackCode]);
  if (isNudgesInstalledResult.status === DataStatus.Error) {
    reportTACError(
      new Error("Unknown error occured while checking your Nudges installation")
    );
  }
  const isNudgesInstalled = Boolean(isNudgesInstalledResult.data);
  if (
    isNudgesInstalledResult.status === DataStatus.Loading ||
    nudgesCapability.status === DataStatus.Loading ||
    isPendingValidation
  ) {
    return (
      <div sx={{ display: "flex", justifyContent: "center" }}>
        <IndeterminateLoader size={75} data-testid="nudges-validate-loader" />
      </div>
    );
  }
  const hasNudgesCapability =
    nudgesCapability.status === DataStatus.Success && nudgesCapability.data;
  const isAbleToSeeConfiguration =
    hasNudgesCapibilityOverrideFF || hasNudgesCapability;
  if (
    isAbleToSeeConfiguration &&
    (isNudgesInstalled || installationSucceeded)
  ) {
    return <NudgesPostSetup />;
  } else {
    return <NudgesSetup hasNudgesCapability={hasNudgesCapability} />;
  }
};
