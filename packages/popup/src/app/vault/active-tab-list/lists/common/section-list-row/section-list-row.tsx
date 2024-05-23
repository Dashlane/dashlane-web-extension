import * as React from 'react';
import styles from './styles.css';
import { Content } from './content';
export interface SectionRowProps {
    thumbnail: JSX.Element;
    title: string;
    onClick: () => void;
    itemSpaceId?: string;
    subtitle?: string;
    actions?: JSX.Element;
    onRowLeave?: React.MouseEventHandler;
    headerRef?: React.RefObject<HTMLElement>;
    containerRef?: React.RefObject<HTMLElement>;
}
export const SectionRow = ({ actions, onRowLeave, headerRef, containerRef, title, subtitle = '', onClick, ...rest }: SectionRowProps) => {
    const actionsRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.target === contentRef.current) {
            onClick();
            return;
        }
        if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) {
            return;
        }
        else {
            e.stopPropagation();
            e.preventDefault();
        }
        const actions = actionsRef.current?.querySelectorAll('button:not([disabled])');
        if (!actions?.length) {
            return;
        }
        const currentFocusedActionIndex = Array.from(actions).findIndex((action) => action.isSameNode(document.activeElement));
        if (currentFocusedActionIndex === 0 && e.key === 'ArrowLeft') {
            contentRef.current?.focus();
            return;
        }
        const nextActionIndex = currentFocusedActionIndex + (e.key === 'ArrowRight' ? 1 : -1);
        if (nextActionIndex < actions.length && nextActionIndex >= 0) {
            (actions[nextActionIndex] as HTMLElement).focus();
        }
    };
    const onFocus = React.useCallback((e: React.FocusEvent) => {
        const focusedItem = e.target;
        const header = headerRef?.current;
        const container = containerRef?.current;
        if (header && container) {
            const headerBottom = header.getBoundingClientRect().bottom;
            const itemTop = focusedItem.getBoundingClientRect().top;
            if (headerBottom > itemTop) {
                container.scrollBy({
                    top: -(headerBottom - itemTop),
                });
            }
        }
    }, [containerRef, headerRef]);
    return (<li className={styles.listItemRow} key={`${title}@${subtitle}`} onKeyDown={onKeyDown} onMouseLeave={onRowLeave} onFocus={onFocus}>
      <Content ref={contentRef} subtitle={subtitle} title={title} onClick={onClick} {...rest}/>
      {actions && (<div ref={actionsRef} className={styles.actionList}>
          {actions}
        </div>)}
    </li>);
};
