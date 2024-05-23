import * as React from 'react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { IdFormFields } from 'webapp/ids/types';
import styles from './styles.css';
type BaseProps<FormFields> = {
    formId: string;
    formRef: (formInstance: FormikProps<FormFields> | null) => void;
    handleSubmit: (values: FormFields, actions: FormikHelpers<FormFields>) => void;
    initialValues: FormFields;
    children: (values: FormFields) => JSX.Element;
};
type AddProps<FormFields> = BaseProps<FormFields> & {
    variant: 'add';
};
type EditProps<FormFields> = BaseProps<FormFields> & {
    variant: 'edit';
};
type Props<FormFields> = AddProps<FormFields> | EditProps<FormFields>;
export function IdForm<FormFields extends IdFormFields>({ children, ...props }: Props<FormFields>) {
    const { formId, formRef, initialValues, handleSubmit } = props;
    return (<Formik<typeof initialValues> innerRef={formRef} initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values }) => (<Form autoComplete="off" className={styles.form} id={formId} noValidate={true}>
          {children(values)}
        </Form>)}
    </Formik>);
}
