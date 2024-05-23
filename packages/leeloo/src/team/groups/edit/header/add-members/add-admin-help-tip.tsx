import { Button, Heading, jsx, Paragraph } from '@dashlane/design-system';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { FlexContainer, Tooltip } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useLocation } from 'libs/router';
import { PropsWithChildren } from 'react';
import { firstTimeGroupCreationState } from 'team/groups/list/group-list';
const TAC_GETTING_STARTED_FF = 'onboarding_web_tacgetstarted';
const I18N_KEYS = {
    ADD_MEMBER_TOOLTIP_TITLE: 'team_groups_edit_add_member_tooltip_title',
    ADD_MEMBER_TOOLTIP_CONTENT: 'team_groups_edit_add_member_tooltip_content',
    ADD_MEMBER_TOOLTIP_DISMISS: 'team_invite_dialog_infobox_action',
};
type AddAdminHelpTipProps = PropsWithChildren<{
    tooltipDismissed: boolean;
    setTooltipDismissed: (dismissed: boolean) => void;
}>;
export const AddAdminHelpTip = ({ tooltipDismissed, setTooltipDismissed, children, }: AddAdminHelpTipProps) => {
    const location = useLocation();
    const { translate } = useTranslate();
    const features = useFeatureFlips();
    const isFirstTimeGroupCreation = location.state?.[firstTimeGroupCreationState] ?? false;
    const { [TAC_GETTING_STARTED_FF]: hasTacGetStartedFF = false } = features.status !== DataStatus.Success ? {} : features.data;
    return (<Tooltip sx={{ maxWidth: '400px' }} passThrough={tooltipDismissed || !isFirstTimeGroupCreation || !hasTacGetStartedFF} placement="left-start" arrowSize={0} trigger="persist" content={<FlexContainer flexDirection="column" gap="8px" sx={{ padding: '8px', textAlign: 'left', width: 'auto' }}>
          <Heading as={'h1'} color="ds.text.inverse.catchy">
            {translate(I18N_KEYS.ADD_MEMBER_TOOLTIP_TITLE)}
          </Heading>
          <Paragraph color="ds.text.inverse.standard">
            {translate(I18N_KEYS.ADD_MEMBER_TOOLTIP_CONTENT)}
          </Paragraph>
          <Button onClick={() => setTooltipDismissed(true)} sx={{ alignSelf: 'end' }}>
            {translate(I18N_KEYS.ADD_MEMBER_TOOLTIP_DISMISS)}
          </Button>
        </FlexContainer>}>
      {children}
    </Tooltip>);
};
