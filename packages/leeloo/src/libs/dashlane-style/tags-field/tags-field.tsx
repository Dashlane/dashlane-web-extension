import { jsx } from '@dashlane/ui-components';
import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import classnames from 'classnames';
import { Tag } from './tag';
import loaderShield from './loader-shield.gif';
import styles from './styles.css';
const ADD_TAG_KEYS = new Set([',', ';', 'Enter', ' ', 'Tab']);
const CHAR_CODE_BACKSPACE = 8;
const REMOVE_TAG_KEYS = new Set([CHAR_CODE_BACKSPACE]);
export interface TagsFieldProps {
    tags: string[];
    isOverlayVisible: boolean;
    className?: string;
    placeholder?: string;
    closeClassName?: string;
    inputClassName?: string;
    setTags: (tags: string[]) => void;
    validate: (tag: string) => boolean;
    setIsOverlayVisible: (val: boolean) => void;
    formatToTags: (tags: string) => string[];
    onFirstChange?: () => void;
}
type InputRef = HTMLInputElement;
type InputRefKeyboardEvent = KeyboardEvent<InputRef>;
export const TagsField = (props: TagsFieldProps) => {
    const inputRef = useRef<InputRef | null>(null);
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [currentInputValue, setCurrentInputValue] = useState<string>('');
    const removeTag = (tag: string) => {
        return props.setTags(props.tags.filter((t) => t !== tag));
    };
    const addTags = (tags: string[]) => {
        return props.setTags([...props.tags, ...tags]);
    };
    const handleCloseClick = (tag: string) => removeTag(tag);
    const focusInput = () => {
        inputRef?.current?.focus();
    };
    const handleTagClick = (tag: string) => {
        setCurrentInputValue(tag);
        removeTag(tag);
        focusInput();
    };
    const getInputValue = (): string => {
        return currentInputValue;
    };
    const addRequest = () => {
        if (getInputValue().trim() !== '') {
            addTags([getInputValue().trim()]);
            setCurrentInputValue('');
        }
    };
    const removeRequest = () => {
        const lastTag = [...props.tags].pop();
        if (lastTag === undefined) {
            return;
        }
        setCurrentInputValue(lastTag);
        removeTag(lastTag);
    };
    const shouldAdd = (event: KeyboardEvent) => ADD_TAG_KEYS.has(event.key);
    const shouldRemove = (event: InputRefKeyboardEvent) => REMOVE_TAG_KEYS.has(event.keyCode) &&
        props.tags.length > 0 &&
        getInputValue().trim() === '';
    const handleKey = (event: InputRefKeyboardEvent) => {
        const shouldAddRequest = shouldAdd(event);
        const shouldRemoveRequest = shouldRemove(event);
        if (shouldAddRequest || shouldRemoveRequest) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (shouldAddRequest) {
            addRequest();
        }
        else if (shouldRemoveRequest) {
            removeRequest();
        }
    };
    const onChange = (event: ChangeEvent<InputRef>) => {
        const newVal = event.target.value;
        setCurrentInputValue(newVal);
        if (newVal.length === 0 && props.onFirstChange) {
            props.onFirstChange();
        }
    };
    const onFocus = () => setIsInputFocused(true);
    const onBlur = () => {
        addRequest();
        setIsInputFocused(false);
    };
    const onPaste = () => {
        props.setIsOverlayVisible(true);
        setImmediate(() => {
            const tags = props.formatToTags(getInputValue());
            props.setIsOverlayVisible(false);
            if (!tags.length || tags.some((v) => !props.validate(v))) {
                return;
            }
            addTags(tags);
            setCurrentInputValue('');
        });
    };
    const className = classnames(props.className || styles.tags, {
        [`${styles.focus}`]: isInputFocused,
    });
    const tagComponents = props.tags.map((tag) => {
        return (<Tag key={tag} value={tag} validate={props.validate} handleEdit={handleTagClick} handleRemove={handleCloseClick}/>);
    });
    return (<div className={className} onClick={focusInput}>
      <div sx={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
        }}>
        {tagComponents}

        <input type="text" ref={inputRef} className={styles.input} placeholder={props.placeholder} onKeyPress={handleKey} onKeyDown={handleKey} onChange={onChange} value={currentInputValue} onFocus={onFocus} onBlur={onBlur} autoFocus onPaste={onPaste}/>
      </div>
      <span sx={{
            display: 'block',
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            textAlign: 'center',
            backgroundImage: `url("${loaderShield}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundColor: 'hsl(0, 0%, 100%)',
            visibility: props.isOverlayVisible ? 'visible' : 'hidden',
        }}/>
    </div>);
};
