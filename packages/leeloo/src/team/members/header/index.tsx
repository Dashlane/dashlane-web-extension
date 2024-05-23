import { Maybe } from 'tsmonad';
import { Button, ClickOrigin, UserClickEvent } from '@dashlane/hermes';
import { jsx, mergeSx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { Link } from 'libs/router';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import SecurityScore from 'team/members/header/security-score';
import styles from './styles.css';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    CONTAINER: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'ds.background.alternate',
        padding: '32px 48px',
    },
    SEATS_COUNT: {
        flexGrow: '1',
    },
    HEADER: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    PROGRESS_BAR_BACKGROUND: {
        backgroundColor: 'ds.border.neutral.quiet.idle',
        borderRadius: '20px',
        height: '16px',
        marginTop: '12px',
        marginRight: '12px',
        width: '360px',
    },
    PROGRESS_BAR: {
        backgroundColor: 'ds.border.brand.standard.active',
        borderRadius: '20px',
        height: '16px',
    },
};
const I18N_KEYS = {
    HEADER_TITLE_COUNTER: 'team_members_header_title_counter',
    HEADER_TITLE_LABEL: 'team_members_header_title_label',
    ADD_MORE_SEATS: 'team_members_add_more_seats',
};
interface Props {
    accountRoute: string;
    companyName: string;
    takenSeats: number;
    totalSeats: number;
    teamSecurityScore: Maybe<number>;
    shouldDisplayTeamSecurityScore: boolean;
}
const Header = ({ accountRoute, companyName, takenSeats, totalSeats, teamSecurityScore, shouldDisplayTeamSecurityScore, }: Props) => {
    const { translate } = useTranslate();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    const handleClickOnBuyMoreSeats = () => {
        logEvent(new UserClickEvent({
            button: Button.BuySeats,
            clickOrigin: ClickOrigin.OnboardedUsersLimit,
        }));
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
    };
    const progressBarWidth = totalSeats
        ? Math.round((takenSeats * 360) / totalSeats)
        : 0;
    if (shouldShowTrialDiscontinuedDialog === null) {
        return null;
    }
    return (<div sx={SX_STYLES.CONTAINER}>
      <div sx={SX_STYLES.SEATS_COUNT}>
        <header sx={SX_STYLES.HEADER}>
          <Paragraph as="h1" textStyle="ds.specialty.spotlight.medium" color="ds.text.neutral.catchy">
            {`${takenSeats}/${totalSeats}`}
          </Paragraph>
          <Paragraph as="h2" textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.HEADER_TITLE_LABEL, {
            companyName: companyName,
        })}
          </Paragraph>
        </header>
        <div className={styles.seatsCountBottomline}>
          <div sx={SX_STYLES.PROGRESS_BAR_BACKGROUND}>
            <div sx={mergeSx([
            SX_STYLES.PROGRESS_BAR,
            { width: progressBarWidth },
        ])}/>
          </div>
          <Link to={!shouldShowTrialDiscontinuedDialog ? accountRoute : {}} className={styles.link} onClick={handleClickOnBuyMoreSeats}>
            {translate(I18N_KEYS.ADD_MORE_SEATS)}
          </Link>
        </div>
      </div>
      {shouldDisplayTeamSecurityScore && (<div className={styles.teamSecurityScore}>
          <SecurityScore score={teamSecurityScore}/>
        </div>)}
    </div>);
};
export default Header;
