import { ReactNode } from 'react';
export type AppLink = {
    to: string;
    content: ReactNode;
    extraContent?: ReactNode;
    asAnchor?: boolean;
};
