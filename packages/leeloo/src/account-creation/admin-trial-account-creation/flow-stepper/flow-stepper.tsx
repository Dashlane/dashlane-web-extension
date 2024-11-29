import { Fragment } from "react";
import {
  DSStyleObject,
  Flex,
  Icon,
  mergeSx,
  Paragraph,
} from "@dashlane/design-system";
import { AdminTrialAccountCreationStep, StepConfiguration } from "../types";
const BASE_SIZE = 46;
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  BASE: {
    height: `${BASE_SIZE}px`,
    width: `${BASE_SIZE}px`,
    borderRadius: "50%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: "1px",
    borderStyle: "solid",
    marginBottom: "8px",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    borderColor: "ds.border.brand.quiet.idle",
    "&, & ~ p": {
      color: "ds.text.brand.quiet",
    },
  },
  DIVIDER: {
    width: `72px`,
    minWidth: `36px`,
    height: "1px",
    backgroundColor: "ds.border.neutral.quiet.idle",
    marginTop: `${BASE_SIZE / 2}px`,
  },
  STEP_DONE: {
    backgroundColor: "ds.container.expressive.positive.quiet.idle",
    borderColor: "transparent",
    "&, & ~ p": {
      color: "ds.text.positive.quiet",
    },
  },
  STEP_DISABLED: {
    backgroundColor: "ds.container.expressive.neutral.quiet.disabled",
    borderColor: "transparent",
    "&, & ~ p": {
      color: "ds.text.oddity.disabled",
    },
  },
};
interface FlowStepperProps {
  steps: Array<StepConfiguration>;
  currentStep: AdminTrialAccountCreationStep;
}
export const FlowStepper = ({ steps, currentStep }: FlowStepperProps) => {
  return (
    <Flex
      as="ol"
      gap="8px"
      justifyContent="center"
      flexWrap="nowrap"
      sx={{
        overflowY: "hidden",
        overflowX: "auto",
      }}
    >
      {steps.map(({ disabled, done, label, step, skipped = false }, index) => (
        <Fragment key={step}>
          <Flex
            as="li"
            aria-label={label}
            aria-disabled={disabled ? "true" : undefined}
            aria-current={currentStep === step ? "step" : undefined}
            flexDirection="column"
            alignItems="center"
            sx={{
              minWidth: "80px",
              maxWidth: "120px",
            }}
          >
            <div
              sx={mergeSx([
                SX_STYLES.BASE,
                done ? SX_STYLES.STEP_DONE : {},
                disabled ? SX_STYLES.STEP_DISABLED : {},
              ])}
            >
              {done || skipped ? (
                <Icon
                  name={
                    done ? "FeedbackSuccessFilled" : "FeedbackWarningFilled"
                  }
                  size="large"
                  color={
                    done ? "ds.text.positive.quiet" : "ds.text.warning.quiet"
                  }
                  aria-hidden={true}
                  sx={{
                    position: "absolute",
                    top: "-2px",
                    right: "-12px",
                  }}
                />
              ) : null}
              <Paragraph
                textStyle="ds.specialty.spotlight.small"
                sx={{
                  textAlign: "center",
                }}
              >
                {index + 1}
              </Paragraph>
            </div>
            <Paragraph
              textStyle="ds.body.helper.regular"
              sx={{
                textWrap: "balance",
                textAlign: "center",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
              }}
            >
              {label}
            </Paragraph>
          </Flex>
          {index !== steps.length - 1 ? (
            <div sx={SX_STYLES.DIVIDER} aria-hidden={true} />
          ) : null}
        </Fragment>
      ))}
    </Flex>
  );
};
