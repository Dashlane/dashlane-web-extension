import { Button, Flex, Heading, Paragraph } from "@dashlane/design-system";
import { FlowStep, UserSendManualInviteEvent } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
import { BIG_CARD_CONTAINER } from "./styles";
const I18N_KEYS = {
  HEADER_BUSINESS: "team_account_addseats_success_newseats_header_business",
  HEADER_TEAM: "team_account_addseats_success_newseats_header_team",
  BODY: "team_account_addseats_success_newseats_body",
  INVITE_USERS_BUTTON:
    "team_account_addseats_success_newseats_invite_users_cta",
  DOWNLOAD_RECEIPTS_BUTTON:
    "team_account_addseats_success_newseats_billing_history_cta",
  GO_TO_ACCOUNT_SUMMARY_BUTTON:
    "team_account_addseats_success_newseats_go_to_account_summary_cta",
};
interface NewSeatsInfoProps {
  isBusiness: boolean;
  additionalSeats: number;
  onGetPastReceipts?: () => void;
  showInviteUsersButton?: boolean;
  backNavigationHandler: () => void;
}
export const NewSeatsInfo = ({
  isBusiness,
  additionalSeats,
  showInviteUsersButton = true,
  onGetPastReceipts,
  backNavigationHandler,
}: NewSeatsInfoProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  return (
    <Flex flexDirection="column" gap="40px" sx={BIG_CARD_CONTAINER}>
      <Flex flexDirection="column" gap="8px">
        {isBusiness ? (
          <Heading
            as="h2"
            color="ds.text.neutral.catchy"
            id="header-buy-more-seats"
          >
            {translate(I18N_KEYS.HEADER_BUSINESS, { count: additionalSeats })}
          </Heading>
        ) : (
          <Heading as="h2" color="ds.text.neutral.catchy">
            {translate(I18N_KEYS.HEADER_TEAM, { count: additionalSeats })}
          </Heading>
        )}
        <Paragraph color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.BODY)}
        </Paragraph>
      </Flex>

      <Flex gap="8px">
        {showInviteUsersButton ? (
          <Link to={routes.teamMembersRoutePath}>
            <Button
              onClick={() => {
                logEvent(
                  new UserSendManualInviteEvent({
                    flowStep: FlowStep.Start,
                    inviteCount: 0,
                    inviteFailedCount: 0,
                    inviteResentCount: 0,
                    inviteSuccessfulCount: 0,
                    isImport: true,
                    isResend: false,
                  })
                );
              }}
              mood="brand"
            >
              {translate(I18N_KEYS.INVITE_USERS_BUTTON)}
            </Button>
          </Link>
        ) : null}
        {onGetPastReceipts ? (
          <Button mood="neutral" intensity="quiet" onClick={onGetPastReceipts}>
            {translate(I18N_KEYS.DOWNLOAD_RECEIPTS_BUTTON)}
          </Button>
        ) : (
          <Button
            mood="neutral"
            intensity="quiet"
            onClick={backNavigationHandler}
          >
            {translate(I18N_KEYS.GO_TO_ACCOUNT_SUMMARY_BUTTON)}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
