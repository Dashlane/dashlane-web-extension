import * as React from 'react';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import styles from './styles.css';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    DIALOG_TITLE: 'team_feedback_result_dialog_title',
    BODY_TITLE: 'team_feedback_result_body_title',
    BODY_TEXT: 'team_feedback_result_body_text',
};
interface Props {
    onDismiss: () => void;
}
const Feedback = ({ onDismiss }: Props): JSX.Element => {
    const { translate } = useTranslate();
    return (<div>
      <SimpleDialog isOpen onRequestClose={onDismiss} title={translate(I18N_KEYS.DIALOG_TITLE)}>
        <div className={styles.container}>
          <h1>{translate(I18N_KEYS.BODY_TITLE)}</h1>
          <p className={styles.text}>{translate(I18N_KEYS.BODY_TEXT)}</p>
        </div>
      </SimpleDialog>
    </div>);
};
export default Feedback;
