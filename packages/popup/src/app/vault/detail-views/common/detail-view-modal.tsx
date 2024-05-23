import { ReactNode } from 'react';
import { FocusOn } from 'react-focus-on';
import { jsx } from '@dashlane/design-system';
import { TOAST_PORTAL_ID } from 'src/app/constants';
import Modal from 'src/components/modal';
import styles from './detail-view-modal.css';
interface ModalProps {
    children: ReactNode;
    onClose: () => void;
    skipAnimation?: boolean;
}
export const DetailViewModal = ({ children, onClose, skipAnimation = false, }: ModalProps) => {
    const toastPortal = document.getElementById(TOAST_PORTAL_ID);
    return (<Modal visible onClose={onClose} className={styles.modal} sx={{
            float: 'right',
            '@keyframes grow': {
                '0%': {
                    maxWidth: '0',
                },
                '100%': {
                    maxWidth: '100%',
                },
            },
            animation: !skipAnimation && 'grow 250ms forwards',
        }}>
      <FocusOn sx={{ overflow: 'scroll' }} shards={toastPortal ? [toastPortal] : undefined}>
        {children}
      </FocusOn>
    </Modal>);
};
