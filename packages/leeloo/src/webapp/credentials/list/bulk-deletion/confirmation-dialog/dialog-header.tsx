import { Heading, jsx, Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
interface Props {
    amountToBeDeleted: number;
}
const I18N_KEYS = {
    DIALOG_TITLE: 'webapp_credentials_multiselect_delete_confirm_dialog_title',
    DIALOG_DESC: 'webapp_credentials_multiselect_delete_confirm_dialog_desc',
};
export const DialogHeader = ({ amountToBeDeleted }: Props) => {
    const { translate } = useTranslate();
    return (<header>
      <Heading size="small" sx={{ marginBottom: '14px' }}>
        {translate(I18N_KEYS.DIALOG_TITLE, {
            count: amountToBeDeleted,
        })}
      </Heading>
      <Paragraph color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.DIALOG_DESC)}
      </Paragraph>
    </header>);
};
