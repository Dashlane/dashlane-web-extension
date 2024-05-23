import { FlexContainer } from '@dashlane/ui-components';
import { jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { useGetTeamName } from 'team/hooks/use-get-team-name';
const I18N_KEYS = {
    TITLE: 'team_get_started_welcome_title',
    TITLE_TASKS_COMPLETED: 'team_get_started_title_tasks_completed',
    SUBTITLE: 'team_get_started_welcome_subtitle',
};
interface HeaderMessageProps {
    allTasksCompleted: boolean;
}
export const HeaderMessage = ({ allTasksCompleted }: HeaderMessageProps) => {
    const { translate } = useTranslate();
    const teamName = useGetTeamName();
    if (!teamName) {
        return null;
    }
    return (<FlexContainer flexDirection="column" gap="8px">
      <Paragraph textStyle="ds.specialty.brand.small" sx={{ fontWeight: '700' }}>
        {translate(!allTasksCompleted
            ? I18N_KEYS.TITLE
            : I18N_KEYS.TITLE_TASKS_COMPLETED)}
      </Paragraph>
      <Paragraph color="ds.text.neutral.quiet">
        {!allTasksCompleted
            ? translate(I18N_KEYS.SUBTITLE, {
                team: teamName,
            })
            : null}
      </Paragraph>
    </FlexContainer>);
};
