import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DialogFooter, jsx, TextInput } from '@dashlane/ui-components';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { Lee } from 'lee';
import { useHasFeatureEnabled } from 'libs/carbon/hooks/useHasFeature';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { logFeedbackModalClosed, logFeedbackSent, sendFeedbackPageView, } from './logs';
import styles from './styles.css';
const I18N_KEYS = {
    DIALOG_BUTTON_OK: 'team_feedback_dialog_button_ok',
    DIALOG_BUTTON_CANCEL: 'team_feedback_dialog_button_cancel',
    DIALOG_TITLE: 'team_feedback_dialog_title',
    DIALOG_TEXT_MARKUP: 'team_feedback_dialog_text_markup',
    DIALOG_TEXTAREA_LABEL: 'team_feedback_dialog_textarea_label',
    DIALOG_ERROR_MARKUP: 'team_feedback_dialog_error_markup',
};
const I18N_KEYS_UPD = {
    DIALOG_UPD_TITLE: 'team_feedback_dialog_upd_title',
    DIALOG_UPD_TEXT_MARKUP: 'team_feedback_dialog_upd_text_markup',
    DIALOG_UPD_TEXTAREA_LABEL: 'team_feedback_dialog_upd_textarea_label',
};
interface Props {
    lee: Lee;
    onDismiss: () => void;
    onFeedbackSent: (error?: Error) => void;
}
const Feedback = ({ lee, onDismiss, onFeedbackSent }: Props) => {
    const [isCtaDisabled, setIsCtaDisabled] = useState<boolean>(true);
    const [isCtaLoading, setIsCtaLoading] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const contactSupportFeatureEnabled = useHasFeatureEnabled(FEATURE_FLIPS_WITHOUT_MODULE.ItadminTacPhonesupport);
    const { translate } = useTranslate();
    const { reportTACError } = useAlertQueue();
    const feedbackEl = useRef<HTMLTextAreaElement>();
    useEffect(() => {
        sendFeedbackPageView();
    }, []);
    const onClose = () => {
        logFeedbackModalClosed();
        onDismiss();
    };
    function _handleFeedbackFieldValueChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        const { value } = event.target;
        const ctaIsDisabled = !value;
        setIsCtaDisabled(ctaIsDisabled);
    }
    async function _sendFeedback(): Promise<void> {
        setIsCtaLoading(true);
        setShowError(false);
        try {
            await lee.apiMiddleware.feedback?.send({
                body: feedbackEl.current?.value ?? '',
            });
            logFeedbackSent();
            onFeedbackSent();
        }
        catch (apiError) {
            const error = new Error(apiError.message ?? apiError ?? 'unknown error in _sendFeedback');
            reportTACError(error);
            setIsCtaLoading(false);
            setShowError(true);
        }
    }
    return contactSupportFeatureEnabled ? (<SimpleDialog isOpen onRequestClose={onClose} footer={<DialogFooter intent="primary" primaryButtonTitle={translate(I18N_KEYS.DIALOG_BUTTON_OK)} primaryButtonOnClick={() => _sendFeedback()} primaryButtonProps={{
                disabled: isCtaDisabled || isCtaLoading,
            }}/>} title={translate(I18N_KEYS_UPD.DIALOG_UPD_TITLE)} showCloseIcon>
      <div className={styles.text}>
        {translate.markup(I18N_KEYS_UPD.DIALOG_UPD_TEXT_MARKUP, {}, { linkTarget: '_blank' })}
      </div>

      <TextInput sx={{ resize: 'vertical', maxHeight: '300px' }} fullWidth ref={feedbackEl} multiline placeholder={translate(I18N_KEYS_UPD.DIALOG_UPD_TEXTAREA_LABEL)} onChange={_handleFeedbackFieldValueChange.bind(this)}/>

      {showError ? (<div className={styles.error}>
          {translate.markup(I18N_KEYS.DIALOG_ERROR_MARKUP)}
        </div>) : null}
    </SimpleDialog>) : (<SimpleDialog isOpen onRequestClose={onClose} footer={<DialogFooter intent="primary" primaryButtonTitle={translate(I18N_KEYS.DIALOG_BUTTON_OK)} primaryButtonOnClick={() => _sendFeedback()} primaryButtonProps={{
                disabled: isCtaDisabled || isCtaLoading,
            }} secondaryButtonTitle={translate(I18N_KEYS.DIALOG_BUTTON_CANCEL)} secondaryButtonOnClick={onClose}/>} title={translate(I18N_KEYS.DIALOG_TITLE)}>
      <div className={styles.text}>
        {translate.markup(I18N_KEYS.DIALOG_TEXT_MARKUP, {}, { linkTarget: '_blank' })}
      </div>

      <TextInput sx={{ resize: 'vertical', maxHeight: '300px' }} fullWidth ref={feedbackEl} multiline placeholder={translate(I18N_KEYS.DIALOG_TEXTAREA_LABEL)} onChange={_handleFeedbackFieldValueChange.bind(this)}/>

      {showError ? (<div className={styles.error}>
          {translate.markup(I18N_KEYS.DIALOG_ERROR_MARKUP)}
        </div>) : null}
    </SimpleDialog>);
};
export default Feedback;
