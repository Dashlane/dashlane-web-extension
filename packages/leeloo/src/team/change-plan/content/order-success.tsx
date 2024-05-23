import { Fragment, ReactNode, useEffect } from 'react';
import { AlertSeverity, AlertSize, FlexContainer, Paragraph, PhoneIcon, SharingCenterIcon, SharingGroupIcon, ToolsIcon, useAlert, VpnIcon, } from '@dashlane/ui-components';
import { Button, colors, jsx } from '@dashlane/design-system';
import { Mood } from '@dashlane/design-system/dist/types/src/types';
import { ButtonIntensity } from '@dashlane/design-system/dist/types/src/components/button/button';
import { CallToAction, UserCallToActionEvent } from '@dashlane/hermes';
import { TeamSettingsRoutes } from 'app/routes/constants';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { Link, useRouterGlobalSettingsContext } from 'libs/router';
import { ChangePlanCard } from '../layout/change-plan-card';
interface Action {
    mood: Mood;
    intensity: ButtonIntensity;
    content: string;
    link: string;
    external?: boolean;
    logEvent?: UserCallToActionEvent;
}
interface Feature {
    header: string;
    description: string;
    icon: ReactNode;
    actions: Array<Action>;
}
interface SuccessPlan {
    header: string;
    description: string;
    alert: string;
    features: Array<Feature>;
}
interface SuccessData {
    team: SuccessPlan;
    business: SuccessPlan;
}
interface UsePlanDataProps {
    targetPlan: string;
}
interface UsePlanDataOutput {
    data: SuccessPlan;
}
const usePlanData = ({ targetPlan }: UsePlanDataProps): UsePlanDataOutput => {
    const { routes } = useRouterGlobalSettingsContext();
    const SETTINGS_PATHS = {
        DIRECTORY_SYNC: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.DIRECTORY_SYNC}`,
        POLICIES: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.POLICIES}`,
        SSO: `${routes.teamSettingsRoutePath}${TeamSettingsRoutes.SSO}`,
    };
    const data = {
        team: {
            header: 'team_account_teamplan_changeplan_success_team_header',
            description: 'team_account_teamplan_changeplan_success_team_description',
            alert: 'team_account_teamplan_changeplan_success_team_alert',
            features: [
                {
                    header: 'team_account_teamplan_changeplan_success_features_vpn_header',
                    description: 'team_account_teamplan_changeplan_success_features_vpn_description',
                    icon: <VpnIcon size={24}/>,
                    actions: [
                        {
                            mood: 'brand',
                            intensity: 'catchy',
                            content: 'team_account_teamplan_changeplan_success_features_actions_turn_on_vpn_access',
                            link: SETTINGS_PATHS.POLICIES,
                        },
                        {
                            external: true,
                            mood: 'neutral',
                            intensity: 'quiet',
                            content: 'team_account_teamplan_changeplan_success_features_actions_see_setup_guide',
                            link: '*****',
                        },
                    ],
                },
                {
                    header: 'team_account_teamplan_changeplan_success_features_protection_header',
                    description: 'team_account_teamplan_changeplan_success_features_protection_description',
                    icon: <SharingGroupIcon size={24}/>,
                    actions: [
                        {
                            mood: 'brand',
                            intensity: 'catchy',
                            content: 'team_account_teamplan_changeplan_success_features_actions_add_seats',
                            link: `${routes.teamAccountRoutePath}?showSeatsDialog=true`,
                        },
                    ],
                },
            ],
        },
        business: {
            header: 'team_account_teamplan_changeplan_success_business_header',
            description: 'team_account_teamplan_changeplan_success_business_description',
            alert: 'team_account_teamplan_changeplan_success_business_alert',
            features: [
                {
                    header: 'team_account_teamplan_changeplan_success_sso_header',
                    description: 'team_account_teamplan_changeplan_success_sso_copy',
                    icon: <ToolsIcon size={24}/>,
                    actions: [
                        {
                            mood: 'brand',
                            intensity: 'catchy',
                            content: 'team_account_teamplan_changeplan_success_features_actions_start_setup',
                            link: SETTINGS_PATHS.SSO,
                        },
                        {
                            external: true,
                            mood: 'neutral',
                            intensity: 'quiet',
                            content: 'team_account_teamplan_changeplan_success_features_actions_see_setup_guide',
                            link: '*****',
                        },
                    ],
                },
                {
                    header: 'team_account_teamplan_changeplan_success_features_scim_header',
                    description: 'team_account_teamplan_changeplan_success_features_scim_description',
                    icon: <SharingCenterIcon size={24}/>,
                    actions: [
                        {
                            mood: 'brand',
                            intensity: 'catchy',
                            content: 'team_account_teamplan_changeplan_success_features_actions_start_setup',
                            link: SETTINGS_PATHS.DIRECTORY_SYNC,
                        },
                        {
                            external: true,
                            mood: 'neutral',
                            intensity: 'quiet',
                            content: 'team_account_teamplan_changeplan_success_features_actions_see_setup_guide',
                            link: '*****',
                        },
                    ],
                },
                {
                    header: 'team_account_teamplan_changeplan_success_features_friends_and_family_header',
                    description: 'team_account_teamplan_changeplan_success_features_friends_and_family_description',
                    icon: <SharingGroupIcon size={24}/>,
                    actions: [
                        {
                            external: true,
                            mood: 'brand',
                            intensity: 'catchy',
                            content: 'team_account_teamplan_changeplan_success_features_actions_learn_more',
                            link: '*****',
                        },
                    ],
                },
                {
                    header: 'team_account_teamplan_changeplan_success_features_phone_support_header',
                    description: 'team_account_teamplan_changeplan_success_features_phone_support_description',
                    icon: <PhoneIcon size={24}/>,
                    actions: [
                        {
                            external: true,
                            mood: 'brand',
                            intensity: 'catchy',
                            content: 'team_account_teamplan_changeplan_success_features_actions_schedule_a_call',
                            link: '*****',
                            logEvent: new UserCallToActionEvent({
                                callToActionList: [CallToAction.ContactPhoneSupport],
                                chosenAction: CallToAction.ContactPhoneSupport,
                                hasChosenNoAction: false,
                            }),
                        },
                    ],
                },
            ],
        },
    } as SuccessData;
    return { data: data[targetPlan] };
};
interface Props {
    targetPlan: 'business' | 'team';
}
export const OrderSuccess = ({ targetPlan }: Props) => {
    const { translate } = useTranslate();
    const { data } = usePlanData({ targetPlan });
    const { alert, show } = useAlert({
        message: translate(data.alert),
        severity: AlertSeverity.SUCCESS,
        size: AlertSize.SMALL,
        dismissDelay: 5000,
    });
    useEffect(() => {
        show();
    }, []);
    return (<>
      <div style={{
            bottom: '12px',
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            width: '600px',
        }}>
        {alert}
      </div>
      <ChangePlanCard title={translate(data.header)} sx={{ width: '632px', padding: '32px' }}>
        <div style={{ marginTop: '8px' }}>
          <Paragraph size="medium" color={colors.lightTheme.ds.text.neutral.quiet}>
            {translate(data.description)}
          </Paragraph>
        </div>
        <FlexContainer sx={{
            marginTop: '32px',
            display: 'flex',
            flexDirection: 'column',
            borderBottom: `1px solid ${colors.lightTheme.ds.border.neutral.quiet.idle}`,
        }}>
          {data.features.map((feature) => (<FlexContainer key={feature.header} flexDirection="column" sx={{
                display: 'flex',
                flexDirection: 'column',
                borderTop: `1px solid ${colors.lightTheme.ds.border.neutral.quiet.idle}`,
                padding: '32px 0',
            }}>
              <FlexContainer flexDirection="row" gap="16px" flexWrap="nowrap">
                <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: colors.lightTheme.ds.container.expressive.brand.quiet
                    .idle,
            }}>
                  {feature.icon}
                </div>
                <FlexContainer flexDirection="column" gap="8px">
                  <Paragraph bold color={colors.lightTheme.ds.text.neutral.catchy}>
                    {translate(feature.header)}
                  </Paragraph>
                  <Paragraph size="x-small" color={colors.lightTheme.ds.text.neutral.quiet}>
                    {translate(feature.description)}
                  </Paragraph>
                  <FlexContainer gap="8px">
                    {feature.actions.map((action) => action.external ? (<a href={action.link} key={action.content} target="_blank" rel="noopener noreferrer">
                          <Button mood={action.mood} intensity={action.intensity} size="small" type="button" onClick={() => {
                    if (action.logEvent) {
                        logEvent(action.logEvent);
                    }
                }}>
                            {translate(action.content)}
                          </Button>
                        </a>) : (<Link to={action.link} key={action.content}>
                          <Button mood={action.mood as Mood} intensity={action.intensity as ButtonIntensity} size="small" type="button">
                            {translate(action.content)}
                          </Button>
                        </Link>))}
                  </FlexContainer>
                </FlexContainer>
              </FlexContainer>
            </FlexContainer>))}
        </FlexContainer>
      </ChangePlanCard>
    </>);
};
