import React from 'react';
import { ShieldCheckIcon, ShieldFlagIcon, ShieldQuestionIcon, } from '@dashlane/ui-components';
import { PasswordHealth } from '@dashlane/team-admin-contracts';
import { roundToFirstDecimalOrInt } from 'team/utils';
interface PasswordHealthScoreProps extends Pick<PasswordHealth, 'securityIndex'> {
    showPasswordHealthScore: boolean;
    shieldSize: number;
}
export const PasswordHealthScore = ({ showPasswordHealthScore, securityIndex, shieldSize, }: PasswordHealthScoreProps) => {
    let color = '';
    if (!showPasswordHealthScore) {
        color = 'ds.text.brand.quiet';
        return (<>
        <ShieldQuestionIcon size={shieldSize} color={color}/>
        {'-'}
      </>);
    }
    if (securityIndex >= 80) {
        color = 'ds.text.positive.quiet';
    }
    else if (securityIndex >= 40) {
        color = 'ds.text.warning.quiet';
    }
    else {
        color = 'ds.text.danger.quiet';
    }
    return securityIndex >= 60 ? (<>
      <ShieldCheckIcon size={shieldSize} color={color} viewBox="5 5 40 40"/>
      {`${roundToFirstDecimalOrInt(securityIndex)}%`}
    </>) : (<>
      <ShieldFlagIcon size={shieldSize} color={color} viewBox="5 5 40 40"/>
      {`${roundToFirstDecimalOrInt(securityIndex)}%`}
    </>);
};
