import * as React from 'react';
import { Button } from '@dashlane/ui-components';
import styles from 'components/dialog/styles.css';
export type AutoFocusAction = 'cancel' | 'confirm';
interface Props {
    autoFocusAction?: AutoFocusAction;
    confirmLabel: string;
    cancelLabel?: string;
    onCancel?: () => void;
    onConfirm: (event: React.FormEvent<HTMLElement>) => void;
    isConfirmDisabled?: boolean;
    cancelOnOutsideClick?: boolean;
}
type DialogProps = React.PropsWithChildren<Props>;
const Dialog: React.FC<DialogProps> = ({ autoFocusAction, children, confirmLabel, onConfirm, cancelLabel, onCancel, isConfirmDisabled, cancelOnOutsideClick, }) => {
    const dialogRef = React.useRef<HTMLDivElement>(null);
    return (<div className={styles.container}>
      <div className={styles.blackOverlay} onClick={() => cancelOnOutsideClick && onCancel?.()} data-testid="popup-component-dialog"/>
      <div className={styles.dialog} ref={dialogRef} role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        {children}
        <div className={styles.footer}>
          {cancelLabel ? (<Button size="small" type="button" nature="secondary" className={styles.firstButton} onClick={onCancel} autoFocus={autoFocusAction === 'cancel'}>
              {cancelLabel}
            </Button>) : null}
          <Button size="small" type="button" nature="primary" onClick={onConfirm} disabled={isConfirmDisabled} autoFocus={autoFocusAction === 'confirm'}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>);
};
export default React.memo(Dialog);
