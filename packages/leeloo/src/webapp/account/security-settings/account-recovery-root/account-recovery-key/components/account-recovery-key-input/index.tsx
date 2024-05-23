import { ChangeEvent, Fragment } from 'react';
import classnames from 'classnames';
import ReactInputMask from 'react-input-mask';
import { jsx } from '@dashlane/design-system';
import { Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { RECOVERY_KEY_INPUT_MASK } from 'webapp/account/constants';
import styles from './styles.css';
const I18N_KEYS = {
    ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_LABEL: 'webapp_account_recovery_key_input_label',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_PLACEHOLDER: 'webapp_account_recovery_key_input_placeholder',
};
const overrideDefaultCopy = (stringToCopy: string) => {
    navigator.clipboard.writeText(stringToCopy.replaceAll(' ', ''));
};
interface Props {
    value: string;
    error?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string) => void;
}
interface MaskManagedProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const AccountRecoveryKeyInput = ({ value, error, onChange }: Props) => {
    const { translate } = useTranslate();
    const inputProps = {
        id: 'recovery-key-input',
        autoComplete: 'off',
        className: classnames(styles.input, {
            [styles.error]: Boolean(error),
        }),
        sx: {
            ...(error && {
                '::placeholder': {
                    color: 'ds.text.danger.quiet',
                },
                minWidth: 'fit-content',
            }),
            border: '1px solid',
            borderColor: error
                ? 'ds.border.danger.standard.idle'
                : 'ds.border.neutral.quiet.idle',
        },
        type: 'text',
        placeholder: translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_PLACEHOLDER),
    };
    const input = (<ReactInputMask maskChar="" mask={RECOVERY_KEY_INPUT_MASK} onCopy={() => overrideDefaultCopy(value)} onCut={() => overrideDefaultCopy(value)} onChange={onChange} value={value}>
      {(otherInputProps: MaskManagedProps) => (<input {...inputProps} {...otherInputProps}/>)}
    </ReactInputMask>);
    return (<>
      <Paragraph size="x-small" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
        {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_INPUT_LABEL)}
      </Paragraph>
      <div className={classnames(styles.container)}>{input}</div>
      {error ? (<Paragraph size="x-small" color="ds.text.danger.quiet">
          {error}
        </Paragraph>) : null}
    </>);
};
