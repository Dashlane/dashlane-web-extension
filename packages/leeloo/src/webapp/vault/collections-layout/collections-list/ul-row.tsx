import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import { LIST_ITEM_GAP } from '../collections-list-item';
export interface UlRowRef {
    ulElement: HTMLUListElement | null;
    getWidth: () => number;
    getListItemsWidths: () => number[];
}
interface Props {
    children: ReactNode;
    sx?: ThemeUIStyleObject;
}
export const UlRow = forwardRef<UlRowRef, Props>((props: Props, ref) => {
    const ulRef = useRef<HTMLUListElement>(null);
    const [maxHeight, setMaxHeight] = useState(0);
    const { children, sx, ...rest } = props;
    useEffect(() => {
        if (!ulRef.current) {
            return;
        }
        if (maxHeight !== ulRef.current.scrollHeight) {
            setMaxHeight(ulRef.current.scrollHeight);
        }
    }, [children]);
    useImperativeHandle(ref, () => ({
        ulElement: ulRef.current,
        getWidth: () => ulRef.current?.clientWidth ?? 0,
        getListItemsWidths: () => {
            if (!ulRef.current) {
                return [];
            }
            const listItemsWidths: number[] = [];
            for (const listItem of ulRef.current.children) {
                listItemsWidths.push(listItem.getBoundingClientRect().width + LIST_ITEM_GAP);
            }
            return listItemsWidths;
        },
    }));
    return (<ul ref={ulRef} sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: '1 1 100%',
            rowGap: '16px',
            maxHeight: `${maxHeight}px`,
            transition: 'all 200ms ease-out',
            overflow: 'hidden',
            ...sx,
        }} {...rest}>
      {children}
    </ul>);
});
