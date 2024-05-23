import { ChangeEventHandler, CSSProperties, FormEvent, KeyboardEvent, useEffect, useReducer, useRef, useState, } from 'react';
import classNames from 'classnames';
import { Button, ButtonIconLayout, jsx } from '@dashlane/design-system';
import { TextField } from 'libs/dashlane-style/text-field/text-field';
import { assertUnreachable } from 'libs/assert-unreachable';
import styles from './styles.css';
import colorVars from '../globals/color-variables.css';
interface Props {
    defaultValue?: string;
    saveBtnLabel: string;
    savingBtnLabel: string;
    editBtnLabel: string;
    isDisabled?: boolean;
    placeholder?: string;
    successMessage: string;
    onSave: (value?: string) => Promise<void | string>;
    onFocus?: () => void;
    onBlur?: () => void;
    multiLine?: boolean;
    inputStyle?: CSSProperties;
    hintStyle?: CSSProperties;
    textFieldClassName?: string;
    inputFieldClassName?: string;
    buttonClassName?: string;
    ariaLabelledBy?: string;
    layout?: ButtonIconLayout;
    icon?: JSX.Element;
}
enum FieldState {
    Pristine,
    Edit,
    Request
}
enum HintState {
    Default,
    Error,
    Success
}
type State = {
    fieldState: FieldState;
    hintState: HintState;
    hintText: string;
};
type Action = {
    type: 'reset';
} | {
    type: 'request';
} | {
    type: 'edit';
} | {
    type: 'success';
    data?: string;
} | {
    type: 'error';
    data: string;
};
const stateReducer = (prevState: State, action: Action) => {
    switch (action.type) {
        case 'reset':
            return {
                hintState: HintState.Default,
                fieldState: FieldState.Pristine,
                hintText: '',
            };
        case 'request':
            return {
                ...prevState,
                fieldState: FieldState.Request,
            };
        case 'edit':
            return {
                ...prevState,
                fieldState: FieldState.Edit,
            };
        case 'success':
            return {
                ...prevState,
                hintState: HintState.Success,
                fieldState: FieldState.Pristine,
                hintText: action.data,
            };
        case 'error':
            return {
                ...prevState,
                hintState: HintState.Error,
                fieldState: FieldState.Edit,
                hintText: action.data,
            };
        default:
            return prevState;
    }
};
const getButtonIconLayout = (fieldState: FieldState, propsLayout: ButtonIconLayout | undefined, propsIcon: JSX.Element | undefined): {
    layout: ButtonIconLayout;
    icon: JSX.Element | undefined;
} => {
    switch (fieldState) {
        case FieldState.Request:
            return { layout: 'labelOnly', icon: undefined };
        case FieldState.Edit:
            return { layout: 'labelOnly', icon: undefined };
        case FieldState.Pristine:
            return { layout: propsLayout ?? 'labelOnly', icon: propsIcon };
        default:
            return { layout: propsLayout ?? 'labelOnly', icon: propsIcon };
    }
};
export const FieldWithButton = ({ defaultValue, saveBtnLabel, savingBtnLabel, editBtnLabel, isDisabled, placeholder, successMessage, onSave, onFocus, onBlur, multiLine, inputStyle, hintStyle, textFieldClassName, inputFieldClassName, buttonClassName, ariaLabelledBy, layout, icon, }: Props) => {
    const [value, setValue] = useState(defaultValue);
    const [feedbackState, dispatchFeedback] = useReducer(stateReducer, {
        fieldState: FieldState.Pristine,
        hintState: HintState.Default,
        hintText: '',
    });
    const { fieldState, hintText, hintState } = feedbackState;
    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);
    const field = useRef<TextField>(null);
    const form = useRef<HTMLFormElement>(null);
    const isFieldButtonDisabled = isDisabled ||
        fieldState === FieldState.Request ||
        defaultValue === undefined;
    const getLabel = () => {
        switch (fieldState) {
            case FieldState.Request:
                return savingBtnLabel;
            case FieldState.Edit:
                return saveBtnLabel;
            case FieldState.Pristine:
                return editBtnLabel;
            default:
                return assertUnreachable(fieldState);
        }
    };
    const handleFieldFocused = () => {
        dispatchFeedback({ type: 'edit' });
        if (onFocus) {
            onFocus();
        }
    };
    const handleSubmit = async (event: FormEvent | MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (onBlur) {
            onBlur();
        }
        if (value !== defaultValue) {
            try {
                dispatchFeedback({ type: 'request' });
                await onSave(value);
                dispatchFeedback({ type: 'success', data: successMessage });
                setTimeout(() => dispatchFeedback({ type: 'reset' }), 500);
            }
            catch (e) {
                dispatchFeedback({ type: 'error', data: e.message });
                if (field.current) {
                    field.current.focus();
                }
            }
        }
        else {
            dispatchFeedback({ type: 'reset' });
        }
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            setValue(defaultValue);
            setTimeout(() => field.current?.blur(), 0);
        }
    };
    const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        setValue(event.currentTarget.value);
    };
    return (<form ref={form} onSubmit={handleSubmit} className={styles.container}>
      <div className={textFieldClassName || styles.textFieldColumn}>
        <TextField aria-labelledby={ariaLabelledBy} multiLine={multiLine} isDisabled={isFieldButtonDisabled} placeholder={placeholder} hintStyle={{
            ...hintStyle,
            ...(hintState === HintState.Default
                ? { color: colorVars['--grey-02'] }
                : {}),
        }} hintText={hintState === HintState.Default ? hintText : null} successText={hintState === HintState.Success ? hintText : null} errorText={hintState === HintState.Error ? hintText : null} onBlur={handleSubmit} onFocus={handleFieldFocused} onKeyDown={handleKeyDown} onChange={onChange} ref={field} inputStyle={{
            ...inputStyle,
        }} inputClassName={classNames(styles.inputField, inputFieldClassName)} value={value}/>
      </div>
      <div className={buttonClassName}>
        <Button mood="neutral" intensity="quiet" layout={getButtonIconLayout(fieldState, layout, icon).layout} icon={getButtonIconLayout(fieldState, layout, icon).icon} disabled={isFieldButtonDisabled} onClick={() => field.current && field.current.focus()}>
          {getLabel()}
        </Button>
      </div>
    </form>);
};
