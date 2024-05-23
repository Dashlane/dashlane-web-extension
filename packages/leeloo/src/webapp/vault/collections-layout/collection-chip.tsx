import { jsx, Tag } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
interface Props {
    children: string;
    isShared?: boolean;
    onDismiss?: (event: React.MouseEvent<HTMLElement>) => void;
}
export const CollectionChip = ({ children, onDismiss, isShared = false, }: Props) => {
    const { translate } = useTranslate();
    const I18N_KEYS = {
        CLOSE_ICON_TITLE: 'webapp_collections_actions_delete_tooltip',
    };
    return (<Tag label={children} trailingIcon={isShared ? 'SharedOutlined' : undefined} onDismiss={onDismiss} isDismissible={onDismiss !== undefined} dismissActionLabel={translate(I18N_KEYS.CLOSE_ICON_TITLE)}/>);
};
