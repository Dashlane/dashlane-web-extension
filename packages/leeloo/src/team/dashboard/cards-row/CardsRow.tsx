import { PropsWithChildren } from 'react';
import classnames from 'classnames';
import { Card, InfoCircleIcon, Tooltip } from '@dashlane/ui-components';
import { Heading, jsx } from '@dashlane/design-system';
import { PasswordHealth, Seats } from '@dashlane/team-admin-contracts';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { Link } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { PasswordHealthScore } from '../password-health-score/PasswordHealthScore';
import styles from './styles.css';
const SX_STYLES = {
    HEADER: {
        display: 'flex',
        marginBottom: '8px',
    },
    FOOTER: {
        marginTop: '16px',
        lineHeight: '1',
        fontSize: '16px',
    },
};
const I18N_KEYS = {
    CARD_COMPROMISED: 'team_dashboard_card_compromised',
    CARD_COMPROMISED_DETAILS_LINK: 'team_dashboard_card_compromised_details_link',
    CARD_COMPROMISED_INFO: 'team_dashboard_card_compromised_info',
    CARD_HEALTH_SCORE: 'team_dashboard_card_health_score',
    CARD_HEALTH_SCORE_INFO: 'team_dashboard_card_health_score_info',
    CARD_PENDING_INVITATIONS: 'team_dashboard_card_pending_invitations',
    CARD_PENDING_INVITATIONS_INFO: 'team_dashboard_card_pending_invitations_info',
    CARD_SEND_INVITATIONS_LINK: 'team_dashboard_card_send_invitations_link',
    CARD_RESEND_INVITATIONS_LINK: 'team_dashboard_card_resend_invitations_link',
    CARD_SEATS_BUY_LINK: 'team_dashboard_card_seats_buy_link',
    CARD_SEATS_TAKEN: 'team_dashboard_card_seats_taken',
    CARD_SEATS_TAKEN_INFO: 'team_dashboard_card_seats_taken_info',
};
const InfoIconWithTooltip = ({ title }: Record<'title', string>) => (<Tooltip sx={{ fontSize: 2, maxWidth: '180px' }} placement="bottom" content={title}>
    <InfoCircleIcon size={13} tabIndex={0} color={'ds.text.neutral.quiet'}/>
  </Tooltip>);
const cardHeading = (heading: string) => {
    return (<Heading as="h1" color="ds.text.neutral.quiet" textStyle="ds.title.supporting.small">
      {heading}
    </Heading>);
};
const CardsRowCard = ({ children, }: PropsWithChildren<Record<never, never>>) => {
    return (<Card sx={{
            height: '132px',
            width: '232px',
            marginRight: '32px',
            flexShrink: '0',
            padding: '16px',
            overflow: 'inherit',
            color: 'ds.text.neutral.catchy',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            borderColor: 'ds.border.neutral.quiet.idle',
        }}>
      {children}
    </Card>);
};
interface CardsRowProps {
    passwordHealth: PasswordHealth;
    seats: Seats;
    passwordHealthHistoryEmpty: boolean;
}
export const CardsRow = ({ passwordHealth, seats, passwordHealthHistoryEmpty, }: CardsRowProps) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const { compromised, securityIndex } = passwordHealth;
    const seatsTaken = `${seats.used}/${seats.provisioned}`;
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const handleClickOnLink = () => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
    };
    return (<section className={styles.cardsRow} sx={{
            display: 'flex',
            justifyContent: 'flex-start',
        }}>
      <CardsRowCard>
        <header sx={SX_STYLES.HEADER}>
          {cardHeading(translate(I18N_KEYS.CARD_HEALTH_SCORE))}
          <InfoIconWithTooltip title={translate(I18N_KEYS.CARD_HEALTH_SCORE_INFO)}/>
        </header>
        <div className={styles.value}>
          <PasswordHealthScore showPasswordHealthScore={!passwordHealthHistoryEmpty} securityIndex={securityIndex} shieldSize={32}/>
        </div>
      </CardsRowCard>
      <CardsRowCard>
        <header sx={SX_STYLES.HEADER}>
          {cardHeading(translate(I18N_KEYS.CARD_COMPROMISED))}
          <InfoIconWithTooltip title={translate(I18N_KEYS.CARD_COMPROMISED_INFO)}/>
        </header>
        <div className={classnames(styles.value, compromised ? styles.compromised : undefined)}>
          {compromised}
        </div>
        {compromised ? (<footer sx={SX_STYLES.FOOTER}>
            <Link className={styles.link} to={routes.teamMembersRoutePath}>
              {translate(I18N_KEYS.CARD_COMPROMISED_DETAILS_LINK)}
            </Link>
          </footer>) : null}
      </CardsRowCard>
      <CardsRowCard>
        <header sx={SX_STYLES.HEADER}>
          {cardHeading(translate(I18N_KEYS.CARD_SEATS_TAKEN))}
          <InfoIconWithTooltip title={translate(I18N_KEYS.CARD_SEATS_TAKEN_INFO)}/>
        </header>
        <div className={classnames(styles.value, {
            [styles.fontSizeBigger]: seatsTaken.length >= 8,
        })}>
          {seatsTaken}
        </div>
        <footer sx={SX_STYLES.FOOTER}>
          <Link className={styles.link} to={!shouldShowTrialDiscontinuedDialog
            ? routes.teamAccountRoutePath
            : {}} onClick={handleClickOnLink}>
            {translate(I18N_KEYS.CARD_SEATS_BUY_LINK)}
          </Link>
        </footer>
      </CardsRowCard>
      <CardsRowCard>
        <header sx={SX_STYLES.HEADER}>
          {cardHeading(translate(I18N_KEYS.CARD_PENDING_INVITATIONS))}
          <InfoIconWithTooltip title={translate(I18N_KEYS.CARD_PENDING_INVITATIONS_INFO)}/>
        </header>
        <div className={styles.value}>{seats.pending}</div>
        <footer sx={SX_STYLES.FOOTER}>
          <Link onClick={handleClickOnLink} className={styles.link} to={!shouldShowTrialDiscontinuedDialog
            ? {
                pathname: routes.teamMembersRoutePath,
                state: seats.pending
                    ? {
                        openResendPendingInvitationsDialog: true,
                    }
                    : {
                        openSendInvitesDialog: true,
                    },
            }
            : {}}>
            {seats.pending
            ? translate(I18N_KEYS.CARD_RESEND_INVITATIONS_LINK)
            : translate(I18N_KEYS.CARD_SEND_INVITATIONS_LINK)}
          </Link>
        </footer>
      </CardsRowCard>
    </section>);
};
