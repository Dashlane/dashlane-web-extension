import * as React from 'react';
import { colors, CrossCircleIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Progress } from './progress-wrapper';
interface Props {
    onDone: () => void;
}
const I18N_KEYS = {
    DESCRIPTION: 'master_password_progress/error_desc',
    SUB_DESCRIPTION: 'master_password_progress/error_sub_desc',
    BUTTON_TRY_AGAIN: 'master_password_progress/error_button_tryagain',
};
export const ChangeMasterPasswordFailure = ({ onDone }: Props) => {
    const { translate } = useTranslate();
    return (<Progress description={translate(I18N_KEYS.DESCRIPTION)} subdescription={translate(I18N_KEYS.SUB_DESCRIPTION)} icon={<CrossCircleIcon color={colors.midGreen04} size={64}/>} actionButtonText={translate(I18N_KEYS.BUTTON_TRY_AGAIN)} handleAction={onDone}/>);
};
