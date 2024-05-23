import * as React from 'react';
import Dialog, { AutoFocusAction } from 'components/dialog/dialog';
import { FocusOn } from 'react-focus-on';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import dialogTransition from 'components/dialog/dialog-transition.css';
interface Props {
    autoFocusAction?: AutoFocusAction;
    visible: boolean;
    confirmLabel: string;
    cancelLabel?: string;
    onCancel?: () => void;
    onConfirm: (event: React.FormEvent<HTMLElement>) => void;
    isConfirmDisabled?: boolean;
    cancelOnOutsideClick?: boolean;
}
type DialogContainerProps = React.PropsWithChildren<Props>;
const DialogContainer: React.FC<DialogContainerProps> = ({ autoFocusAction, children, onCancel, cancelLabel, confirmLabel, onConfirm, isConfirmDisabled, visible: displayDialog, cancelOnOutsideClick = true, }) => {
    const dialogRoot = document.getElementById('dialog');
    const onCancelHandler = React.useCallback(() => {
        onCancel && onCancel();
    }, [onCancel]);
    const [isDialogVisible, setDialogVisible] = React.useState(false);
    const removeDialog = React.useCallback(() => {
        setDialogVisible(false);
    }, []);
    React.useEffect(() => {
        setDialogVisible(displayDialog);
    }, [displayDialog]);
    if (!dialogRoot || !isDialogVisible) {
        return null;
    }
    return createPortal(<CSSTransition in={displayDialog} timeout={100} classNames={{
            enter: dialogTransition.enter,
            appear: dialogTransition.appear,
            appearActive: dialogTransition.appearActive,
            enterActive: dialogTransition.enterActive,
            exit: dialogTransition.exit,
            exitActive: dialogTransition.exitActive,
        }} onExited={removeDialog} appear>
      <FocusOn>
        <Dialog confirmLabel={confirmLabel} onConfirm={onConfirm} autoFocusAction={autoFocusAction} cancelLabel={cancelLabel} onCancel={onCancelHandler} isConfirmDisabled={isConfirmDisabled} cancelOnOutsideClick={cancelOnOutsideClick}>
          {children}
        </Dialog>
      </FocusOn>
    </CSSTransition>, dialogRoot);
};
export default React.memo(DialogContainer);
