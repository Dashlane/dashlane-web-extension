import * as React from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import { DSCSSObject } from "@dashlane/design-system/jsx-runtime";
import { IdFormFields } from "../types";
const FORM_STYLE: DSCSSObject = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflow: "auto",
  gap: "16px",
  padding: "24px",
};
type BaseProps<FormFields> = {
  formId: string;
  formRef: (formInstance: FormikProps<FormFields> | null) => void;
  handleSubmit: (
    values: FormFields,
    actions: FormikHelpers<FormFields>
  ) => void;
  initialValues: FormFields;
  children: (values: FormFields) => JSX.Element;
};
type AddProps<FormFields> = BaseProps<FormFields> & {
  variant: "add";
};
type EditProps<FormFields> = BaseProps<FormFields> & {
  variant: "edit";
};
type Props<FormFields> = AddProps<FormFields> | EditProps<FormFields>;
export function IdForm<FormFields extends IdFormFields>({
  children,
  ...props
}: Props<FormFields>) {
  const { formId, formRef, initialValues, handleSubmit } = props;
  return (
    <Formik<typeof initialValues>
      innerRef={formRef}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form autoComplete="off" id={formId} noValidate={true} sx={FORM_STYLE}>
          {children(values)}
        </Form>
      )}
    </Formik>
  );
}
