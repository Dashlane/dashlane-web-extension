import { useState } from 'react';
import { Heading, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { AlertSeverity, DialogFooter, FlexContainer, } from '@dashlane/ui-components';
import { addNotification, removeNotification, } from 'libs/notifications/actions';
import { checkDirectorySyncKeyResponse } from 'libs/carbon/triggers';
import { hideDialogAction, keyValidationPostponedAction, terminateRequestAction, } from './reducer';
import { Lee } from 'app/createElement/makeLee';
import useTranslate from 'libs/i18n/useTranslate';
import { KeyInputStep } from './dialog-steps/key-input-step';
import { StepDialogWithTitle } from './dialog-steps/step-dialog-with-title';
enum Step {
    Initial,
    KeyInput,
    KeySuccess,
    KeyError,
    KeySuspended
}
interface Props {
    lee: Lee;
}
const I18N_KEYS = {
    INITIAL_CONTINUE: 'team_directory_sync_key_dialog_initial_continue',
    INITIAL_POSTPONE: 'team_directory_sync_key_dialog_initial_postpone',
    INITIAL_MESSAGE_MARKUP: 'team_directory_sync_key_dialog_initial_message_markup',
    KEY_SUCCESS_CLOSE: 'team_directory_sync_key_dialog_key_success_close',
    KEY_SUCCESS_HEADER: 'team_directory_sync_key_dialog_key_success_header',
    KEY_SUCCESS_MESSAGE: 'team_directory_sync_key_dialog_key_success_message',
    KEY_ERROR_VALIDATE: 'team_directory_sync_key_dialog_key_error_validate',
    KEY_ERROR_RETRY: 'team_directory_sync_key_dialog_key_error_retry',
    KEY_ERROR_HEADER: 'team_directory_sync_key_dialog_key_error_header',
    KEY_ERROR_MESSAGE: 'team_directory_sync_key_dialog_key_error_message',
    KEY_SUSPENDED_CLOSE: 'team_directory_sync_key_dialog_key_suspended_close',
    KEY_SUSPENDED_MESSAGE_MARKUP: 'team_directory_sync_key_dialog_key_suspended_message_markup',
};
export const DirectorySyncKeyDialog = (props: Props) => {
    const { translate } = useTranslate();
    const [uiStep, setUIStep] = useState<Step>(Step.Initial);
    const checkDirectorySyncKeyRequest = () => props.lee.globalState.directorySyncKey.checkDirectorySyncKeyRequest;
    const rejectKey = () => {
        const params = checkDirectorySyncKeyRequest();
        if (!params) {
            return Promise.reject(new Error('missing params'));
        }
        return checkDirectorySyncKeyResponse(params, 'rejected');
    };
    const postponeValidation = () => {
        props.lee.dispatchGlobal(keyValidationPostponedAction());
    };
    const hideDialog = () => {
        props.lee.dispatchGlobal(hideDialogAction());
    };
    const terminateRequest = () => {
        props.lee.dispatchGlobal(terminateRequestAction());
    };
    const handleError = () => {
        const key = 'directorySyncKeyValidationError';
        const handleClose = () => props.lee.dispatchGlobal(removeNotification(key));
        const level = AlertSeverity.ERROR;
        const textKey = 'team_directory_sync_key_error_markup';
        const errorNotification = { key, level, textKey, handleClose };
        props.lee.dispatchGlobal(addNotification(errorNotification));
        hideDialog();
    };
    const goToKeyInputStep = () => {
        setUIStep(Step.KeyInput);
    };
    const goToKeySuccessStep = () => {
        setUIStep(Step.KeySuccess);
    };
    const goToKeyErrorStep = () => {
        setUIStep(Step.KeyError);
    };
    const goToKeySuspendedStep = () => {
        setUIStep(Step.KeySuspended);
    };
    const handleConfirmPastedLatestKey = () => {
        rejectKey()
            .then(() => {
            goToKeySuspendedStep();
            terminateRequest();
        })
            .catch(handleError);
    };
    const renderInitialStep = () => {
        return (<StepDialogWithTitle onRequestClose={postponeValidation} footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.INITIAL_CONTINUE)} primaryButtonOnClick={goToKeyInputStep} secondaryButtonTitle={translate(I18N_KEYS.INITIAL_POSTPONE)} secondaryButtonOnClick={postponeValidation} intent="primary"/>}>
        <Paragraph color="ds.text.neutral.quiet">
          {translate.markup(I18N_KEYS.INITIAL_MESSAGE_MARKUP)}
        </Paragraph>
      </StepDialogWithTitle>);
    };
    const onSubmitKeySuccess = () => {
        goToKeySuccessStep();
        terminateRequest();
    };
    const onSubmitKeyError = () => {
        goToKeyErrorStep();
    };
    const renderKeyInputStep = () => {
        return (<KeyInputStep onSubmitKeySuccess={onSubmitKeySuccess} onSubmitKeyError={onSubmitKeyError} checkDirectorySyncKeyRequest={checkDirectorySyncKeyRequest} handleDismiss={postponeValidation} handleError={handleError}/>);
    };
    const renderKeySuccessStep = () => {
        return (<StepDialogWithTitle onRequestClose={hideDialog} footer={<DialogFooter secondaryButtonTitle={translate(I18N_KEYS.KEY_SUCCESS_CLOSE)} secondaryButtonOnClick={hideDialog}/>}>
        <FlexContainer gap="8px">
          <Icon name="FeedbackSuccessOutlined" size="xlarge" color="ds.text.positive.quiet" sx={{ width: '64px', height: '64px' }}/>
          <div>
            <Heading as="h1">{translate(I18N_KEYS.KEY_SUCCESS_HEADER)}</Heading>
            <Paragraph>{translate(I18N_KEYS.KEY_SUCCESS_MESSAGE)}</Paragraph>
          </div>
        </FlexContainer>
      </StepDialogWithTitle>);
    };
    const renderKeyErrorStep = () => {
        return (<StepDialogWithTitle onRequestClose={hideDialog} footer={<DialogFooter primaryButtonTitle={translate(I18N_KEYS.KEY_ERROR_VALIDATE)} primaryButtonOnClick={handleConfirmPastedLatestKey} secondaryButtonTitle={translate(I18N_KEYS.KEY_ERROR_RETRY)} secondaryButtonOnClick={goToKeyInputStep} intent="danger"/>}>
        <FlexContainer gap="8px">
          <Icon name="FeedbackFailOutlined" size="xlarge" color="ds.text.danger.quiet" sx={{ width: '64px', height: '64px' }}/>
          <div>
            <Heading as="h1">{translate(I18N_KEYS.KEY_ERROR_HEADER)}</Heading>
            <Paragraph color="ds.text.neutral.quiet">
              {translate(I18N_KEYS.KEY_ERROR_MESSAGE)}
            </Paragraph>
          </div>
        </FlexContainer>
      </StepDialogWithTitle>);
    };
    const renderKeySuspendedStep = () => {
        return (<StepDialogWithTitle onRequestClose={hideDialog} footer={<DialogFooter secondaryButtonTitle={translate(I18N_KEYS.KEY_SUSPENDED_CLOSE)} secondaryButtonOnClick={hideDialog}/>}>
        <Paragraph color="ds.text.neutral.quiet">
          {translate.markup(I18N_KEYS.KEY_SUSPENDED_MESSAGE_MARKUP)}
        </Paragraph>
      </StepDialogWithTitle>);
    };
    switch (uiStep) {
        case Step.Initial:
            return renderInitialStep();
        case Step.KeyInput:
            return renderKeyInputStep();
        case Step.KeySuccess:
            return renderKeySuccessStep();
        case Step.KeyError:
            return renderKeyErrorStep();
        case Step.KeySuspended:
            return renderKeySuspendedStep();
    }
};
