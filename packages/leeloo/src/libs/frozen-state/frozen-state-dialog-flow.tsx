import { memo, useEffect, useState } from "react";
import {
  DataStatus,
  useFeatureFlips,
  useModuleQuery,
} from "@dashlane/framework-react";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import {
  PASSWORD_LIMIT_FEATURE_FLIPS,
  vaultNotificationsApi,
} from "@dashlane/vault-contracts";
import { TrialDiscontinuedDialog } from "../trial/trial-dialogs/trial-discontinued-dialog";
import { getUrlSearchParams } from "../router";
import { useWebappLogoutDialogContext } from "../../webapp/webapp-logout-dialog-context";
import { B2CFrozenStateDialog } from "./b2c-frozen-state-dialog/b2c-frozen-state-dialog";
export const SEARCH_PARAM_B2B = "trialDiscontinued";
export const SEARCH_PARAM_B2C = "b2cFrozen";
interface AdminAccessProp {
  hasBillingAccess: boolean;
  hasFullAccess: boolean;
  openOnDemand: boolean;
  closeDialog: () => void;
}
export const RawFrozenStateDialogFlow = ({
  hasBillingAccess,
  hasFullAccess,
  openOnDemand = false,
  closeDialog: closeOnDemandDialog,
}: AdminAccessProp) => {
  const [canShowTrialDiscontinuedDialog, setCanShowTrialDiscontinuedDialog] =
    useState(false);
  const [canShowB2CFrozenDialog, setCanShowB2CFrozenDialog] = useState(false);
  const retrievedFFs = useFeatureFlips();
  const { isLogoutDialogOpen } = useWebappLogoutDialogContext();
  const hasSeenB2BPlanDiscontinuedQuery = useModuleQuery(
    teamAdminNotificationsApi,
    "hasSeenB2BPlanDiscontinued"
  );
  const hasSeenB2BPlanDiscontinued =
    hasSeenB2BPlanDiscontinuedQuery.status === DataStatus.Success
      ? hasSeenB2BPlanDiscontinuedQuery.data
      : null;
  const hasSeenB2CFrozenDialogQuery = useModuleQuery(
    vaultNotificationsApi,
    "getVaultNotificationsStatus"
  );
  const hasSeenB2CFrozenDialog =
    hasSeenB2CFrozenDialogQuery.status === DataStatus.Success
      ? hasSeenB2CFrozenDialogQuery.data.hasSeenFreeUserFrozenState
      : null;
  const hasFrozenStateFFEnabled =
    retrievedFFs.data?.[PASSWORD_LIMIT_FEATURE_FLIPS.B2CFreeUserFrozenState];
  const searchParams = getUrlSearchParams();
  const B2BSearchParamValue = searchParams.get(SEARCH_PARAM_B2B);
  const B2CSearchParamValue = searchParams.get(SEARCH_PARAM_B2C);
  const openFromUrl = Boolean(B2BSearchParamValue || B2CSearchParamValue);
  const handleCloseDiscontinuationDialog = () => {
    closeOnDemandDialog();
    setCanShowTrialDiscontinuedDialog(false);
  };
  const handleCloseB2CFrozenStateDialog = () => {
    closeOnDemandDialog();
    setCanShowB2CFrozenDialog(false);
  };
  useEffect(() => {
    if (
      typeof hasSeenB2BPlanDiscontinued === "boolean" &&
      (!hasSeenB2BPlanDiscontinued || openOnDemand || openFromUrl) &&
      (hasBillingAccess || hasFullAccess) &&
      !isLogoutDialogOpen
    ) {
      setCanShowTrialDiscontinuedDialog(true);
    }
    if (
      typeof hasSeenB2CFrozenDialog === "boolean" &&
      (!hasSeenB2CFrozenDialog || openOnDemand || openFromUrl) &&
      !isLogoutDialogOpen
    ) {
      setCanShowB2CFrozenDialog(true);
    }
  }, [
    hasBillingAccess,
    hasFullAccess,
    hasSeenB2BPlanDiscontinued,
    hasSeenB2CFrozenDialog,
    isLogoutDialogOpen,
    openFromUrl,
    openOnDemand,
  ]);
  const showB2CFrozenDialog = hasFrozenStateFFEnabled && canShowB2CFrozenDialog;
  if (
    typeof hasSeenB2BPlanDiscontinued !== "boolean" ||
    typeof hasSeenB2CFrozenDialog !== "boolean"
  ) {
    return null;
  }
  return canShowTrialDiscontinuedDialog ? (
    <TrialDiscontinuedDialog onClose={handleCloseDiscontinuationDialog} />
  ) : showB2CFrozenDialog ? (
    <B2CFrozenStateDialog onClose={handleCloseB2CFrozenStateDialog} />
  ) : null;
};
export const FrozenStateDialogFlow = memo(RawFrozenStateDialogFlow);
