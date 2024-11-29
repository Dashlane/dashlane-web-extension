import { ChangeEvent, useState } from "react";
import type { Property } from "csstype";
import {
  AddIcon,
  GridChild,
  GridContainer,
  SubtractIcon,
  TextInput,
} from "@dashlane/ui-components";
interface Props {
  id: string;
  defaultValue: number;
  onChange: (newValue: number) => void;
  minValue: number;
  label: string;
  inputWidth?: Property.Width;
  ariaLabel?: string;
  signalAmountValidHandler?: (info: boolean) => void;
}
const STYLES = {
  BORDER_COLOR_DEFAULT: "ds.text.inverse.quiet",
  BORDER_COLOR_ERRORED: "ds.border.danger.quiet.idle",
  OUTER_BORDER_RADIUS: "4px",
  BUTTON_SIZE: "44px",
};
const BUTTON_STYLES = {
  bg: "ds.container.expressive.brand.catchy.idle",
  borderStyle: "solid",
  borderWidth: "1px",
  cursor: "pointer",
  display: "flex",
  fontFamily: "monospace",
  fontSize: 5,
  justifyContent: "center",
  lineHeight: "20px",
  width: STYLES.BUTTON_SIZE,
  p: "10px",
  "& path": {
    fill: "neutrals.0",
  },
  ":disabled": {
    bg: "ds.container.expressive.brand.catchy.disabled",
    cursor: "not-allowed",
    "& path": {
      fill: "ds.text.oddity.disabled",
    },
  },
  ":hover:not(:disabled)": {
    bg: "ds.container.expressive.brand.catchy.hover",
  },
  ":active:not(:disabled)": {
    bg: "ds.container.expressive.brand.catchy.idle",
  },
};
export const SpinnerInput = ({
  id,
  inputWidth = "100%",
  label,
  minValue,
  onChange,
  defaultValue,
  ariaLabel,
  signalAmountValidHandler,
}: Props) => {
  const [value, setValue] = useState(defaultValue);
  const [valueValid, setValueValid] = useState(true);
  const notifyValueChanged = (newValue: number) => {
    setValue(newValue);
    onChange(newValue);
  };
  const signalValueValid = (newValue: number) => {
    if (!signalAmountValidHandler) {
      return;
    }
    if (!Number.isNaN(newValue) && newValue < minValue) {
      signalAmountValidHandler(false);
      setValueValid(false);
    } else {
      signalAmountValidHandler(true);
      setValueValid(true);
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.currentTarget.value, 10);
    notifyValueChanged(newValue || minValue);
    signalValueValid(newValue);
  };
  const handleDecrement = () => {
    const newValue = value - 1;
    notifyValueChanged(newValue);
    signalValueValid(newValue);
  };
  const handleIncrement = () => {
    const newValue = value + 1;
    notifyValueChanged(newValue);
    signalValueValid(newValue);
  };
  const minDisabled = value <= minValue;
  return (
    <GridContainer
      fullWidth
      alignItems="center"
      gridTemplateColumns={`auto ${STYLES.BUTTON_SIZE} ${inputWidth} ${STYLES.BUTTON_SIZE}`}
      gridTemplateRows="auto auto"
      gridTemplateAreas="'label decrement textInput increment'"
    >
      <GridChild gridArea="label" as="label" id={`${id}-label`}>
        {label}
      </GridChild>
      <GridChild gridArea="decrement">
        <button
          aria-hidden="true"
          type="button"
          sx={{
            ...BUTTON_STYLES,
            borderRightWidth: "0",
            borderBottomLeftRadius: STYLES.OUTER_BORDER_RADIUS,
            borderTopLeftRadius: STYLES.OUTER_BORDER_RADIUS,
            borderColor: valueValid
              ? STYLES.BORDER_COLOR_DEFAULT
              : STYLES.BORDER_COLOR_ERRORED,
            "&:disabled": {
              borderColor: valueValid
                ? STYLES.BORDER_COLOR_DEFAULT
                : STYLES.BORDER_COLOR_ERRORED,
            },
          }}
          onClick={handleDecrement}
          disabled={minDisabled}
        >
          <SubtractIcon size={20} />
        </button>
      </GridChild>
      <TextInput
        id={id}
        data-testid={id}
        aria-labelledby={`${id}-label`}
        aria-label={ariaLabel}
        fullWidth
        autoFocus
        sx={{
          alignSelf: "end",
          gridArea: "textInput",
          height: "42px",
          textAlign: "right",
          px: "8px",
          borderRadius: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderColor: "ds.text.inverse.quiet",
          "&:hover, &:hover:not(:focus):not(:disabled), &:focus": {
            borderColor: "ds.text.inverse.quiet",
          },
          "-moz-appearance": "textfield",
          "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
            display: "none",
          },
          "&:invalid": {
            color: "ds.text.danger.quiet",
            borderTopColor: STYLES.BORDER_COLOR_ERRORED,
            borderBottomColor: STYLES.BORDER_COLOR_ERRORED,
          },
        }}
        value={value}
        min={minValue}
        onChange={handleChange}
        step={1}
        type="number"
      />
      <button
        data-testid={"spinnerPlusButton"}
        aria-hidden="true"
        tabIndex={-1}
        type="button"
        sx={{
          ...BUTTON_STYLES,
          borderBottomRightRadius: STYLES.OUTER_BORDER_RADIUS,
          borderLeftWidth: "0",
          borderTopRightRadius: STYLES.OUTER_BORDER_RADIUS,
          borderColor: valueValid
            ? STYLES.BORDER_COLOR_DEFAULT
            : STYLES.BORDER_COLOR_ERRORED,
          gridArea: "increment",
        }}
        onClick={handleIncrement}
      >
        <AddIcon size={20} />
      </button>
    </GridContainer>
  );
};
