import { Heading, Icon, jsx } from '@dashlane/design-system';
import { Lee } from 'lee';
import useTranslate from 'libs/i18n/useTranslate';
import { FieldWithButton } from 'libs/dashlane-style/field-with-button';
import setupStyles from '../style/index.css';
export interface Props {
    lee: Lee;
    handleSave: (newName: string) => Promise<string>;
    defaultValue: string;
}
const I18N_KEYS = {
    HEADING: 'team_account_heading_team_name',
    SAVE_BTN_LABEL: 'team_account_name_save_label',
    SAVING_BTN_LABEL: 'team_account_name_saving_label',
    EDIT_BTN_LABEL: 'team_account_name_edit_label',
    PLACEHOLDER: 'team_account_name_add_your_team_name',
    SUCCESS_MESSAGE: 'team_account_name_add_your_team_success',
};
export const TeamName = ({ lee, handleSave, defaultValue }: Props) => {
    const { translate } = useTranslate();
    return (<div>
      <Heading color="ds.text.neutral.catchy" as="h2" textStyle="ds.title.section.medium" sx={{ mb: '1em' }}>
        {translate(I18N_KEYS.HEADING)}
      </Heading>
      {lee.permission.adminAccess.hasFullAccess ? (<div>
          <FieldWithButton defaultValue={defaultValue} saveBtnLabel={translate(I18N_KEYS.SAVE_BTN_LABEL)} savingBtnLabel={translate(I18N_KEYS.SAVING_BTN_LABEL)} editBtnLabel={translate(I18N_KEYS.EDIT_BTN_LABEL)} placeholder={translate(I18N_KEYS.PLACEHOLDER)} successMessage={translate(I18N_KEYS.SUCCESS_MESSAGE)} textFieldClassName={setupStyles.col1} buttonClassName={setupStyles.col2} onSave={handleSave} layout="iconLeading" icon={<Icon name="ActionEditOutlined"/>} inputStyle={{ fontSize: '15px' }}/>
        </div>) : (defaultValue)}
    </div>);
};
