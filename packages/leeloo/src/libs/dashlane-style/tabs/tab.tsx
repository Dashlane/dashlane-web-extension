import * as React from 'react';
import { jsx, mergeSx, ThemeUIStyleObject } from '@dashlane/design-system';
export interface Props {
    active: boolean;
    label: string;
    onClick: () => void;
    tabIconElement?: JSX.Element;
}
const rootTabStyle: ThemeUIStyleObject = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    cssFloat: 'left',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '14px',
    height: '100%',
    minHeight: '24px',
    textTransform: 'uppercase',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    borderBottomWidth: '3px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
};
const inactiveTabStyle: ThemeUIStyleObject = {
    color: 'ds.text.neutral.standard',
    '&:hover': {
        borderBottomColor: 'ds.border.neutral.standard.active',
    },
};
const activeTabStyle: ThemeUIStyleObject = {
    color: 'ds.text.brand.standard',
    borderBottomColor: 'ds.border.brand.standard.active',
};
export const Tab = (props: Props) => {
    const { active, label, onClick, tabIconElement } = props;
    const onKeyPress: React.KeyboardEventHandler = (evt) => {
        if (['Enter', ' '].includes(evt.key)) {
            return onClick();
        }
    };
    const tabStyle = mergeSx([
        rootTabStyle,
        active ? activeTabStyle : inactiveTabStyle,
    ]);
    return (<li onClick={onClick} sx={tabStyle} tabIndex={0} onKeyPress={onKeyPress} role="tab" aria-selected={active}>
      <span>{label}</span>
      {tabIconElement}
    </li>);
};
