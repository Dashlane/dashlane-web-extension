import * as React from 'react';
import { all, compose, defaultTo, equals, evolve, isEmpty, not, reduce, trim, values, } from 'ramda';
import { Lee } from 'lee';
export interface Props<T extends object, AdditionalProps extends {} = {}> {
    lee: Lee;
    currentValues: T;
    newItemType?: string;
    isNewItem?: boolean;
    onValuesUpdated?: (values: T) => void;
    signalEditedValues?: (hasChanged: boolean) => void;
    additionalProps?: AdditionalProps;
}
export type Errors<T> = {
    [k in keyof T]: boolean;
};
export interface State<T extends object, I extends object> {
    values: T;
    errors: Errors<T>;
    internal: Partial<I>;
}
export type Validations<T> = {
    [k in keyof T]?: (x: any) => boolean;
};
export type ChangedValues = {
    [key: string]: any;
};
export const isNotEmpty = compose(not, isEmpty, trim, defaultTo(''));
const basicEmailRegex = /.+@.+\..+/;
export const isEmail = (str: string) => basicEmailRegex.test(str.trim());
export default abstract class GenericForm<T extends object, I extends object = {}, AdditionalProps extends {} = {}> extends React.Component<Props<T, AdditionalProps>, State<T, I>> {
    public constructor(props: Props<T, AdditionalProps>) {
        super(props);
        const errors = Object.keys(props.currentValues).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {} as Errors<T>);
        this.state = {
            internal: {},
            values: props.currentValues,
            errors,
        };
    }
    public componentDidUpdate(previousProps: Props<T, AdditionalProps>): void {
        if (!equals(this.props.currentValues, previousProps.currentValues)) {
            this.setState({
                values: this.props.currentValues,
            });
        }
    }
    protected setInternalState = (internal: Partial<I>): void => {
        this.setState({
            internal: {
                ...this.state.internal,
                ...internal,
            },
        });
    };
    protected setUpdatedValues = (changedValues: ChangedValues): void => {
        const { signalEditedValues, onValuesUpdated } = this.props;
        const values: T = { ...this.state.values, ...changedValues };
        this.setState({ values }, () => {
            if (signalEditedValues) {
                signalEditedValues(this.hasFormBeenEdited());
            }
            if (onValuesUpdated) {
                onValuesUpdated(values);
            }
        });
    };
    protected handleChange = (eventOrValue: React.ChangeEvent<any> | any, key = ''): void => {
        if (eventOrValue instanceof Event && key) {
            throw new Error('handleChange was called with both a ChangeEvent and key.');
        }
        const changedValues = eventOrValue?.target
            ? { [eventOrValue.target.dataset.name]: eventOrValue.target.value }
            : { [key]: eventOrValue };
        this.setUpdatedValues(changedValues);
    };
    protected handleChanges = (changedValues: ChangedValues): void => {
        this.setUpdatedValues(changedValues);
    };
    public abstract isFormValid(): boolean;
    protected validateValues = (validations: Validations<T>): boolean => {
        if (Object.keys(validations).length === 0) {
            return true;
        }
        const allValidations: Validations<T> = reduce((acc, key: string) => {
            acc[key] = validations[key]
                ? compose(not, validations[key])
                : () => false;
            return acc;
        }, {}, Object.keys(this.state.values));
        const errors = evolve<Errors<T>>(allValidations, this.state.values);
        this.setState({ errors });
        return all<boolean>(equals(false), values(errors));
    };
    private hasFormBeenEdited = (): boolean => {
        return !equals<T>(this.state.values, this.props.currentValues);
    };
    public getValues = (): T => {
        return this.state.values;
    };
}
