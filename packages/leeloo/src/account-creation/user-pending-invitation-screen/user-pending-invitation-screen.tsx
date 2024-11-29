import { useState } from "react";
import { Button, Flex, Heading, Paragraph } from "@dashlane/design-system";
import { IgnorePendingInvitationDialog } from "./ignore-pending-invitation-dialog";
import useTranslate from "../../libs/i18n/useTranslate";
import {
  logCancelClick,
  logCreatePersonalAccountClick,
  logIDontWantToJoinTeamClick,
  logNavigateAway,
} from "../logs";
import { AccountCreationStep } from "../types";
interface UserHasPendingInvitationScreenProps {
  loginEmail: string | undefined;
  invitationIsExpired: boolean;
  handleUserIgnoreAction: (step: AccountCreationStep) => void;
}
const I18N_KEYS = {
  PENDING_INVITATION_HEADER: "webapp_pending_invitation_header",
  PENDING_INVITATION_EXPIRED_HEADER: "webapp_pending_invitation_expired_header",
  PENDING_INVITATION_EXPIRED_DESCRIPTION:
    "webapp_pending_invitation_expired_description",
  PENDING_INVITATION_EMAIL_VERIFICATION:
    "webapp_pending_invitation_email_verification_markup",
  PENDING_INVITATION_EMAIL_SPAM_CHECK:
    "webapp_pending_invitation_email_spam_check",
  IGNORE_PENDING_INVITATION_LABEL: "webapp_ignore_pending_invitation_label",
};
export const UserPendingInvitationScreen = ({
  loginEmail,
  invitationIsExpired,
  handleUserIgnoreAction,
}: UserHasPendingInvitationScreenProps) => {
  const { translate } = useTranslate();
  const [hasOpenDialog, setHasOpenDialog] = useState<boolean>(false);
  const closeIgnorePendingInvitationDialog = (): void => {
    setHasOpenDialog(false);
  };
  const openIgnorePendingInvitationDialog = (): void => {
    setHasOpenDialog(true);
    logIDontWantToJoinTeamClick();
  };
  const handleUserIgnorePendingInvitation = (): void => {
    handleUserIgnoreAction(AccountCreationStep.EnterMasterPassword);
    logCreatePersonalAccountClick();
  };
  const handleCancelDialogClick = (): void => {
    closeIgnorePendingInvitationDialog();
    logCancelClick();
  };
  const handleNavigateAwayFromDialogClick = (): void => {
    closeIgnorePendingInvitationDialog();
    logNavigateAway();
  };
  return (
    <Flex
      as="section"
      gap={6}
      flexDirection="column"
      justifyContent="space-between"
      sx={{ paddingTop: "120px", height: "100%" }}
    >
      <Flex as="section" gap={6} flexDirection="column" justifyContent="center">
        {invitationIsExpired ? (
          <>
            <Heading
              as="h1"
              color="ds.text.neutral.catchy"
              textStyle="ds.title.section.large"
            >
              {translate(I18N_KEYS.PENDING_INVITATION_EXPIRED_HEADER)}
            </Heading>
            <Paragraph
              color="ds.text.neutral.quiet"
              textStyle="ds.body.standard.regular"
            >
              {translate(I18N_KEYS.PENDING_INVITATION_EXPIRED_DESCRIPTION)}
            </Paragraph>
          </>
        ) : (
          <>
            <Heading
              as="h1"
              color="ds.text.neutral.catchy"
              textStyle="ds.title.section.large"
            >
              {translate(I18N_KEYS.PENDING_INVITATION_HEADER)}
            </Heading>
            <Paragraph
              color="ds.text.neutral.quiet"
              textStyle="ds.body.standard.regular"
            >
              {translate.markup(
                I18N_KEYS.PENDING_INVITATION_EMAIL_VERIFICATION,
                { loginEmail }
              )}
            </Paragraph>
            <Paragraph
              color="ds.text.neutral.quiet"
              textStyle="ds.body.standard.regular"
            >
              {translate(I18N_KEYS.PENDING_INVITATION_EMAIL_SPAM_CHECK)}
            </Paragraph>
          </>
        )}
      </Flex>

      <>
        <Button
          icon="ArrowRightOutlined"
          intensity="supershy"
          layout="iconTrailing"
          type="button"
          sx={{
            marginLeft: "-41px",
          }}
          onClick={openIgnorePendingInvitationDialog}
        >
          <span sx={{ borderBottomWidth: "1px", borderBottomStyle: "solid" }}>
            {translate(I18N_KEYS.IGNORE_PENDING_INVITATION_LABEL)}
          </span>
        </Button>
        <IgnorePendingInvitationDialog
          isOpen={hasOpenDialog}
          onClose={handleNavigateAwayFromDialogClick}
          cancelClick={handleCancelDialogClick}
          primaryActionClick={handleUserIgnorePendingInvitation}
        />
      </>
    </Flex>
  );
};
