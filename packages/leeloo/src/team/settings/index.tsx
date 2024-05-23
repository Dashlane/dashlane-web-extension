import { ReactNode } from 'react';
import classnames from 'classnames';
import { DSStyleObject, Heading, jsx } from '@dashlane/design-system';
import { Loader } from '../components/loader';
import styles from './styles.css';
const SX_STYLES: Record<string, DSStyleObject> = {
    SETTINGS_PANEL: {
        display: 'inline-block',
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        padding: '32px',
        marginBottom: '10px',
        flex: '1',
        borderRadius: '8px',
    },
};
interface Props {
    secondaryContent?: ReactNode;
    children?: ReactNode;
    title?: string;
    isLoading?: boolean;
}
export const SettingsPage = ({ children, secondaryContent, title, isLoading = false, }: Props) => {
    return isLoading ? (<Loader scopedToPage={true}/>) : (<div className={classnames(styles.settingsPage, {
            [styles.withoutHeader]: !title,
        })}>
      <div className={styles.settingsContainer}>
        {title ? (<Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy" sx={{ marginBottom: '32px' }}>
            {title}
          </Heading>) : null}
        <div sx={SX_STYLES.SETTINGS_PANEL}>{children}</div>
        {secondaryContent}
      </div>
    </div>);
};
