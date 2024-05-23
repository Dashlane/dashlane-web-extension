import { jsx } from '@dashlane/ui-components';
import { FocusEventHandler, forwardRef, KeyboardEvent, KeyboardEventHandler, Ref, useCallback, useEffect, useImperativeHandle, useRef, } from 'react';
interface InputFieldProps {
    className: string;
    onBlur: FocusEventHandler<HTMLDivElement>;
    onChange: (value: string) => void;
    onFocus: FocusEventHandler<HTMLDivElement>;
    onKeyDown: KeyboardEventHandler<HTMLDivElement>;
    onSubmit: (value: string) => void;
    placeholder?: string;
}
const SUBMIT_KEYS = ['Tab', ' ', ';', ','];
export interface InputFieldRef {
    focus: () => void;
    getOffsetTop: () => number;
    getOffsetLeft: () => number;
}
export const InputField = forwardRef<InputFieldRef, InputFieldProps>((props, ref: Ref<InputFieldRef>) => {
    const inputContainerRef = useRef<HTMLSpanElement>(null);
    const getUserInputFromDOM = useCallback(() => {
        return new Promise<string>((resolve) => {
            setImmediate(() => {
                const userInputText = inputContainerRef?.current?.innerText?.trim() ?? '';
                resolve(userInputText);
            });
        });
    }, []);
    useEffect(() => {
        const inputContainer = inputContainerRef?.current;
        if (!inputContainer) {
            return;
        }
        const pasteHandler = (e: ClipboardEvent) => {
            let pastedText;
            if (e.clipboardData?.getData) {
                pastedText = e.clipboardData.getData('text/plain');
                inputContainer.innerText = pastedText;
                props.onChange(pastedText);
                e.preventDefault();
            }
            setImmediate(() => {
                getUserInputFromDOM().then(props.onSubmit);
            });
        };
        inputContainer.addEventListener('paste', pasteHandler);
        return () => {
            inputContainer.removeEventListener('paste', pasteHandler);
        };
    }, [getUserInputFromDOM, props, props.onSubmit]);
    useImperativeHandle(ref, () => ({
        focus() {
            inputContainerRef?.current?.focus();
        },
        getOffsetTop() {
            return inputContainerRef?.current?.offsetTop ?? 0;
        },
        getOffsetLeft() {
            return inputContainerRef?.current?.offsetLeft ?? 0;
        },
    }));
    const handleKeyUpEvent = () => {
        getUserInputFromDOM().then(props.onChange);
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (SUBMIT_KEYS.includes(event.key) && inputContainerRef.current) {
            event.preventDefault();
            props.onSubmit(inputContainerRef.current.innerText);
        }
        props.onKeyDown(event);
    };
    return (<span placeholder={props.placeholder} ref={inputContainerRef} className={props.className} contentEditable={true} onKeyDown={handleKeyDown} onKeyUp={handleKeyUpEvent} onFocus={props.onFocus} onBlur={props.onBlur}/>);
});
