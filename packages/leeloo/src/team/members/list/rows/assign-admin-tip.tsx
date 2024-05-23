import { PropsWithChildren } from 'react';
import { FlexContainer, Tooltip } from '@dashlane/ui-components';
import { Button, Heading, jsx, Paragraph } from '@dashlane/design-system';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
import { AdminRightsEducationImage } from './admin-rights-education-image';
const I18N_KEYS = {
    ADD_MEMBER_TOOLTIP_TITLE: 'team_groups_add_assign_admin_tooltip_title',
    ADD_MEMBER_TOOLTIP_CONTENT: 'team_groups_add_assign_admin_tooltip_description',
    ADD_MEMBER_TOOLTIP_DISMISS: 'team_groups_add_assign_admin_tooltip_confirm_button',
};
const TAC_GETTING_STARTED_FF = 'onboarding_web_tacgetstarted';
type AssignAdminTipProps = PropsWithChildren<{
    tooltipDismissed: boolean;
    setTooltipDismissed: (dismissed: boolean) => void;
}>;
export const AssignAdminTip = ({ tooltipDismissed, setTooltipDismissed, children, }: AssignAdminTipProps) => {
    const { translate } = useTranslate();
    const features = useFeatureFlips();
    const { [TAC_GETTING_STARTED_FF]: hasTacGetStartedFF = false } = features.status !== DataStatus.Success ? {} : features.data;
    return (<Tooltip sx={{ maxWidth: '400px' }} passThrough={tooltipDismissed || !hasTacGetStartedFF} placement="left-start" arrowSize={8} trigger="persist" content={<FlexContainer flexDirection="column" gap="8px" sx={{ padding: '8px', textAlign: 'left', width: 'auto' }}>
          <Heading as={'h1'} color="ds.text.inverse.catchy">
            {translate(I18N_KEYS.ADD_MEMBER_TOOLTIP_TITLE)}
          </Heading>
          <Paragraph color="ds.text.inverse.standard">
            {translate(I18N_KEYS.ADD_MEMBER_TOOLTIP_CONTENT)}
          </Paragraph>
          <AdminRightsEducationImage />
          <Button onClick={() => setTooltipDismissed(true)} sx={{ alignSelf: 'end' }}>
            {translate(I18N_KEYS.ADD_MEMBER_TOOLTIP_DISMISS)}
          </Button>
        </FlexContainer>}>
      {children}
    </Tooltip>);
};
