import * as React from 'react';
import { Domain } from '@dashlane/communication';
import { CheckCircleIcon, colors, TextInput } from '@dashlane/ui-components';
const { accessibleValidatorGreen } = colors;
interface SuccessfulDomainProps {
    domain: Domain;
}
export const SuccessfulDomain = ({ domain }: SuccessfulDomainProps) => (<TextInput value={domain.name} endAdornment={<CheckCircleIcon color={accessibleValidatorGreen}/>} readOnly fullWidth/>);
