import { useEffect, useState } from "react";
import { merge } from "lodash";
import {
  Dialog,
  IndeterminateLoader,
  Infobox,
  Paragraph,
  useToast,
} from "@dashlane/design-system";
import { FlowStep, UserSendManualInviteEvent } from "@dashlane/hermes";
import { useModuleCommands } from "@dashlane/framework-react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { teamMembersApi } from "@dashlane/team-admin-contracts";
import { getAuth as getUserAuth } from "../../user";
import { Lee, LEE_INCORRECT_AUTHENTICATION } from "../../lee";
import { isStarterTier } from "../../libs/account/helpers";
import { TeamPlansProposeMembersResultContent } from "../../libs/api/types";
import { usePremiumStatus } from "../../libs/carbon/hooks/usePremiumStatus";
import FileDropZone from "../../libs/dashlane-style/file-drop-zone";
import { TagsField } from "../../libs/dashlane-style/tags-field";
import useTranslate from "../../libs/i18n/useTranslate";
import { logEvent } from "../../libs/logs/logEvent";
import { Link, useRouterGlobalSettingsContext } from "../../libs/router";
import { isValidEmail } from "../../libs/validators";
import {
  ADDITIONAL_SEAT_CAP,
  isSeatCountAboveCap,
  SALES_EMAIL,
} from "../account/add-seats/helpers";
import { useAdditionalSeatCountPricing } from "../account/add-seats/useAdditionalSeatCountPricing";
import { useAlertQueue } from "../alerts/use-alert-queue";
import { useBillingCountry } from "../helpers/useBillingCountry";
import { InvitePartialSuccessState } from "../invite-result-dialog";
import { hasRefusedMembers } from "../members/helpers";
import { useIsStandard } from "../helpers/use-is-standard";
import findEmails from "./find-emails";
const ACCEPT = ["text/*", ".csv", ".txt"];
const I18N_KEYS = {
  BUTTON_SEND: "invite_user_dialog_button",
  DIALOG_TITLE: "invite_user_dialog_title",
  DIALOG_CLOSE_BUTTON: "_common_dialog_dismiss_button",
  IMPORT_EXAMPLE_TEST: "team_invite_dialog_import_example_text",
  INPUT_COUNTER: "team_invite_dialog_input_counter",
  INPUT_COUNTER_NEGATIVE: "team_invite_dialog_input_counter_negative",
  INPUT_COUNTER_NEGATIVE_TAX: "team_invite_dialog_input_counter_negative_tax",
  INPUT_COUNTER_NEGATIVE_VAT: "team_invite_dialog_input_counter_negative_vat",
  INPUT_COUNTER_SPECIAL: "team_invite_dialog_input_counter_special",
  INPUT_DESCRIPTION: "team_invite_dialog_import_description",
  INPUT_LABEL: "invite_user_dialog_input_label",
  INPUT_LABEL_SENDING: "team_invite_dialog_input_label_sending",
  INPUT_PLACEHOLDER: "team_invite_dialog_input_placeholder",
  INVITATION_COUNTER: "team_invite_dialog_invitations_counter",
  INVITE_SUCCESS_MESSAGE_COUNT:
    "team_members_invite_success_message_with_count",
  INVITE_SUCCESS_MESSAGE_ADDED_SEATS:
    "team_members_invite_success_message_with_added_seats",
  INVITE_SUCCESS_MESSAGE_ADDED_SEATS_ONE_INVITE:
    "team_members_invite_success_message_with_added_seats_one_invite",
  INVITE_ERROR_MSG: "team_members_invite_error_message",
  COMMON_GENERIC_ERROR: "_common_generic_error",
  BUY_MORE_SEATS_THAN_CAP:
    "team_account_teamplan_upgrade_premium_buy_more_seats_than_cap",
  STARTER_DESC: "team_dialog_starter_limit_warning",
  STARTER_SUB: "team_dialog_starter_change_plan",
  STANDARD_SEAT_LIMIT: "team_dialog_standard_limit_warning",
};
const INVITE_EMAILS_CHUNK_LIMIT = 500;
interface Props {
  isFreeTrial: boolean;
  isOpen: boolean;
  lee: Lee;
  slotsTotal: number;
  slotsTaken: number;
  exclude?: string[];
  closeInviteDialog: () => void;
  handleInvitePartialSuccess: (
    successfullyInvitedMembers: InvitePartialSuccessState["invitedMembers"],
    refusedMembers: InvitePartialSuccessState["refusedMembers"]
  ) => void;
  handleInviteCompleteSuccess: (
    successfullyInvitedMemberEmails: string[]
  ) => void;
  preFilledEmails?: Set<string>;
  setShowActivationDialog: (isActivationDialogOpen: boolean) => void;
}
export const InviteDialog = ({
  lee,
  isFreeTrial,
  isOpen,
  slotsTaken,
  slotsTotal,
  exclude,
  preFilledEmails,
  closeInviteDialog,
  handleInviteCompleteSuccess,
  handleInvitePartialSuccess,
  setShowActivationDialog,
}: Props) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { reportTACError } = useAlertQueue();
  const { proposeMembers } = useModuleCommands(teamMembersApi);
  const premiumStatus = usePremiumStatus();
  const { billingDetails, amountToPay, amountToTax, onSeatCountChange } =
    useAdditionalSeatCountPricing(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(false);
  const [emails, setEmails] = useState<Set<string>>(
    preFilledEmails ?? new Set([])
  );
  const [inviteEmailsSent, setInviteEmailsSent] = useState<number>(0);
  const [inviteEmailsTotal, setInviteEmailsTotal] = useState<number>(0);
  const [importFileSize, setImportFileSize] = useState(0);
  const [remainingSlots, setRemainingSlots] = useState(0);
  const [showStarterWarning, setShowStarterWarning] = useState(false);
  const isStandardPlan = useIsStandard();
  useEffect(() => {
    setIsOverlayVisible(isSending);
  }, [isSending]);
  useEffect(() => {
    setEmails(preFilledEmails ?? new Set([]));
  }, [preFilledEmails]);
  useEffect(() => {
    if (!emails.size) {
      setImportFileSize(0);
    }
  }, [emails]);
  const sendEmails = async (
    emailsToSend: string[]
  ): Promise<TeamPlansProposeMembersResultContent> => {
    const auth = getUserAuth(lee.globalState);
    if (!auth) {
      const noAuthError = new Error(LEE_INCORRECT_AUTHENTICATION);
      reportTACError(noAuthError);
      throw noAuthError;
    }
    if (!lee.apiMiddleware.teamPlans) {
      throw new Error(
        `we want to remove this middleware but we can't just yet!`
      );
    }
    try {
      const response: {
        [key: string]: any;
      } = await proposeMembers({
        proposedMemberLogins: emailsToSend,
        force: true,
      });
      if (response.tag === "failure") {
        throw new Error(response.error);
      } else {
        return response.data;
      }
    } catch (error) {
      const errorLocaleKey =
        error.code && error.subCode
          ? `invite_error_${error.code}_${error.subCode}`
          : I18N_KEYS.INVITE_ERROR_MSG;
      showToast({
        description: translate(errorLocaleKey),
        closeActionLabel: translate(I18N_KEYS.DIALOG_CLOSE_BUTTON),
        mood: "danger",
      });
      throw new Error(translate(errorLocaleKey));
    }
  };
  const handleInvitationClosed = () => {
    closeInviteDialog();
    setIsSending(false);
    setInviteEmailsSent(0);
    setInviteEmailsTotal(0);
  };
  const handleEmailsSent = async (
    emailsToSend: string[],
    offset?: number
  ): Promise<void> => {
    offset = offset ?? 0;
    setInviteEmailsTotal(emailsToSend.length);
    setIsSending(true);
    const limit =
      offset +
      Math.min(emailsToSend.length - offset, INVITE_EMAILS_CHUNK_LIMIT);
    const selectedEmails = emailsToSend.slice(offset, limit);
    const serverData: TeamPlansProposeMembersResultContent =
      {} as TeamPlansProposeMembersResultContent;
    try {
      const data = await sendEmails(selectedEmails);
      setInviteEmailsSent(limit);
      merge(serverData, data);
      if (limit < emailsToSend.length) {
        return handleEmailsSent(emailsToSend, limit);
      }
      if (hasRefusedMembers(serverData)) {
        handleInvitePartialSuccess(
          serverData.proposedMembers,
          serverData.refusedMembers
        );
        const invitedMemberCount = Object.keys(
          serverData.proposedMembers
        ).length;
        const failedMemberCount = Object.keys(serverData.refusedMembers).length;
        logEvent(
          new UserSendManualInviteEvent({
            flowStep: FlowStep.Complete,
            inviteCount: invitedMemberCount,
            inviteFailedCount: failedMemberCount,
            inviteResentCount: 0,
            inviteSuccessfulCount: invitedMemberCount - failedMemberCount,
            isImport: importFileSize > 0,
            importSize: importFileSize,
            isResend: false,
          })
        );
      } else {
        handleInviteCompleteSuccess(emailsToSend);
        if (remainingSlots < 0) {
          if (emails.size === 1) {
            showToast({
              description: translate(
                I18N_KEYS.INVITE_SUCCESS_MESSAGE_ADDED_SEATS_ONE_INVITE,
                {
                  cost: translate.price(
                    billingDetails.currency,
                    (amountToPay + amountToTax) / 100
                  ),
                }
              ),
              closeActionLabel: translate(I18N_KEYS.DIALOG_CLOSE_BUTTON),
              mood: "brand",
            });
          } else {
            showToast({
              description: translate(
                I18N_KEYS.INVITE_SUCCESS_MESSAGE_ADDED_SEATS,
                {
                  total: emails.size,
                  count: -remainingSlots,
                  cost: translate.price(
                    billingDetails.currency,
                    (amountToPay + amountToTax) / 100
                  ),
                }
              ),
              closeActionLabel: translate(I18N_KEYS.DIALOG_CLOSE_BUTTON),
              mood: "brand",
            });
          }
        } else {
          showToast({
            description: translate(I18N_KEYS.INVITE_SUCCESS_MESSAGE_COUNT, {
              count: emails.size,
            }),
            closeActionLabel: translate(I18N_KEYS.DIALOG_CLOSE_BUTTON),
            mood: "brand",
          });
        }
        logEvent(
          new UserSendManualInviteEvent({
            flowStep: FlowStep.Complete,
            inviteCount: emailsToSend.length,
            inviteFailedCount: 0,
            inviteResentCount: 0,
            inviteSuccessfulCount: emailsToSend.length,
            isImport: importFileSize > 0,
            importSize: importFileSize,
            isResend: false,
          })
        );
      }
      return handleInvitationClosed();
    } catch (e) {
      logEvent(
        new UserSendManualInviteEvent({
          flowStep: FlowStep.Error,
          inviteCount: emails.size,
          inviteFailedCount: emails.size,
          inviteResentCount: 0,
          inviteSuccessfulCount: 0,
          isImport: importFileSize > 0,
          importSize: importFileSize,
          isResend: false,
        })
      );
      handleInvitationClosed();
      throw e;
    }
  };
  const excluded = (email: string): boolean => {
    return !!exclude?.includes(email);
  };
  const formatEmails = (value: string): string[] => {
    return findEmails(value).filter((v) => !emails.has(v));
  };
  const validateEmail = (email: string): boolean => {
    return isValidEmail(email) && !excluded(email);
  };
  const mergeEmails = (newEmails: string[]) => {
    setImportFileSize(newEmails.length);
    setEmails(new Set([...emails, ...newEmails]));
  };
  const setEmailsList = (emails: string[]) => {
    setEmails(new Set(emails));
  };
  const handleSendClicked = async (): Promise<void> => {
    try {
      await handleEmailsSent([...emails]);
      setShowActivationDialog(true);
    } catch (e) {
      logEvent(
        new UserSendManualInviteEvent({
          flowStep: FlowStep.Error,
          inviteCount: emails.size,
          inviteFailedCount: emails.size,
          inviteResentCount: 0,
          inviteSuccessfulCount: 0,
          isImport: importFileSize > 0,
          importSize: importFileSize,
          isResend: false,
        })
      );
      showToast({
        description: translate(I18N_KEYS.COMMON_GENERIC_ERROR),
        closeActionLabel: translate(I18N_KEYS.DIALOG_CLOSE_BUTTON),
        mood: "danger",
      });
    }
    setEmails(new Set([]));
  };
  const onDialogRequestClose = () => {
    if (isSending) {
      return;
    }
    logEvent(
      new UserSendManualInviteEvent({
        flowStep: FlowStep.Cancel,
        inviteCount: emails.size,
        inviteFailedCount: 0,
        inviteResentCount: 0,
        inviteSuccessfulCount: 0,
        isImport: importFileSize > 0,
        importSize: importFileSize,
        isResend: false,
      })
    );
    handleInvitationClosed();
    setEmails(new Set([]));
  };
  const handleError = (error: Error) => {
    reportTACError(error);
  };
  const invalidCount = [...emails].filter(
    (email) => !validateEmail(email)
  ).length;
  let sendDisabled =
    emails.size === 0 ||
    invalidCount > 0 ||
    (remainingSlots < 0 && isSeatCountAboveCap(-remainingSlots)) ||
    showStarterWarning;
  useEffect(() => {
    if (slotsTotal) {
      const remaining = slotsTotal - (emails.size - invalidCount) - slotsTaken;
      setRemainingSlots(remaining);
      if (remaining < 0) {
        onSeatCountChange(-remaining);
        if (
          (premiumStatus.status === DataStatus.Success &&
            isStarterTier(premiumStatus.data)) ||
          isStandardPlan
        ) {
          setShowStarterWarning(true);
        }
      } else {
        setShowStarterWarning(false);
      }
    }
  }, [emails, premiumStatus, slotsTotal, slotsTaken]);
  const { loading, billingCountry } = useBillingCountry();
  if (loading) {
    return <IndeterminateLoader />;
  }
  const taxCopy =
    billingCountry === "US"
      ? I18N_KEYS.INPUT_COUNTER_NEGATIVE_TAX
      : I18N_KEYS.INPUT_COUNTER_NEGATIVE_VAT;
  const infoboxWarning = isStandardPlan
    ? translate(I18N_KEYS.STANDARD_SEAT_LIMIT)
    : translate(I18N_KEYS.STARTER_DESC);
  const counterElement = () => {
    if (!slotsTotal) return null;
    const standardCounter =
      remainingSlots < 0
        ? isSeatCountAboveCap(-remainingSlots)
          ? translate(I18N_KEYS.BUY_MORE_SEATS_THAN_CAP, {
              seatCap: ADDITIONAL_SEAT_CAP,
              salesEmail: SALES_EMAIL,
            })
          : amountToTax
          ? translate(taxCopy, {
              count: -remainingSlots,
              total: slotsTotal,
              cost: translate.price(
                billingDetails.currency,
                (amountToPay + amountToTax) / 100
              ),
            })
          : translate(I18N_KEYS.INPUT_COUNTER_NEGATIVE, {
              count: -remainingSlots,
              total: slotsTotal,
              cost: translate.price(billingDetails.currency, amountToPay / 100),
            })
        : translate(I18N_KEYS.INPUT_COUNTER, {
            count: remainingSlots,
            total: slotsTotal,
          });
    const specialCounter = translate(I18N_KEYS.INPUT_COUNTER_SPECIAL, {
      total: slotsTotal,
    });
    let counter = standardCounter;
    if (isFreeTrial && remainingSlots < 1) {
      sendDisabled = remainingSlots < 0 ? true : sendDisabled;
      counter = specialCounter;
    }
    return (
      <Paragraph
        color={
          remainingSlots < 1 ? "ds.text.danger.quiet" : "ds.text.positive.quiet"
        }
        textStyle="ds.body.reduced.regular"
        sx={{
          display: !isSending ? "flex" : "none",
        }}
      >
        {counter}
      </Paragraph>
    );
  };
  return (
    <Dialog
      isOpen={isOpen}
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      closeActionLabel={translate(I18N_KEYS.DIALOG_CLOSE_BUTTON)}
      onClose={onDialogRequestClose}
      aria-describedby="dialogContent"
      actions={{
        primary: {
          children: translate(I18N_KEYS.BUTTON_SEND),
          onClick: handleSendClicked,
          disabled: sendDisabled,
          layout: "iconLeading",
          icon: "ItemEmailOutlined",
        },
      }}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
        >
          {isSending
            ? translate(I18N_KEYS.INPUT_LABEL_SENDING)
            : translate(I18N_KEYS.INPUT_LABEL)}
        </Paragraph>
        <FileDropZone
          accept={ACCEPT}
          passClicksThrough
          onChange={(arrayBuffer) => {
            mergeEmails(formatEmails(arrayBuffer.join("\0")));
          }}
          onError={handleError}
        >
          <TagsField
            key="tags"
            setIsOverlayVisible={setIsOverlayVisible}
            placeholder={translate(I18N_KEYS.INPUT_PLACEHOLDER)}
            tags={[...emails]}
            isOverlayVisible={isOverlayVisible}
            setTags={setEmailsList}
            formatToTags={formatEmails}
            validate={validateEmail}
          />
        </FileDropZone>
        {!showStarterWarning ? (
          counterElement()
        ) : (
          <Infobox
            title={
              <>
                <Paragraph textStyle="ds.title.block.small">
                  {infoboxWarning}
                </Paragraph>
                <Link to={routes.teamAccountChangePlanRoutePath}>
                  {translate(I18N_KEYS.STARTER_SUB)}
                </Link>
              </>
            }
            mood="brand"
            icon="FeedbackSuccessOutlined"
          />
        )}
      </div>
      <div sx={{ display: "flex", flexDirection: "column" }}>
        <Paragraph
          color={"ds.text.positive.quiet"}
          textStyle={"ds.body.reduced.regular"}
          sx={{
            display: isSending ? "flex" : "none",
          }}
        >
          {translate(I18N_KEYS.INVITATION_COUNTER, {
            count: inviteEmailsSent,
            total: inviteEmailsTotal,
          })}
        </Paragraph>
        <div
          sx={{
            display: isSending ? "none" : "flex",
          }}
        >
          <FileDropZone
            accept={ACCEPT}
            onChange={(arrayBuffer) => {
              mergeEmails(formatEmails(arrayBuffer.join("\0")));
            }}
            onError={handleError}
          >
            <Paragraph
              as="span"
              textStyle="ds.title.section.medium"
              color="ds.text.brand.quiet"
              sx={{ cursor: "pointer" }}
            >
              {translate(I18N_KEYS.INPUT_DESCRIPTION)}
            </Paragraph>
          </FileDropZone>
        </div>
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
          sx={{
            display: isSending ? "none" : "flex",
          }}
        >
          {translate(I18N_KEYS.IMPORT_EXAMPLE_TEST)}
        </Paragraph>
      </div>
    </Dialog>
  );
};
