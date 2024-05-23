import { Heading, jsx, mergeSx } from '@dashlane/design-system';
import { ClickOrigin } from '@dashlane/hermes';
import { FlexChild, FlexContainer } from '@dashlane/ui-components';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
import { saveTeamName } from './name/handlers';
import { TeamName } from './name/team-name';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { useGetTeamName } from 'team/hooks/use-get-team-name';
import { UpgradeTile, useShowUpgradeTile, } from 'team/upgrade-tile/upgrade-tile';
import { TeamPlan } from './team-plan/team-plan';
import { SX_ACCOUNT_STYLES } from '../account.styles';
const I18N_KEYS = {
    HEADING_TEAM_ACCOUNT_SUMMARY: 'team_account_heading_team_setup',
    TEAM_ACCOUNT_STATUS: 'team_account_teamplan',
};
interface Props {
    lee: Lee;
    seatsNumber: number;
    isWindowCollapsed: boolean;
    onRequestBuyMoreSeats: () => void;
    onRequestTeamUpgrade: (clickOrigin: ClickOrigin) => void;
}
export const TeamSetup = ({ lee, seatsNumber, isWindowCollapsed, onRequestBuyMoreSeats, onRequestTeamUpgrade, }: Props) => {
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const showUpgradeTile = useShowUpgradeTile({});
    const handleNameSave = (teamName: string) => saveTeamName(teamName, lee, translate, reportTACError);
    const teamName = useGetTeamName();
    if (teamName === null) {
        return null;
    }
    return (<FlexContainer flexDirection="column">
      <Heading textStyle="ds.title.section.large" as="h1" color="ds.text.neutral.standard" sx={{ marginBottom: '32px' }}>
        {translate(I18N_KEYS.HEADING_TEAM_ACCOUNT_SUMMARY)}
      </Heading>
      <FlexContainer flexDirection="row" gap="24px">
        <FlexContainer flexDirection="column" sx={mergeSx([
            {
                flexGrow: '1',
                backgroundColor: 'ds.container.agnostic.neutral.supershy',
                padding: '32px',
                maxWidth: '40em',
            },
            SX_ACCOUNT_STYLES.CARD_BORDER,
        ])}>
          <TeamName lee={lee} handleSave={handleNameSave} defaultValue={teamName}/>
          <div sx={{ marginTop: '2em' }}>
            <Heading color="ds.text.neutral.catchy" as="h2" textStyle="ds.title.section.medium">
              {translate(I18N_KEYS.TEAM_ACCOUNT_STATUS)}
            </Heading>
            <TeamPlan licenseCount={seatsNumber} onRequestBuyMoreSeats={onRequestBuyMoreSeats} onRequestTeamUpgrade={onRequestTeamUpgrade}/>
          </div>
        </FlexContainer>
        {showUpgradeTile ? (<FlexChild sx={mergeSx([
                {
                    backgroundColor: 'ds.container.agnostic.neutral.supershy',
                    width: isWindowCollapsed ? '40em' : '416px',
                    padding: '32px',
                },
                SX_ACCOUNT_STYLES.CARD_BORDER,
            ])}>
            <UpgradeTile />
          </FlexChild>) : null}
      </FlexContainer>
    </FlexContainer>);
};
