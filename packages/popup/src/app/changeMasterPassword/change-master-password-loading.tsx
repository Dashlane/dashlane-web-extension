import * as React from 'react';
import { ClockOutlinedIcon, colors } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Progress } from './progress-wrapper';
interface Props {
    progressValue: number;
}
const I18N_KEYS = {
    DESCRIPTION: 'master_password_progress/loading_desc',
    SUB_DESCRIPTION: 'master_password_progress/loading_sub_desc',
};
export const ChangeMasterPasswordLoading = ({ progressValue }: Props) => {
    const { translate } = useTranslate();
    return (<Progress description={translate(I18N_KEYS.DESCRIPTION)} subdescription={translate(I18N_KEYS.SUB_DESCRIPTION)} icon={<ClockOutlinedIcon color={colors.midGreen04} size={64}/>} progressValue={progressValue}/>);
};
