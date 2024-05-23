import { jsx, Paragraph } from '@dashlane/design-system';
import { PasswordHealth } from '@dashlane/team-admin-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { PasswordHealthScore } from '../../password-health-score/PasswordHealthScore';
const I18N_KEYS = {
    PASSWORD_HEALTH_BREAKDOWN_COMPROMISED: 'team_dashboard_password_health_breakdown_compromised',
    PASSWORD_HEALTH_BREAKDOWN_REUSED: 'team_dashboard_password_health_breakdown_reused',
    PASSWORD_HEALTH_BREAKDOWN_SAFE: 'team_dashboard_password_health_breakdown_safe',
    PASSWORD_HEALTH_BREAKDOWN_SCORE: 'team_dashboard_password_health_breakdown_score',
    PASSWORD_HEALTH_BREAKDOWN_TOTAL: 'team_dashboard_password_health_breakdown_total',
    PASSWORD_HEALTH_BREAKDOWN_WEAK: 'team_dashboard_password_health_breakdown_weak',
};
interface PasswordBreakdownItemProps {
    title: string;
    value: number;
    color?: string;
}
const PasswordBreakdownItem = ({ title, value, color, }: PasswordBreakdownItemProps) => (<div sx={{ marginRight: '8px', minWidth: '70px' }}>
    <header>
      <Paragraph as="h2" color="ds.text.neutral.quiet" textStyle="ds.body.helper.regular">
        {title}
      </Paragraph>
    </header>
    <div sx={{
        fontSize: 'x-large',
        fontWeight: 'bold',
        color: color ?? 'ds.text.neutral.standard',
    }}>
      {value}
    </div>
  </div>);
interface PasswordHealthDetailsRowProps extends PasswordHealth {
    passwordHealthHistoryEmpty: boolean;
}
export const PasswordHealthDetailsRow = ({ compromised, passwords, reused, safe, securityIndex, weak, passwordHealthHistoryEmpty, }: PasswordHealthDetailsRowProps) => {
    const { translate } = useTranslate();
    return (<section sx={{
            borderTop: `1px solid`,
            borderTopColor: 'ds.border.neutral.quiet.idle',
            display: 'flex',
            padding: '3% 2%',
        }}>
      <div sx={{
            width: '240px',
            padding: '0 24px',
            borderRight: `1px solid`,
            borderRightColor: 'ds.border.neutral.quiet.idle',
        }}>
        <header>
          <Paragraph as="h2" color="ds.text.neutral.quiet" textStyle="ds.body.helper.regular">
            {translate(I18N_KEYS.PASSWORD_HEALTH_BREAKDOWN_SCORE)}
          </Paragraph>
        </header>
        <div sx={{
            fontSize: 'x-large',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            '& > svg': {
                marginRight: '7px',
            },
            color: 'ds.text.neutral.standard',
        }}>
          <PasswordHealthScore showPasswordHealthScore={!passwordHealthHistoryEmpty} securityIndex={securityIndex} shieldSize={20}/>
        </div>
      </div>
      <div sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 24px',
            width: '100%',
        }}>
        <PasswordBreakdownItem title={translate(I18N_KEYS.PASSWORD_HEALTH_BREAKDOWN_TOTAL)} value={passwords}/>
        <PasswordBreakdownItem title={translate(I18N_KEYS.PASSWORD_HEALTH_BREAKDOWN_SAFE)} value={safe} color={safe ? 'ds.text.positive.quiet' : undefined}/>
        <PasswordBreakdownItem title={translate(I18N_KEYS.PASSWORD_HEALTH_BREAKDOWN_WEAK)} value={weak} color={weak ? 'ds.text.warning.quiet' : undefined}/>
        <PasswordBreakdownItem title={translate(I18N_KEYS.PASSWORD_HEALTH_BREAKDOWN_REUSED)} value={reused} color={reused ? 'ds.text.warning.quiet' : undefined}/>
        <PasswordBreakdownItem title={translate(I18N_KEYS.PASSWORD_HEALTH_BREAKDOWN_COMPROMISED)} value={compromised} color={compromised ? 'ds.text.danger.quiet' : undefined}/>
      </div>
    </section>);
};
