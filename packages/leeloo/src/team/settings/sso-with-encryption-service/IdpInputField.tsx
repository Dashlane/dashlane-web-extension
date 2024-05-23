import { jsx, LoadingIcon, Paragraph } from '@dashlane/ui-components';
import { InputWithCopyButton } from 'libs/dashlane-style/text-input-with-action-button/input-with-copy-button';
export const IdpInputField = ({ inputValue, labelText, disabled, loading, id, }: {
    inputValue: string;
    labelText: string;
    disabled: boolean;
    loading: boolean;
    id: string;
}) => {
    return (<InputWithCopyButton inputValue={inputValue} textInputProps={{
            fullWidth: true,
            readOnly: true,
            disabled,
            id,
            startAdornment: loading ? (<LoadingIcon color="primaries.5"/>) : undefined,
            label: (<Paragraph as="label" bold sx={{ mb: '4px' }} htmlFor={id}>
            {labelText}
          </Paragraph>),
        }} iconButtonProps={{
            disabled,
        }}/>);
};
