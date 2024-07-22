import * as React from "react";
import { Icon, jsx, mergeSx } from "@dashlane/design-system";
import { KEYBOARD_EVENTS } from "../../../constants";
import { Space } from "./Space";
import { SX_STYLES } from "./Combobox.styles";
export interface OptionProps {
  key: string | number;
  id: string;
  value: string;
}
export interface Props {
  focusOnMount?: boolean;
  dropdownElementsToDisplay?: number;
  id: string;
  isReadOnly?: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: OptionProps) => void;
  options: OptionProps[];
  canAddNewValue?: boolean;
  isErrored?: boolean;
  letter?: string;
  color?: string;
  name?: string;
  boldEmailDomains?: boolean;
  required?: boolean;
}
const DEFAULT_ELEMENT_HEIGHT = 35;
const DROPDOWN_ELEMENTS_TO_DISPLAY_BY_DEFAULT = 4;
const getId = (option: OptionProps) => `${option.key}_${option.value}`;
const scrollFocusedIntoView = (option: OptionProps) => {
  const id = getId(option);
  const elem = document.getElementById(id);
  if (elem) {
    elem.scrollIntoView();
  }
};
export const Combobox = ({
  canAddNewValue,
  focusOnMount,
  id,
  isReadOnly = false,
  onChange,
  options,
  label,
  placeholder,
  value,
  isErrored,
  letter,
  color,
  name,
  dropdownElementsToDisplay = DROPDOWN_ELEMENTS_TO_DISPLAY_BY_DEFAULT,
  boldEmailDomains = false,
  required,
}: Props) => {
  const [shouldDisplayDropdown, setShouldDisplayDropdown] =
    React.useState(false);
  const [focusedOptionKey, setFocusedOptionKey] = React.useState<
    OptionProps["key"] | null
  >(null);
  const [hasUserStartedTyping, setHasUserStartedTyping] = React.useState(false);
  const [isFocusedBecauseOfAutoFocus, setIsFocusedBecauseOfAutoFocus] =
    React.useState(focusOnMount);
  const input = React.useRef<HTMLInputElement | HTMLButtonElement>(null);
  const displayedOptions =
    !canAddNewValue || !hasUserStartedTyping
      ? options
      : options.filter((option) => {
          const lowerCaseOptionValue = (option.value || "").toLowerCase();
          const lowerCaseInput = (value || "").toLowerCase();
          return lowerCaseOptionValue.includes(lowerCaseInput);
        });
  const focusedOptionIndex = displayedOptions.findIndex(
    ({ key }) => focusedOptionKey === key
  );
  let focusedOption: OptionProps | undefined;
  let previousOption: OptionProps = displayedOptions[0];
  let nextOption: OptionProps = displayedOptions[0];
  if (focusedOptionIndex !== -1) {
    focusedOption = displayedOptions[focusedOptionIndex];
    previousOption = displayedOptions[Math.max(focusedOptionIndex - 1, 0)];
    nextOption =
      displayedOptions[
        Math.min(focusedOptionIndex + 1, displayedOptions.length - 1)
      ];
  }
  const setFocusedOption = (option: OptionProps | null) => {
    if (!option) {
      setFocusedOptionKey(null);
      return;
    }
    setFocusedOptionKey(option.key);
    scrollFocusedIntoView(option);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserStartedTyping(true);
    if (canAddNewValue) {
      onChange({
        id,
        key: -1,
        value: event.target.value,
      });
    }
  };
  const handleOptionSelection = (option: OptionProps) => {
    setShouldDisplayDropdown(false);
    onChange(option);
  };
  const onKeyDown = (
    event: React.KeyboardEvent<
      HTMLDivElement | HTMLButtonElement | HTMLLIElement
    >
  ) => {
    if (event.key === KEYBOARD_EVENTS.ENTER) {
      if (focusedOption) {
        event.preventDefault();
        setShouldDisplayDropdown(false);
        handleOptionSelection(focusedOption);
      }
    } else if (event.key === KEYBOARD_EVENTS.ARROW_DOWN) {
      if (!isReadOnly) {
        setShouldDisplayDropdown(true);
      }
      setFocusedOption(nextOption);
    } else if (event.key === KEYBOARD_EVENTS.ARROW_UP) {
      setFocusedOption(previousOption);
    } else if (event.key === KEYBOARD_EVENTS.ESCAPE) {
      setFocusedOption(null);
      setShouldDisplayDropdown(false);
    } else if (event.key === KEYBOARD_EVENTS.TAB) {
      setShouldDisplayDropdown(false);
    } else {
      if (!isReadOnly) {
        setHasUserStartedTyping(true);
        setShouldDisplayDropdown(true);
      }
      if (displayedOptions[0]) {
        setFocusedOptionKey(displayedOptions[0].key);
      }
    }
  };
  const onClickArrowDown = () => {
    setHasUserStartedTyping(false);
    setShouldDisplayDropdown(true);
    if (input?.current) {
      input.current.focus();
    }
  };
  React.useEffect(() => {
    if (focusOnMount && input?.current) {
      input.current.focus();
    }
  }, [focusOnMount]);
  let timeout: ReturnType<typeof setTimeout> | null = null;
  React.useEffect(() => {
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeout]);
  React.useEffect(() => {
    if (!shouldDisplayDropdown) {
      setFocusedOptionKey(null);
    }
  }, [shouldDisplayDropdown]);
  const inputId = `${id}-input`;
  const listboxId = `${id}-listbox`;
  const focusBlurHandlers = {
    onBlur: () => {
      timeout = setTimeout(() => setShouldDisplayDropdown(false), 150);
    },
    onFocus: () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (isFocusedBecauseOfAutoFocus) {
        setIsFocusedBecauseOfAutoFocus(false);
        return;
      }
      if (!isReadOnly) {
        setShouldDisplayDropdown(true);
      }
    },
  };
  const commonProps = {
    "aria-activedescendant": focusedOption && getId(focusedOption),
    id: inputId,
    onKeyDown,
    ...focusBlurHandlers,
  };
  return (
    <div sx={SX_STYLES.ROOT}>
      {label && <span sx={SX_STYLES.LABEL}>{label}</span>}
      <div
        sx={SX_STYLES.CONTAINER}
        role={canAddNewValue ? "combobox" : "listbox"}
        aria-expanded={shouldDisplayDropdown}
        aria-haspopup="listbox"
        id={id}
      >
        {canAddNewValue ? (
          <input
            {...commonProps}
            aria-autocomplete="list"
            aria-controls={listboxId}
            ref={input as React.MutableRefObject<HTMLInputElement>}
            sx={mergeSx([
              SX_STYLES.CURRENT_ELEMENT,
              isErrored ? SX_STYLES.ERROR : {},
              isReadOnly ? SX_STYLES.READONLY : {},
            ])}
            aria-invalid={isErrored}
            type="text"
            value={value || ""}
            placeholder={placeholder}
            required={required}
            onKeyDown={onKeyDown}
            onChange={handleChange}
            readOnly={isReadOnly}
          />
        ) : (
          <div>
            <button
              {...commonProps}
              ref={input as React.MutableRefObject<HTMLButtonElement>}
              type="button"
              sx={mergeSx([SX_STYLES.CURRENT_ELEMENT, SX_STYLES.ARROW_ELEMENT])}
            >
              {letter && color && (
                <span sx={SX_STYLES.SPACE_CONTAINER}>
                  <Space letter={letter} color={color} name={name ?? ""} />
                </span>
              )}
              {value}
            </button>
            <button
              sx={SX_STYLES.DROPDOWN_CONTROLS}
              onClick={
                shouldDisplayDropdown
                  ? () => setShouldDisplayDropdown(false)
                  : onClickArrowDown
              }
              type="button"
              data-testid="combobox-dropdown-controls-button"
            >
              <Icon
                name={
                  shouldDisplayDropdown
                    ? "CaretUpOutlined"
                    : "CaretDownOutlined"
                }
              />
            </button>
          </div>
        )}

        {shouldDisplayDropdown && displayedOptions.length > 0 && (
          <ul
            sx={mergeSx([
              SX_STYLES.DROPDOWN,
              {
                maxHeight:
                  (dropdownElementsToDisplay + 0.4) *
                  (input?.current?.offsetHeight || DEFAULT_ELEMENT_HEIGHT),
              },
            ])}
            role="listbox"
            id={listboxId}
            tabIndex={-1}
            {...focusBlurHandlers}
          >
            {displayedOptions.map((option: OptionProps) => {
              const optionId = getId(option);
              const isFocused = option.key === focusedOption?.key;
              let boldedOptionValue = <span>{option.value}</span>;
              if (canAddNewValue && hasUserStartedTyping && value) {
                const searchedValueStartPosition = option.value
                  .toLowerCase()
                  .indexOf(value.toLowerCase());
                if (searchedValueStartPosition >= 0) {
                  const searchedValueEndPosition =
                    searchedValueStartPosition + value.length;
                  boldedOptionValue = (
                    <span>
                      {option.value.substring(0, searchedValueStartPosition)}
                      <span sx={SX_STYLES.EMPHASIZED_TEXT}>
                        {option.value.substring(
                          searchedValueStartPosition,
                          value.length
                        )}
                      </span>
                      {option.value.substring(searchedValueEndPosition)}
                    </span>
                  );
                }
              } else if (boldEmailDomains) {
                const atPosition = option.value.indexOf("@");
                if (atPosition >= 0) {
                  boldedOptionValue = (
                    <span>
                      {option.value.substring(0, atPosition + 1)}
                      <span sx={SX_STYLES.EMPHASIZED_TEXT}>
                        {option.value.substring(atPosition + 1)}
                      </span>
                    </span>
                  );
                }
              }
              return (
                <li
                  role="option"
                  aria-selected={isFocused}
                  id={optionId}
                  key={optionId}
                  sx={mergeSx([
                    SX_STYLES.DROPDOWN_ITEM,
                    isFocused ? SX_STYLES.FOCUSED_ITEM : {},
                  ])}
                  onMouseDown={() => handleOptionSelection(option)}
                  onKeyDown={onKeyDown}
                >
                  {boldedOptionValue}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
