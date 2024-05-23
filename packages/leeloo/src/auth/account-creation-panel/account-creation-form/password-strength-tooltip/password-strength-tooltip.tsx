import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import Tooltip from 'rc-tooltip';
import { PasswordEvaluationResult } from '@dashlane/communication';
import tooltipStyles from './styles.css';
import '!style-loader!css-loader!rc-tooltip/assets/bootstrap.css';
const I18N_KEYS = {
    BASE: 'webapp_auth_panel_standalone_account_creation_',
    TOOLTIPS_TITLE: 'webapp_auth_panel_standalone_account_creation_zxcvbn_tooltips_title',
};
interface Props {
    showTooltip: boolean;
    passwordStrength: PasswordEvaluationResult | null;
    children?: React.ReactElement;
    id?: string;
}
const getContentKeys = (passwordStrength: PasswordEvaluationResult | null): string[] => {
    if (!passwordStrength || !passwordStrength.feedback) {
        return [];
    }
    const { suggestions = [], warning } = passwordStrength.feedback;
    return [
        ...suggestions.map((suggestion: string) => `${I18N_KEYS.BASE}${suggestion}`),
        ...(warning ? [`${I18N_KEYS.BASE}${warning}`] : []),
    ];
};
export const PasswordStrengthTooltip = ({ id, passwordStrength, children, showTooltip, }: Props) => {
    const { translate } = useTranslate();
    const content = getContentKeys(passwordStrength).map((s) => translate(s));
    const visible = showTooltip && content.length > 0;
    return (<Tooltip destroyTooltipOnHide id={id} trigger={[]} visible={visible} placement="top" overlayClassName={tooltipStyles.tooltipContainer} overlay={<div className={tooltipStyles.inner}>
          <ul>
            {content.map((str) => (<li key={str}>{str}</li>))}
          </ul>
        </div>}>
      <div>{children}</div>
    </Tooltip>);
};
