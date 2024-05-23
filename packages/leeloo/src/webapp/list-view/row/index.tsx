import { createRef, CSSProperties, MouseEvent, PropsWithChildren, ReactNode, useCallback, useEffect, useMemo, } from 'react';
import { jsx, mergeSx } from '@dashlane/design-system';
import { Link } from 'libs/router';
import { editPanelIgnoreClickOutsideClassName } from 'webapp/variables';
import { DataCell, Renderer } from 'webapp/list-view/types';
import { SX_STYLES } from '../styles';
export interface RowLinkProps extends PropsBase {
    type: 'link';
    link: string;
}
export interface RowDataProps extends PropsBase {
    type?: undefined;
}
interface PropsBase {
    data: DataCell[];
    renderers?: {
        [k: string]: Renderer;
    };
    actions?: ReactNode;
    selected?: boolean;
    checkable?: ReactNode;
    style?: CSSProperties;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
}
const RowLink = ({ children, link }: PropsWithChildren<{
    link: string;
}>) => (<Link sx={mergeSx([
        SX_STYLES.BORDER,
        SX_STYLES.CELLS_WRAPPER,
        { textDecoration: 'none' },
    ])} to={link}>
    {children}
  </Link>);
const RowClick = ({ handleClick, onClick, children, }: PropsWithChildren<{
    handleClick: (e: MouseEvent<HTMLElement>) => void;
    onClick: PropsBase['onClick'];
}>) => (<div onClick={handleClick} sx={mergeSx([
        onClick ? { cursor: 'pointer' } : {},
        SX_STYLES.BORDER,
        SX_STYLES.CELLS_WRAPPER,
    ])}>
    {children}
  </div>);
const Row = ({ style, selected, actions, onClick, renderers, data, checkable, ...rest }: RowLinkProps | RowDataProps) => {
    const row = createRef<HTMLLIElement>();
    const isElementInViewport = useMemo(() => {
        const el = row.current;
        if (!el) {
            return false;
        }
        const rect = el.getBoundingClientRect();
        const parentRect = (el.parentNode as HTMLElement).getBoundingClientRect();
        return (rect.top >= parentRect.top &&
            rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight));
    }, [row]);
    const ensureVisible = useCallback(() => {
        if (selected && row.current && !isElementInViewport) {
            row.current?.scrollIntoView({
                block: 'start',
                inline: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [isElementInViewport, row, selected]);
    useEffect(() => ensureVisible(), [ensureVisible]);
    const handleClick = (e: MouseEvent<HTMLElement>) => onClick ? onClick(e) : undefined;
    const getCellContent = (cell: DataCell) => renderers?.[cell.key]
        ? renderers[cell.key].apply(null, cell.params)
        : cell.content;
    const rowStyle = useMemo(() => {
        const defaultStyle = {
            '&:hover': {
                backgroundColor: 'ds.container.expressive.neutral.supershy.hover',
                transition: 'unset',
            },
            transition: 'ease-out background-color 0.2s',
        };
        return mergeSx([
            SX_STYLES.ROW,
            selected ? SX_STYLES.SELECTED : defaultStyle,
        ]);
    }, [selected]);
    return (<li ref={row} style={style} className={editPanelIgnoreClickOutsideClassName} sx={rowStyle}>
      {checkable ?? null}
      {rest.type === 'link' ? (<RowLink link={rest.link}>
          {data.map((cell) => (<div onClick={handleClick} tabIndex={0} key={cell.key} sx={mergeSx([SX_STYLES.CELL, cell.sxProps ?? {}])} className={cell.className}>
              {getCellContent(cell)}
            </div>))}
        </RowLink>) : (<RowClick handleClick={handleClick} onClick={onClick}>
          {data.map((cell) => (<div tabIndex={0} key={cell.key} sx={mergeSx([SX_STYLES.CELL, cell.sxProps ?? {}])} className={cell.className}>
              {getCellContent(cell)}
            </div>))}
        </RowClick>)}
      {actions ? (<div sx={mergeSx([
                {
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '100%',
                },
                SX_STYLES.BORDER,
            ])}>
          {actions}
        </div>) : null}
    </li>);
};
export default Row;
