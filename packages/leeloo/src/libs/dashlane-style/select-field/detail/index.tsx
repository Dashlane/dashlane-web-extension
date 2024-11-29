import * as React from "react";
import { head } from "ramda";
import classnames, { Mapping } from "classnames";
import { v4 as uuid } from "uuid";
import { MarginSide } from "../../buttons/modern/base";
import styles from "./style.css";
import sharedStyles from "../sharedStyle.css";
export interface Option {
  disabled?: boolean;
  icon?: React.ReactNode;
  selectedLabel?: string | React.ReactElement;
  label: string;
  value: string | number;
}
interface DetailSelectProps {
  placeholder: string | React.ReactElement;
  disabled?: boolean;
  defaultOption: Option;
  options: Option[];
  onFieldKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  label?: string;
  ariaLabel?: string;
  name?: string;
  dataName?: string;
  isTransparent?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  classNames?: Mapping;
  marginSide?: MarginSide;
}
interface DetailSelectState {
  fieldHtmlId: string;
  optionSelected: Option | null;
  isSelectFocused: boolean;
}
function getOptionByValue(options: Option[], value: string | number) {
  const option = options.find(
    (option) => String(option.value) === String(value)
  );
  return option ?? null;
}
export default class DetailSelect extends React.Component<
  DetailSelectProps,
  DetailSelectState
> {
  constructor(props: DetailSelectProps) {
    super(props);
    let optionSelected: Option | null = null;
    if (this.props.options.length) {
      optionSelected = getOptionByValue(
        this.props.options,
        this.props.defaultOption === null
          ? head(this.props.options).value
          : this.props.defaultOption.value
      );
    }
    this.state = {
      fieldHtmlId: uuid(),
      optionSelected,
      isSelectFocused: false,
    };
  }
  private select = React.createRef<HTMLSelectElement>();
  public getValue() {
    if (!this.select.current) {
      throw new Error("select ref not initialized");
    }
    return this.select.current.value;
  }
  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectElement = event.target;
    if (!selectElement) {
      return;
    }
    const value = selectElement.value;
    const option = getOptionByValue(this.props.options, value);
    this.setState({
      optionSelected: option,
    });
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  };
  private handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    this.props.onFieldKeyDown?.(event);
  };
  private handleFocus = () => {
    this.setState({
      isSelectFocused: true,
    });
  };
  private handleBlur = () => {
    this.setState({
      isSelectFocused: false,
    });
  };
  public render() {
    const marginSide = this.props.marginSide || "none";
    const selectContainerClass = classnames(
      styles.selectContainer,
      sharedStyles[marginSide],
      {
        [styles.transparent]: this.props.isTransparent,
        [styles.disabled]: this.props.disabled,
        [styles.focused]: this.state.isSelectFocused,
      }
    );
    const selectorClass = classnames(styles.selector, this.props.classNames);
    let valueSelected;
    if (this.state.optionSelected) {
      valueSelected = this.state.optionSelected.value;
    } else if (this.props.options.length) {
      valueSelected =
        this.props.defaultOption === null
          ? head(this.props.options).value
          : this.props.defaultOption.value;
    }
    const selectedOptionText = this.state.optionSelected
      ? this.state.optionSelected.selectedLabel
        ? this.state.optionSelected.selectedLabel
        : this.state.optionSelected.label
      : this.props.placeholder;
    return (
      <div className={styles.container}>
        {this.props.label && (
          <label
            className={sharedStyles.label}
            color="ds.text.neutral.catchy"
            htmlFor={this.state.fieldHtmlId}
            title={this.props.label}
          >
            {this.props.label}
          </label>
        )}
        <div className={selectContainerClass}>
          <div className={selectorClass}>
            {this.state.optionSelected && this.state.optionSelected.icon && (
              <span className={styles.icon}>
                {this.state.optionSelected.icon}
              </span>
            )}
            <span
              className={styles.text}
              sx={{ color: "ds.text.neutral.catchy" }}
            >
              {selectedOptionText}
            </span>
          </div>
          <select
            key={this.state.fieldHtmlId}
            className={sharedStyles.select}
            ref={this.select}
            id={this.state.fieldHtmlId}
            value={valueSelected}
            name={this.props.name}
            disabled={this.props.disabled}
            data-name={this.props.dataName}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            aria-label={this.props.ariaLabel ?? this.props.label}
          >
            {this.props.options.map((option) => (
              <option
                key={option.value}
                disabled={option.disabled}
                value={String(option.value)}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}
