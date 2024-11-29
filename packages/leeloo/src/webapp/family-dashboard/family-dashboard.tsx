import React, { useCallback, useEffect, useState } from "react";
import { Link } from "../../libs/router";
import { AlertSeverity } from "@dashlane/ui-components";
import { PageView } from "@dashlane/hermes";
import { carbonConnector } from "../../libs/carbon/connector";
import { redirectToUrl } from "../../libs/external-urls";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import { FamilySettings } from "./family-settings/family-settings";
import { FamilyHeader } from "./family-header/family-header";
import { MemberList } from "./member-list/member-list";
import { ResetLinkDialog } from "./reset-link-dialog/reset-link-dialog";
import { useFamilyDetails } from "./hooks/useFamilyDetails";
import { useAlert } from "./hooks/useAlert";
import styles from "./styles.css";
import { Logo } from "@dashlane/design-system";
const I18N_KEYS = {
  DASHLANE_LOGO_TITLE: "_common_dashlane_logo_title",
  LINK_RESET: "webapp_family_dashboard_reset_link_confirmation_alert",
  LINK_RESET_ERROR: "webapp_family_dashboard_generic_failure_message",
  MEMBER_REMOVED_AND_LINK_RESET:
    "webapp_family_dashboard_member_removed_link_reset_success_message",
  MEMBER_REMOVED: "webapp_family_dashboard_member_removed_success_message",
  MEMBER_REMOVED_ERROR: "webapp_family_dashboard_generic_failure_message",
};
export const FamilyDashboard = () => {
  const { translate } = useTranslate();
  const [joinToken, setJoinToken] = useState<string | null>(null);
  const [showResetLinkDialog, setShowResetLinkDialog] = useState(false);
  const { familyDetails, familyDetailsError, removeMemberFromFamilyDetails } =
    useFamilyDetails();
  useEffect(() => {
    if (!familyDetails) {
      return;
    }
    logPageView(PageView.FamilyDashboard);
  }, [familyDetails]);
  const removeSuccessAlert = useAlert(
    translate(I18N_KEYS.MEMBER_REMOVED),
    AlertSeverity.SUCCESS
  );
  const removeErrorAlert = useAlert(
    translate(I18N_KEYS.MEMBER_REMOVED_ERROR),
    AlertSeverity.ERROR
  );
  const removeAndResetSuccessAlert = useAlert(
    translate(I18N_KEYS.MEMBER_REMOVED_AND_LINK_RESET),
    AlertSeverity.SUCCESS
  );
  const resetSuccessAlert = useAlert(
    translate(I18N_KEYS.LINK_RESET),
    AlertSeverity.SUCCESS
  );
  const resetErrorAlert = useAlert(
    translate(I18N_KEYS.LINK_RESET_ERROR),
    AlertSeverity.ERROR
  );
  const onMyAccountClick = useCallback(() => {
    redirectToUrl("__REDACTED__");
  }, [familyDetails]);
  const resetInvitationLink = useCallback(async () => {
    const result = await carbonConnector.resetFamilyJoinToken();
    if (!result.success) {
      throw new Error(result.error.code);
    }
    setJoinToken(result.response.joinToken);
  }, [setJoinToken]);
  const onResetLinkClick = useCallback(() => {
    setShowResetLinkDialog(true);
  }, [familyDetails]);
  const onResetLinkConfirm = useCallback(async () => {
    setShowResetLinkDialog(false);
    try {
      await resetInvitationLink();
      resetSuccessAlert.show();
    } catch (err) {
      resetErrorAlert.show();
    }
  }, [resetInvitationLink, resetSuccessAlert, familyDetails, resetErrorAlert]);
  const onCancelResetLink = useCallback(() => {
    setShowResetLinkDialog(false);
  }, [familyDetails]);
  const onRemoveMember = useCallback(
    async (userId: number, resetLink: boolean) => {
      try {
        const removeMemberResult = await carbonConnector.removeFamilyMember({
          userId,
        });
        if (!removeMemberResult.success) {
          throw new Error(removeMemberResult.error.code);
        }
        removeMemberFromFamilyDetails(userId);
        if (!resetLink) {
          removeSuccessAlert.show();
        } else {
          await resetInvitationLink();
          removeAndResetSuccessAlert.show();
        }
      } catch (err) {
        removeErrorAlert.show();
      }
    },
    [
      removeMemberFromFamilyDetails,
      familyDetails,
      removeSuccessAlert,
      resetInvitationLink,
      removeAndResetSuccessAlert,
      removeErrorAlert,
    ]
  );
  if (familyDetailsError) {
    redirectToUrl("__REDACTED__");
  }
  if (!familyDetails) {
    return null;
  }
  if (joinToken === null && familyDetails && familyDetails.joinToken) {
    setJoinToken(familyDetails.joinToken);
  }
  const invitationLink = `__REDACTED__${joinToken}`;
  const { spots } = familyDetails;
  return (
    <>
      <div className={styles.header}>
        <div>
          <Link to="/" target="_self">
            <Logo
              height={40}
              name="DashlaneLockup"
              title={translate(I18N_KEYS.DASHLANE_LOGO_TITLE)}
            />
          </Link>
        </div>
        <div>
          <FamilySettings
            onMyAccountClick={onMyAccountClick}
            onResetLinkClick={onResetLinkClick}
          />
        </div>
      </div>
      <div className={styles.content}>
        <FamilyHeader
          invitationLink={invitationLink}
          spots={spots}
          statusCode={familyDetails.statusCode}
        />
        {familyDetails.members ? (
          <MemberList
            admin={familyDetails.members.admin}
            regularMembers={familyDetails.members.regular}
            removeMember={onRemoveMember}
          />
        ) : null}
      </div>
      {removeSuccessAlert.alert}
      {removeErrorAlert.alert}
      {removeAndResetSuccessAlert.alert}
      {resetSuccessAlert.alert}
      {resetErrorAlert.alert}
      {showResetLinkDialog ? (
        <ResetLinkDialog
          handleResetLink={onResetLinkConfirm}
          handleOnCancel={onCancelResetLink}
        />
      ) : null}
    </>
  );
};
