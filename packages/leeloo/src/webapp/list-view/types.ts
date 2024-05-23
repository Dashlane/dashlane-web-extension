import { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { ThemeUIStyleObject } from '@dashlane/design-system';
import { OrderDir as sortOrderDir } from 'libs/sortHelper';
export type SortDirection = sortOrderDir;
export interface SortingOptions<FieldType = string> {
    field: FieldType;
    direction: SortDirection;
    logSubaction?: string;
}
export interface HeaderCell {
    key: string;
    sortable: boolean;
    content?: ReactNode;
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    logSubaction?: string;
    sxProps?: Partial<ThemeUIStyleObject>;
}
export interface MenuCell {
    key: string;
    content: string;
    handleOnClick?: MouseEventHandler<HTMLElement>;
}
export interface DataCell {
    key: string;
    content?: ReactNode;
    style?: CSSProperties;
    className?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    params?: any;
    sxProps?: Partial<ThemeUIStyleObject>;
}
export type Renderer = (...args: any[]) => ReactNode;
export interface RowItem {
    id: string;
    link: string;
    data: DataCell[];
    renderers?: {
        [k: string]: Renderer;
    };
    actions?: ReactNode;
}
