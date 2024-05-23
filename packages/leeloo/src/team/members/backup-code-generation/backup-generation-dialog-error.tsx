import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { CrossCircleIcon, DialogBody, DialogFooter, DialogTitle, jsx, Paragraph, } from '@dashlane/ui-components';
import { colors } from '@dashlane/design-system';
interface Props {
    handleClickOnRetry: () => void;
}
const I18N_KEYS = {
    ERROR_TITLE: 'team_members_generate_recovery_codes_error_dialog_title',
    ERROR_DESCRIPTION: 'team_members_generate_recovery_codes_error_dialog_description',
    ERROR_TRY_AGAIN_BUTTON: 'team_members_generate_recovery_codes_error_dialog_confirm_button',
};
export const BackupCodeGenerationDialogError = ({ handleClickOnRetry, }: Props) => {
    const { translate } = useTranslate();
    return (<>
      <div sx={{
            transform: 'translate(-5px, -5px)',
            margin: '25px 0px',
        }}>
        <CrossCircleIcon color={colors.lightTheme.ds.text.danger.quiet} size={75}/>
      </div>
      <DialogTitle id="backup-code-generation-error-dialog-title" title={translate(I18N_KEYS.ERROR_TITLE)}/>
      <DialogBody>
        <Paragraph id="backup-code-generation-error-dialog-description" sx={{
            color: colors.lightTheme.ds.text.neutral.standard,
        }}>
          {translate(I18N_KEYS.ERROR_DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.ERROR_TRY_AGAIN_BUTTON)} primaryButtonProps={{
            id: 'backup-code-generation-error-dialog-try-again-button',
            type: 'button',
            autoFocus: true,
        }} primaryButtonOnClick={() => handleClickOnRetry()}/>
    </>);
};
