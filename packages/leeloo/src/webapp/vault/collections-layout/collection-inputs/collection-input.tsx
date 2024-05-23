import React, { forwardRef, KeyboardEvent } from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { TextInput } from '@dashlane/design-system';
interface Props {
    id: string;
    input: string;
    setInput: (input: string) => void;
    onSubmit?: () => void;
}
const COLLECTION_MAX_CHARACTERS = 40;
export const CollectionInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { translate } = useTranslate();
    const { id, input, setInput, onSubmit } = props;
    const onInputChange = (value: string) => value.length <= COLLECTION_MAX_CHARACTERS && setInput(value);
    const handleEnterKeyPress = (event: KeyboardEvent<HTMLInputElement>, isKeyUp = true) => {
        if (!onSubmit) {
            return;
        }
        if (event.key !== 'Enter') {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        if (isKeyUp) {
            onSubmit();
        }
    };
    return (<TextInput ref={ref} id={id} value={input} onKeyUp={handleEnterKeyPress} onKeyDown={(event) => handleEnterKeyPress(event, false)} onChange={(event) => onInputChange(event.target.value)} placeholder={translate('webapp_collections_input_placeholder_add_new')} autoFocus/>);
});
CollectionInput.displayName = 'CollectionInput';
