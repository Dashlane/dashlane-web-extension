import { PropsWithChildren } from 'react';
import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import styles from 'team/page/styles.css';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    CONTENT: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 48px',
    },
};
interface Props {
    header: JSX.Element;
}
export const ConsolePage = ({ header, children }: PropsWithChildren<Props>) => {
    return (<div className={styles.consolePage}>
      <div className={styles.consolePageHeader}>{header}</div>
      <div sx={SX_STYLES.CONTENT}>{children}</div>
    </div>);
};
