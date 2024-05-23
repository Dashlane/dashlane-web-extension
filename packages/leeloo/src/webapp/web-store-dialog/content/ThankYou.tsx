import { useEffect } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { CardLayout } from '../layout/CardLayout';
import { jsx, Paragraph, ThemeUIStyleObject } from '@dashlane/ui-components';
const I18N_KEYS = {
    TITLE: 'webapp_web_store_dialog_thank_you_title',
    TEXT: 'webapp_web_store_dialog_thank_you_text',
};
interface FeedbackCardDialogProps {
    onClose: () => void;
}
const mainStyles: ThemeUIStyleObject = {
    padding: '16px',
};
export const ThankYou = ({ onClose }: FeedbackCardDialogProps) => {
    const { translate } = useTranslate();
    useEffect(() => {
        const timeoutId = setTimeout(onClose, 2000);
        return () => {
            clearTimeout(timeoutId);
        };
    });
    return (<CardLayout title={translate(I18N_KEYS.TITLE)} displayHeaderLogo onClose={onClose}>
      <div sx={mainStyles}>
        <Paragraph>{translate(I18N_KEYS.TEXT)}</Paragraph>
      </div>
    </CardLayout>);
};
