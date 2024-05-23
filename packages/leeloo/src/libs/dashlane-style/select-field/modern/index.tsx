import * as React from 'react';
import classnames, { Mapping } from 'classnames';
import { MarginSide } from 'libs/dashlane-style/buttons/modern/base';
import styles from './style.css';
import sharedStyles from '../sharedStyle.css';
export interface Option {
    label: string;
    value: string | number;
}
interface Props extends React.Props<StandardSelect> {
    placeholder: React.ReactNode;
    disabled?: boolean;
    defaultValue?: string | number | null;
    options: Option[];
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    classNames?: Mapping;
    marginSide?: MarginSide;
}
interface State {
    optionSelected: Option | null;
}
const getOptionByValue = (options: Option[], value: string | number) => {
    const option = options.find((option) => String(option.value) === String(value));
    return option ?? null;
};
export default class StandardSelect extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            optionSelected: null,
        };
    }
    public UNSAFE_componentWillMount() {
        const option = getOptionByValue(this.props.options, String(this.props.defaultValue));
        this.setState({ optionSelected: option });
    }
    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        if (this.state.optionSelected === null ||
            (this.state.optionSelected &&
                nextProps.defaultValue !== this.state.optionSelected.value)) {
            const option = getOptionByValue(nextProps.options, String(nextProps.defaultValue));
            this.setState({ optionSelected: option });
        }
    }
    private onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
    public render() {
        const marginSide = this.props.marginSide || 'none';
        const containerClass = classnames(styles.container, sharedStyles[marginSide]);
        const selectorClass = classnames(styles.selector, this.props.classNames, {
            [sharedStyles.disable]: this.props.disabled,
        });
        const valueSelected = this.state.optionSelected
            ? this.state.optionSelected.value
            : this.props.defaultValue;
        return (<div className={containerClass}>
        <div className={selectorClass}>
          {this.state.optionSelected
                ? this.state.optionSelected.label
                : this.props.placeholder}
        </div>
        <select className={sharedStyles.select} defaultValue={String(valueSelected)} disabled={this.props.disabled} onChange={this.onChange}>
          {this.props.options.map((option) => {
                return (<option key={option.value} value={String(option.value)}>
                {option.label}
              </option>);
            })}
        </select>
      </div>);
    }
}
