import * as React from 'react';
import { Button } from '@dashlane/ui-components';
import styles from 'app/login/FormWrapper/styles.css';
interface Props {
    primaryButtonText: string;
    onPrimaryButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const WebAuthnFormActions = (props: Props) => {
    return (<div className={styles.actionsContainer}>
      <Button type="button" onClick={props.onPrimaryButtonClick} className={styles.button} nature="primary" size="large" theme="dark">
        {props.primaryButtonText}
      </Button>
    </div>);
};
export default React.memo(WebAuthnFormActions);
