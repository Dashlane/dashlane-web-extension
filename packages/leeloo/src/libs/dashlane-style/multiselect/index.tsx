import { jsx } from '@dashlane/ui-components';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { InputField, InputFieldRef } from './input-field';
import styles from './styles.css';
import crossIcon from './cross.svg';
interface Item {
    text: string;
    icon: JSX.Element;
}
export interface MultiselectError extends Error {
    message: 'no_matching_proposal' | '';
}
interface MultiselectProps {
    autoFocus?: boolean;
    className?: string;
    dataSource: Item[];
    defaultValue?: string[];
    isItemValid?: (item: string) => boolean;
    getCurrentSelectionAvatar: (alias: string) => JSX.Element;
    onChange?: (selection: string[]) => void;
    onError: (error?: MultiselectError) => void;
    placeholder?: string;
}
const NB_MAX_SUGGESTIONS = 4;
export const Multiselect = (props: MultiselectProps) => {
    const inputField = useRef<InputFieldRef>(null);
    const mainContainer = useRef<HTMLDivElement>(null);
    const dropdownContainer = useRef<HTMLDivElement>(null);
    const [hasError, setHasError] = useState(false);
    const [candidateItemIndex, setCandidateItemIndex] = useState(0);
    const [hasFocus, setHasFocus] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [inputKey, setInputKey] = useState('empty');
    const [selectedItems, setSelectedItems] = useState(props.defaultValue ?? []);
    const [suggestionDropdownPosition, setSuggestionDropdownPosition] = useState({
        left: 0,
        top: 0,
    });
    const [userInput, setUserInput] = useState('');
    const userInputIsEmpty = () => userInput.length === 0;
    const shouldShowSuggestionDropdown = () => hasFocus && !userInputIsEmpty();
    const onMouseOver = () => {
        setHovered(true);
    };
    const monMouseOut = () => {
        setHovered(false);
    };
    useEffect(() => {
        const dropDownContainerRef = dropdownContainer.current;
        if (props.autoFocus && inputField.current) {
            inputField.current.focus();
        }
        if (dropdownContainer.current) {
            dropdownContainer.current.addEventListener('mouseover', onMouseOver);
            dropdownContainer.current.addEventListener('mouseout', monMouseOut);
        }
        return () => {
            if (dropDownContainerRef) {
                dropDownContainerRef.removeEventListener('mouseover', onMouseOver);
                dropDownContainerRef.removeEventListener('mouseout', monMouseOut);
            }
        };
    }, [props.autoFocus]);
    const handleClickOnMultiselect = (event?: React.MouseEvent<HTMLDivElement>) => {
        if (inputField.current) {
            inputField.current.focus();
        }
        if (event) {
            event.preventDefault();
        }
    };
    const updateSuggestionDropdownPosition = () => {
        if (!inputField.current || !mainContainer.current) {
            return;
        }
        const yOffset = 22;
        const xOffset = 2;
        const newDropdownPosition = {
            top: inputField.current.getOffsetTop() -
                mainContainer.current.scrollTop +
                yOffset,
            left: inputField.current.getOffsetLeft() -
                mainContainer.current.scrollLeft +
                xOffset,
        };
        if (newDropdownPosition.top !== suggestionDropdownPosition.top ||
            newDropdownPosition.left !== suggestionDropdownPosition.left) {
            setSuggestionDropdownPosition(newDropdownPosition);
        }
    };
    const deselectItem = (itemToDeselect: string) => {
        const newSelection = selectedItems.filter((item) => item !== itemToDeselect);
        if (props.onChange) {
            props.onChange(newSelection);
        }
        updateSuggestionDropdownPosition();
        setHovered(false);
        setSelectedItems(newSelection);
        return {
            hovered: false,
            selectedItems: newSelection,
        };
    };
    const handleDeselectItem = (event: React.MouseEvent<HTMLSpanElement>, item: string) => {
        event.stopPropagation();
        deselectItem(item);
    };
    const handleFocusOnInputContainer = () => {
        if (hasError) {
            props.onError();
        }
        setHasError(false);
        setHasFocus(true);
    };
    const handleBlurOnInputContainer = () => {
        setHasFocus(false);
        setCandidateItemIndex(0);
    };
    const selectItem = (itemText: string) => {
        if (!itemText) {
            props.onError(new Error('no_matching_proposal') as MultiselectError);
            setHasError(true);
            return;
        }
        if (props.isItemValid && !props.isItemValid(itemText)) {
            props.onError(new Error('item_is_not_valid') as MultiselectError);
            setHasError(true);
            return;
        }
        const newSelection = selectedItems.concat([itemText]);
        if (props.onChange) {
            props.onChange(newSelection);
        }
        setCandidateItemIndex(0);
        setHasFocus(true);
        setHovered(false);
        setInputKey(new Date().getTime().toString());
        setUserInput('');
        setSelectedItems(newSelection);
        if (inputField.current) {
            inputField.current.focus();
        }
    };
    const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement>, itemText: string) => {
        event.preventDefault();
        selectItem(itemText);
    };
    const getCandidates = () => {
        return props.dataSource.filter((item) => !selectedItems.includes(item.text));
    };
    const handleInputFieldSubmit = (value: string): void => {
        if (getCandidates().some((item) => item.text === value)) {
            selectItem(value);
            return;
        }
        return;
    };
    const getAvailableCandidates = () => {
        const currentUserInput: Item = {
            icon: props.getCurrentSelectionAvatar(userInput),
            text: userInput.trim(),
        };
        let userInputRegex: RegExp;
        try {
            userInputRegex = new RegExp(userInput);
        }
        catch (e) {
            return [currentUserInput];
        }
        return [currentUserInput].concat(getCandidates()
            .filter((item) => item.text.search(userInputRegex) !== -1)
            .slice(0, NB_MAX_SUGGESTIONS));
    };
    const getCurrentProposedValue = () => {
        const currentCandidate = getAvailableCandidates()[candidateItemIndex];
        return currentCandidate ? currentCandidate.text : '';
    };
    const handleKeyDownOnInputContainer = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const increment = event.key === 'ArrowDown' ? 1 : -1;
            const nbItemsInDropdown = getAvailableCandidates().length;
            let newCandidateItemIndex = (candidateItemIndex + increment) % nbItemsInDropdown;
            if (newCandidateItemIndex < 0) {
                newCandidateItemIndex = nbItemsInDropdown + newCandidateItemIndex;
            }
            setCandidateItemIndex(newCandidateItemIndex);
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (shouldShowSuggestionDropdown()) {
                selectItem(getCurrentProposedValue());
                return;
            }
        }
        if (event.key === 'Backspace') {
            if (!userInput) {
                event.preventDefault();
                deselectItem(selectedItems[selectedItems.length - 1]);
                return;
            }
        }
    };
    const handleInputFieldChange = (value: string): void => {
        const currentProposal = getCurrentProposedValue();
        if (value && value === currentProposal) {
            handleInputFieldSubmit(value);
            return;
        }
        setUserInput(value);
        handleClickOnMultiselect();
        updateSuggestionDropdownPosition();
    };
    return (<div style={{ position: 'relative' }}>
      <div className={classnames(styles.mainContainer, props.className, {
            [styles.focus]: hasFocus,
        })} ref={mainContainer} onMouseDown={handleClickOnMultiselect}>
        {selectedItems.map((item) => (<div key={item} className={styles.selectedItem}>
            <div className={styles.selectedItemContainer}>{item}</div>
            <span className={styles.deselectIcon} onClick={(event: React.MouseEvent<HTMLSpanElement>) => handleDeselectItem(event, item)}>
              <img src={crossIcon}/>
            </span>
          </div>))}
        <div className={styles.inputContainer}>
          <InputField placeholder={selectedItems.length ? undefined : props.placeholder} ref={inputField} key={inputKey} className={classnames({
            [styles.greyInputContainer]: !userInputIsEmpty(),
        })} onBlur={handleBlurOnInputContainer} onChange={handleInputFieldChange} onFocus={handleFocusOnInputContainer} onKeyDown={handleKeyDownOnInputContainer} onSubmit={handleInputFieldSubmit}/>
        </div>
      </div>
      <div ref={dropdownContainer}>
        {shouldShowSuggestionDropdown() && (<div key="dropdown" className={styles.dropdown} style={suggestionDropdownPosition}>
            {getAvailableCandidates().map((item, index) => (<div key={item.text} onMouseDown={(event) => handleSelectionClick(event, item.text)} className={classnames(styles.candidateItem, {
                    [styles.highlightedItem]: index === candidateItemIndex && !hovered,
                })}>
                {item.icon}
                {item.text}
              </div>))}
          </div>)}
      </div>
    </div>);
};
