import classNames from 'classnames';
import { PropsWithChildren, ReactNode } from 'react';
import { Dialog, DialogBody, jsx } from '@dashlane/ui-components';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialogHeader } from './simple-dialog-header';
interface Props {
    className?: string;
    showCloseIcon?: boolean;
    disableOutsideClickClose?: boolean;
    disableBackgroundPanelClose?: boolean;
    isOpen: boolean;
    onRequestClose: () => void;
    title?: ReactNode;
    footer?: ReactNode;
    replaceDialogBody?: boolean;
}
export const SimpleDialog = (props: PropsWithChildren<Props>) => {
    const contentClassName = classNames(props.className, {
        [allIgnoreClickOutsideClassName]: props.disableBackgroundPanelClose,
    });
    const { translate } = useTranslate();
    return (<Dialog modalContentClassName={contentClassName} disableScrolling={false} closeIconName={props.showCloseIcon
            ? translate('_common_dialog_dismiss_button')
            : undefined} isOpen={props.isOpen} onClose={props.onRequestClose} disableOutsideClickClose={props.disableOutsideClickClose}>
      {typeof props.title === 'string' ? (<SimpleDialogHeader>{props.title}</SimpleDialogHeader>) : null}
      {props.title && typeof props.title !== 'string' ? props.title : null}
      {props.children ? (props.replaceDialogBody ? (props.children) : (<DialogBody>{props.children}</DialogBody>)) : null}
      {props.footer}
    </Dialog>);
};
