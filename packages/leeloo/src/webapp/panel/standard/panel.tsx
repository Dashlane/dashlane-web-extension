import classnames from 'classnames';
import CloseOnEscape from 'react-close-on-escape';
import { OutsideClickHandler } from 'libs/outside-click-handler/outside-click-handler';
import React, { useEffect } from 'react';
import styles from './styles.css';
interface Props {
    className?: string;
    ignoreClickOutsideClassName?: string;
    onNavigateOut: (event?: React.MouseEvent<HTMLElement>) => void;
    ignoreCloseOnEscape?: boolean;
}
const Panel = ({ children, className, ignoreClickOutsideClassName, ignoreCloseOnEscape, onNavigateOut, }: React.PropsWithChildren<Props>) => {
    const closeOnEscape = () => {
        if (ignoreCloseOnEscape) {
            return;
        }
        onNavigateOut();
    };
    const ANIMATION_DURATION_MS = 200;
    useEffect(() => {
        const postAnimationFocusTimer = setTimeout(() => {
            const asides = document.getElementsByTagName('aside');
            if (asides && asides[0]) {
                asides[0].focus();
            }
        }, ANIMATION_DURATION_MS);
        return () => {
            clearTimeout(postAnimationFocusTimer);
        };
    }, []);
    return (<OutsideClickHandler onOutsideClick={onNavigateOut} ignoredClassName={ignoreClickOutsideClassName}>
      <CloseOnEscape onEscape={closeOnEscape}>
        <aside className={classnames(styles.container, className)} tabIndex={-1}>
          {children}
        </aside>
      </CloseOnEscape>
    </OutsideClickHandler>);
};
export default Panel;
