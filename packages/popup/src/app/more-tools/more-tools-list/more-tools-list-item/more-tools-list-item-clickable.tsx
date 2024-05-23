import { jsx } from '@dashlane/design-system';
import { MouseEvent } from 'react';
import { ListItemContent, ListItemContentProps } from './list-item-content';
interface MoreToolsListItemProps extends ListItemContentProps {
    onClick: (event: MouseEvent<any>) => void;
    isWarning?: boolean;
}
export const MoreToolsListItemClickable = ({ onClick, isWarning, ...rest }: MoreToolsListItemProps) => (<li sx={{
        cursor: 'pointer',
        borderRadius: ' 4px',
        textDecoration: 'none',
        '> *': {
            padding: '16px',
        },
        backgroundColor: isWarning
            ? 'ds.container.expressive.danger.quiet.idle'
            : 'transparent',
        ':focus,:hover': {
            backgroundColor: isWarning
                ? 'ds.container.expressive.danger.quiet.hover'
                : 'ds.container.expressive.neutral.supershy.hover',
        },
        ':active': {
            backgroundColor: isWarning
                ? 'ds.container.expressive.danger.quiet.active'
                : 'ds.container.expressive.neutral.supershy.active',
        },
    }}>
    <a href="#" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
    }} sx={{
        display: 'flex',
        textDecoration: 'none',
    }}>
      <ListItemContent {...rest}/>
    </a>
  </li>);
