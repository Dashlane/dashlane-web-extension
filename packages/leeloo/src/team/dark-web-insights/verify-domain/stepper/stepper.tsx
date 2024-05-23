import Step from 'team/page/step';
import useTranslate from 'libs/i18n/useTranslate';
import { Card, colors, FlexContainer, jsx } from '@dashlane/ui-components';
import numberOne from './assets/numberOne.svg';
import numberTwo from './assets/numberTwo.svg';
import numberThree from './assets/numberThree.svg';
const I18N_KEYS = {
    VERIFY_DOMAIN_TITLE: 'team_breach_report_verify_domain_stepper_title',
    VERIFY_DOMAIN_SUBTITLE: 'team_dark_web_insights_stepper_verify_domain_subtitle',
    VIEW_INSIGHTS_TITLE: 'team_dark_web_insights_view_insights_stepper_title',
    VIEW_INSIGHTS_SUBTITLE: 'team_dark_web_insights_view_insights_stepper_subtitle',
    REDUCE_RISK_TITLE: 'team_breach_report_reduce_risk_title',
    REDUCE_RISK_SUBTITLE: 'team_breach_report_reduce_risk_subtitle',
};
export const Stepper = () => {
    const { translate } = useTranslate();
    const customDotStyle = {
        marginTop: '18px',
    };
    return (<Card sx={{ padding: '12px 12px 48px', minHeight: '200px' }}>
      <FlexContainer sx={{
            justifyContent: 'space-between',
            marginTop: '80px',
            paddingLeft: '24px',
            borderBottom: `solid 2px ${colors.grey00}`,
        }}>
        <Step img={numberOne} title={translate(I18N_KEYS.VERIFY_DOMAIN_TITLE)} subtitle={translate(I18N_KEYS.VERIFY_DOMAIN_SUBTITLE)} caps={true} dotStyle={customDotStyle}/>

        <Step img={numberTwo} title={translate(I18N_KEYS.VIEW_INSIGHTS_TITLE)} subtitle={translate(I18N_KEYS.VIEW_INSIGHTS_SUBTITLE)} caps={true} dotStyle={customDotStyle}/>

        <Step img={numberThree} title={translate(I18N_KEYS.REDUCE_RISK_TITLE)} subtitle={translate(I18N_KEYS.REDUCE_RISK_SUBTITLE)} caps={true} dotStyle={customDotStyle}/>
      </FlexContainer>
    </Card>);
};
