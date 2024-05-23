import * as React from 'react';
import classnames from 'classnames';
import { colors, Paragraph } from '@dashlane/ui-components';
import FormActions, { FormActionsProps, } from 'app/login/FormWrapper/FormActions';
import styles from 'app/login/FormWrapper/styles.css';
interface BaseProps {
    title?: {
        text: string;
        labelId: string;
    };
    description?: string;
    handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}
interface DefaultActionsProps extends BaseProps {
    formActionsProps: FormActionsProps;
}
interface CustomActionsProps extends BaseProps {
    customActions: React.ReactNode;
}
type Props = CustomActionsProps | DefaultActionsProps;
const isDefaultActions = (actions: CustomActionsProps | DefaultActionsProps): actions is DefaultActionsProps => {
    return (actions as DefaultActionsProps).formActionsProps !== undefined;
};
const FormWrapper: React.FunctionComponent<React.PropsWithChildren<Props>> = (props: React.PropsWithChildren<Props>) => (<form className={styles.form} onSubmit={props.handleSubmit} noValidate>
    {props.title && (<h2 className={classnames(styles.title, {
            [styles.titleWithDescription]: props.description,
        })} id={props.title.labelId}>
        {props.title.text}
      </h2>)}
    {props.description ? (<Paragraph color={colors.dashGreen05} size="small" sx={{ mb: '32px', lineHeight: '20px' }}>
        {props.description}
      </Paragraph>) : null}
    <div className={styles.inputContainer}>{props.children}</div>
    {isDefaultActions(props) ? (<FormActions {...props.formActionsProps}/>) : (props.customActions)}
  </form>);
export default React.memo(FormWrapper);
