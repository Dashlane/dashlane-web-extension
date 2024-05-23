import { ChangeEvent, useState } from 'react';
import type { Property } from 'csstype';
import { AddIcon, GridChild, GridContainer, jsx, SubtractIcon, TextInput, } from '@dashlane/ui-components';
interface Props {
    id: string;
    defaultValue: number;
    onChange: (newValue: number) => void;
    minValue: number;
    label: string;
    inputWidth?: Property.Width;
}
const BUTTON_BORDER_RADIUS = '4px';
const BUTTON_SIZE = '44px';
const buttonStyles = {
    bg: 'ds.container.expressive.brand.catchy.idle',
    borderColor: 'ds.text.inverse.quiet',
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'monospace',
    fontSize: 5,
    justifyContent: 'center',
    lineHeight: '20px',
    width: BUTTON_SIZE,
    p: '10px',
    '& path': {
        fill: 'neutrals.0',
    },
    ':disabled': {
        bg: 'ds.container.expressive.brand.catchy.disabled',
        borderColor: 'ds.text.inverse.quiet',
        cursor: 'not-allowed',
        '& path': {
            fill: 'ds.text.oddity.disabled',
        },
    },
    ':hover:not(:disabled)': {
        bg: 'ds.container.expressive.brand.catchy.hover',
    },
    ':active:not(:disabled)': {
        bg: 'ds.container.expressive.brand.catchy.idle',
    },
};
export const SpinnerInput = ({ id, inputWidth = '100%', label, minValue, onChange, defaultValue, }: Props) => {
    const [value, setValue] = useState(defaultValue);
    const notifyValueChanged = (newValue: number) => {
        setValue(newValue);
        onChange(newValue);
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.currentTarget.value, 10);
        notifyValueChanged(newValue || minValue);
    };
    const handleDecrement = () => {
        notifyValueChanged(value - 1);
    };
    const handleIncrement = () => {
        notifyValueChanged(value + 1);
    };
    const minDisabled = value <= minValue;
    return (<GridContainer fullWidth alignItems="center" gridTemplateColumns={`auto ${BUTTON_SIZE} ${inputWidth} ${BUTTON_SIZE}`} gridTemplateRows="auto auto" gridTemplateAreas="'label decrement textInput increment'">
      <GridChild gridArea="label" as="label" id={`${id}-label`}>
        {label}
      </GridChild>
      <GridChild gridArea="decrement">
        <button aria-hidden="true" type="button" sx={{
            ...buttonStyles,
            borderRightWidth: '0',
            borderBottomLeftRadius: BUTTON_BORDER_RADIUS,
            borderTopLeftRadius: BUTTON_BORDER_RADIUS,
        }} onClick={handleDecrement} disabled={minDisabled}>
          <SubtractIcon size={20}/>
        </button>
      </GridChild>
      <TextInput id={id} aria-labelledby={`${id}-label`} fullWidth autoFocus sx={{
            alignSelf: 'end',
            gridArea: 'textInput',
            height: '42px',
            textAlign: 'right',
            px: '8px',
            borderRadius: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderColor: 'ds.text.inverse.quiet',
            '&:hover, &:hover:not(:focus):not(:disabled), &:focus': {
                borderColor: 'ds.text.inverse.quiet',
            },
            '-moz-appearance': 'textfield',
            '&::-webkit-outer-spin-button,&::-webkit-inner-spin-button': {
                display: 'none',
            },
        }} value={value} min={minValue} onChange={handleChange} step={1} type="number"/>
      <button aria-hidden="true" type="button" sx={{
            ...buttonStyles,
            borderBottomRightRadius: BUTTON_BORDER_RADIUS,
            borderLeftWidth: '0',
            borderTopRightRadius: BUTTON_BORDER_RADIUS,
            gridArea: 'increment',
        }} onClick={handleIncrement}>
        <AddIcon size={20}/>
      </button>
    </GridContainer>);
};
