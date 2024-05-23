import { ReactNode } from 'react';
import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import { BackIcon, EditIcon } from '@dashlane/ui-components';
import useTranslate from 'src/libs/i18n/useTranslate';
import styles from './header.css';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    HEADER_CONTAINER: {
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        padding: '24px',
        color: 'ds.text.neutral.catchy',
        backgroundColor: 'ds.container.agnostic.neutral.quiet',
    },
};
interface HeaderProps {
    Icon?: ReactNode;
    title?: string;
    onEdit: () => void;
    onClose: () => void;
}
const I18N_KEYS = {
    CLOSE: 'tab/all_items/credential/view/action/close',
    EDIT: 'tab/all_items/credential/view/action/edit',
};
export const Header = ({ Icon, title, onEdit, onClose }: HeaderProps) => {
    const { translate } = useTranslate();
    return (<header sx={SX_STYLES.HEADER_CONTAINER}>
      <button className={styles.action} onClick={onClose} aria-label={translate(I18N_KEYS.CLOSE)}>
        <BackIcon color="ds.text.neutral.standard"/>
      </button>
      <div className={styles.contentColumn} role="heading" aria-level={1}>
        {Icon && Icon}
        {title && <span className={styles.title}>{title}</span>}
      </div>
      <a href="#" className={styles.action} onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onEdit();
        }} aria-label={translate(I18N_KEYS.EDIT)}>
        <EditIcon color="ds.text.neutral.standard"/>
      </a>
    </header>);
};
