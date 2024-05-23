import { Fragment, useEffect, useState } from 'react';
import { Field, FieldProps, Form, Formik, FormikProps, FormikValues, } from 'formik';
import { Button, Heading, jsx, Paragraph, TextInput, } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { teamVatApi } from '@dashlane/team-admin-contracts';
import { AlertSeverity, GridChild, GridContainer, Paragraph as UICompParagraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { ChangePlanCard } from '../../layout/change-plan-card';
import { validateEUVATNumber } from './validate-vat-number';
const I18N_KEYS = {
    ADD_VAT_DESCRIPTION: 'team_account_vat_number_add_description',
    ADD_VAT_NUMBER: 'team_account_vat_number_add_label',
    ADD_VAT_NUMBER_SUCCESS: 'team_account_vat_number_add_success',
    CANCEL: '_common_action_cancel',
    DELETE: 'team_account_delete_label',
    DELETE_VAT_NUMBER_SUCCESS: 'team_account_vat_number_delete_success_alert',
    EDIT: 'team_account_name_edit_label',
    SAVE: 'team_settings_button_save_label',
    SAVING: 'team_account_name_saving_label',
    UPDATE_VAT_NUMBER_SUCCESS: 'team_account_vat_number_update_success',
    VAT_NUMBER: 'team_account_vat_number',
    VAT_NUMBER_INVALID: 'team_account_vat_number_invalid',
};
enum AddUpdateState {
    ADD,
    UPDATE
}
enum FormMode {
    INITIAL_VIEW = 'initialView',
    EDIT = 'edit',
    SAVE = 'save',
    SAVING = 'saving'
}
type CancelButtonState = 'cancel' | 'delete';
interface FormFields {
    vatNumber: string;
}
const VatNumberForm = ({ isInAccountSummary, }: {
    isInAccountSummary: boolean;
}) => {
    const { translate } = useTranslate();
    const [vatNumber, setVatNumber] = useState('');
    const [cancelButtonState, setCancelButtonState] = useState<CancelButtonState>('cancel');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [addUpdateStatus, setAddUpdateStatus] = useState<AddUpdateState>(AddUpdateState.ADD);
    const [formView, setFormView] = useState<FormMode>(FormMode.INITIAL_VIEW);
    const alert = useAlert();
    const { deleteTeamVat, getTeamVat, upsertTeamVat } = useModuleCommands(teamVatApi);
    useEffect(() => {
        const getVatNumber = async () => {
            const result: {
                [key: string]: any;
            } = await getTeamVat();
            if (result.tag === 'success') {
                setVatNumber(result.data?.vatNumber);
                setCancelButtonState('delete');
                setFormView(FormMode.EDIT);
            }
            else {
                setFormView(FormMode.INITIAL_VIEW);
            }
        };
        getVatNumber();
    }, [getTeamVat]);
    const handleEdit = () => {
        setShowSuccessMessage(false);
        setFormView(FormMode.SAVE);
        setAddUpdateStatus(AddUpdateState.UPDATE);
    };
    const handleSubmit = async (values: FormikValues) => {
        setFormView(FormMode.SAVING);
        const result = await upsertTeamVat({
            newVATNumber: values.vatNumber,
        });
        if (result.tag === 'success') {
            setVatNumber(values.vatNumber);
            setShowSuccessMessage(true);
            setFormView(FormMode.EDIT);
            setCancelButtonState('delete');
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 2000);
        }
    };
    const setToDefaultFormState = () => {
        setVatNumber('');
        setFormView(FormMode.INITIAL_VIEW);
        setCancelButtonState('cancel');
        setAddUpdateStatus(AddUpdateState.ADD);
    };
    const handleDelete = async () => {
        const result = await deleteTeamVat();
        if (result.tag === 'success') {
            setToDefaultFormState();
            alert.showAlert(translate(I18N_KEYS.DELETE_VAT_NUMBER_SUCCESS), AlertSeverity.SUCCESS);
        }
    };
    const addVatNumber = () => {
        setFormView(FormMode.SAVE);
    };
    const validateVatNumber = (value: FormFields['vatNumber']) => {
        if (value && !validateEUVATNumber(value)) {
            return translate(I18N_KEYS.VAT_NUMBER_INVALID);
        }
        return null;
    };
    const handleOnChange = () => {
        if (formView === FormMode.EDIT) {
            setFormView(FormMode.SAVE);
            setShowSuccessMessage(false);
        }
    };
    const DEFAULT_FORM_VALUES: FormFields = { vatNumber };
    const successMessageCopy = addUpdateStatus === AddUpdateState.ADD
        ? I18N_KEYS.ADD_VAT_NUMBER_SUCCESS
        : I18N_KEYS.UPDATE_VAT_NUMBER_SUCCESS;
    return (<>
      {vatNumber === '' &&
            (isInAccountSummary ? (<Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular">
            {translate(I18N_KEYS.ADD_VAT_DESCRIPTION)}
          </Paragraph>) : (<UICompParagraph color="ds.text.neutral.quiet" size="medium">
            {translate(I18N_KEYS.ADD_VAT_DESCRIPTION)}
          </UICompParagraph>))}
      {formView === FormMode.INITIAL_VIEW ? (<div sx={{ marginTop: '16px' }}>
          <Button mood="neutral" intensity="quiet" icon="ActionAddOutlined" layout="iconLeading" onClick={addVatNumber}>
            {translate(I18N_KEYS.ADD_VAT_NUMBER)}
          </Button>
        </div>) : (<div sx={{ marginTop: '16px' }}>
          <Formik initialValues={DEFAULT_FORM_VALUES} onSubmit={formView === FormMode.SAVE
                ? handleSubmit
                : formView === FormMode.EDIT
                    ? handleEdit
                    : () => { }}>
            {({ errors, resetForm, touched, values, }: FormikProps<typeof DEFAULT_FORM_VALUES>) => (<Form>
                <GridContainer gap="16px" gridTemplateColumns={'2fr 0.25fr 1fr'}>
                  <GridChild gridColumn={'1 / 2'}>
                    <Field name="vatNumber" validate={validateVatNumber}>
                      {({ field: { onChange, ...restField } }: FieldProps) => (<TextInput label={translate(I18N_KEYS.VAT_NUMBER)} disabled={formView === FormMode.EDIT} onChange={(v) => {
                        onChange(v);
                        handleOnChange();
                    }} {...restField} sx={{ input: { textTransform: 'uppercase' } }}/>)}
                    </Field>
                    {errors.vatNumber && touched.vatNumber && (<UICompParagraph color="ds.text.danger.quiet" size="x-small">
                        {errors.vatNumber}
                      </UICompParagraph>)}
                  </GridChild>
                  <GridChild gridColumn={'2 / 3'} sx={{ marginTop: '16px' }}>
                    {formView === FormMode.SAVING ? (<Button intensity="catchy" layout="labelOnly" disabled type="submit">
                        {translate(I18N_KEYS.SAVING)}
                      </Button>) : formView === FormMode.SAVE ? (<Button intensity="catchy" layout="labelOnly" disabled={values.vatNumber === ''} type="submit">
                        {translate(I18N_KEYS.SAVE)}
                      </Button>) : (<Button mood="neutral" intensity="quiet" icon="ActionEditOutlined" layout="iconLeading" disabled={values.vatNumber === ''} type="submit">
                        {translate(I18N_KEYS.EDIT)}
                      </Button>)}
                  </GridChild>
                  <GridChild gridColumn={'3 / 4'} sx={{ marginTop: '16px' }}>
                    {cancelButtonState === 'cancel' ? (<Button mood="neutral" intensity="quiet" layout="labelOnly" disabled={formView === FormMode.SAVING} onClick={() => setFormView(FormMode.INITIAL_VIEW)}>
                        {translate(I18N_KEYS.CANCEL)}
                      </Button>) : (<Button mood="neutral" intensity="quiet" icon="ActionDeleteOutlined" layout="iconLeading" disabled={formView === FormMode.SAVING} onClick={() => {
                        resetForm({ values: DEFAULT_FORM_VALUES });
                        handleDelete();
                    }}>
                        {translate(I18N_KEYS.DELETE)}
                      </Button>)}
                  </GridChild>
                </GridContainer>
              </Form>)}
          </Formik>
        </div>)}
      {showSuccessMessage && (<UICompParagraph color="ds.text.positive.quiet" size="x-small">
          {translate(successMessageCopy)}
        </UICompParagraph>)}
    </>);
};
export const VatNumber = ({ isInAccountSummary, }: {
    isInAccountSummary: boolean;
}) => {
    const { translate } = useTranslate();
    return (<div>
      {isInAccountSummary ? (<div sx={{ marginTop: '24px' }}>
          <Heading color="ds.text.neutral.catchy" as="h2" textStyle="ds.title.section.medium">
            {translate(I18N_KEYS.VAT_NUMBER)}
          </Heading>
          <div sx={{ marginTop: '16px' }}>
            <VatNumberForm isInAccountSummary={isInAccountSummary}/>
          </div>
        </div>) : (<ChangePlanCard title={translate(I18N_KEYS.VAT_NUMBER)}>
          <div sx={{ marginTop: '16px' }}>
            <VatNumberForm isInAccountSummary={isInAccountSummary}/>
          </div>
        </ChangePlanCard>)}
    </div>);
};
