import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import Tooltip from 'rc-tooltip';
import { PasswordEvaluationResult } from '@dashlane/communication';
import { ZXCVBN_I18N_KEYS } from 'account/creation/confirm/i18nKeys';
import 'rc-tooltip/assets/bootstrap.css';
import tooltipStyles from './styles.css';
type Props = React.PropsWithChildren<{
    id: string;
    passwordStrength: PasswordEvaluationResult | null;
    showTooltip: boolean;
}>;
const getContentKeys = (passwordStrength: PasswordEvaluationResult | null): string[] => {
    if (!passwordStrength || !passwordStrength.feedback) {
        return [];
    }
    const { suggestions = [], warning } = passwordStrength.feedback;
    return [
        ...suggestions.map((suggestion: string) => ZXCVBN_I18N_KEYS[suggestion]),
        ...(warning ? [ZXCVBN_I18N_KEYS[warning]] : []),
    ];
};
export const PasswordStrengthTooltip = ({ children, id, passwordStrength, showTooltip, }: Props) => {
    const { translate } = useTranslate();
    const content = getContentKeys(passwordStrength);
    return (<Tooltip destroyTooltipOnHide id={id} trigger={[]} visible={showTooltip && content.length > 0} placement="top" overlayClassName={tooltipStyles.tooltipContainer} overlay={<div className={tooltipStyles.inner}>
          <ul>
            {content.map((str) => (<li key={`${id}${str}`}>{translate(str)}</li>))}
          </ul>
        </div>}>
      <div>{children}</div>
    </Tooltip>);
};
