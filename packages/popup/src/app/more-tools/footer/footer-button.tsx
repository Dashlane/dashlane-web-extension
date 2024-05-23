import { Button, Icon, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
interface FooterButtonProps {
    iconName: 'LockOutlined' | 'LogOutOutlined';
    text: string;
    onClick: () => void;
}
export const FooterButton = ({ iconName, text, onClick, }: FooterButtonProps) => {
    const { translate } = useTranslate();
    return (<Button type="button" mood="neutral" intensity="quiet" size="small" layout="iconLeading" icon={<Icon name={iconName} color="ds.text.neutral.standard"/>} onClick={onClick}>
      {translate(text)}
    </Button>);
};
