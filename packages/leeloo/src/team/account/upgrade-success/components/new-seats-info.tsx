import { Button, jsx } from '@dashlane/design-system';
import { FlowStep, UserSendManualInviteEvent } from '@dashlane/hermes';
import { FlexContainer, Heading, Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { Link, useRouterGlobalSettingsContext } from 'libs/router';
interface NewSeatsInfoProps {
    isBusiness: boolean;
    additionalSeats: number;
    onGetPastReceipts: () => void;
}
export const NewSeatsInfo = ({ isBusiness, additionalSeats, onGetPastReceipts, }: NewSeatsInfoProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    return (<FlexContainer flexDirection="column" gap="40px" sx={{
            borderStyle: 'solid',
            borderColor: 'ds.border.neutral.quiet.idle',
            borderWidth: '1px',
            borderRadius: '4px',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            padding: '32px',
        }}>
      <FlexContainer flexDirection="column" gap="8px">
        {isBusiness ? (<Heading size="small">
            {translate('team_account_addseats_success_newseats_header_business', {
                count: additionalSeats,
            })}
          </Heading>) : (<Heading size="small">
            {translate('team_account_addseats_success_newseats_header_team', {
                count: additionalSeats,
            })}
          </Heading>)}
        <Paragraph color="ds.text.neutral.quiet">
          {translate('team_account_addseats_success_newseats_body')}
        </Paragraph>
      </FlexContainer>

      <FlexContainer gap="8px">
        <Link to={routes.teamMembersRoutePath}>
          <Button onClick={() => {
            logEvent(new UserSendManualInviteEvent({
                flowStep: FlowStep.Start,
                inviteCount: 0,
                inviteFailedCount: 0,
                inviteResentCount: 0,
                inviteSuccessfulCount: 0,
                isImport: true,
                isResend: false,
            }));
        }} mood="brand">
            {translate('team_account_addseats_success_newseats_invite_users_cta')}
          </Button>
        </Link>
        <Button mood="neutral" intensity="quiet" onClick={onGetPastReceipts}>
          {translate('team_account_addseats_success_newseats_billing_history_cta')}
        </Button>
      </FlexContainer>
    </FlexContainer>);
};
