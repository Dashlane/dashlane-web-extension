import { jsx, Paragraph } from '@dashlane/design-system';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { Tooltip } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { PropsWithChildren } from 'react';
const TAC_GETTING_STARTED_FF = 'onboarding_web_tacgetstarted';
const I18N_KEYS = {
    NEW_GROUP_TOOLTIP: 'team_groups_list_new_group_tooltip',
};
type NewGroupHelpTipProps = PropsWithChildren<{
    key: string;
    index: number;
    isFirstTimeGroupCreation: boolean;
    hasNewGroupDelayPassed: boolean;
}>;
export const NewGroupHelpTip = ({ key, index, isFirstTimeGroupCreation, hasNewGroupDelayPassed, children, }: NewGroupHelpTipProps) => {
    const { translate } = useTranslate();
    const features = useFeatureFlips();
    const { [TAC_GETTING_STARTED_FF]: hasTacGetStartedFF = false } = features.status !== DataStatus.Success ? {} : features.data;
    return (<Tooltip sx={{
            '@keyframes fadeIn': {
                '0%': {
                    opacity: 0,
                },
                '100%': {
                    opacity: 1,
                },
            },
            animation: 'fadeIn 250ms ease-out',
        }} key={key} passThrough={index !== 0 ||
            !isFirstTimeGroupCreation ||
            !hasTacGetStartedFF ||
            !hasNewGroupDelayPassed} placement="bottom" arrowSize={12} trigger="persist" content={<Paragraph color="ds.text.inverse.standard">
          {translate(I18N_KEYS.NEW_GROUP_TOOLTIP)}
        </Paragraph>}>
      {children}
    </Tooltip>);
};
