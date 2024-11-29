import { HTMLInputTypeAttribute, Ref } from "react";
const CHAR_WIDTH = "32px";
const GAP_BETWEEN_CHAR = "8px";
const getLineSize = (maxLength: number) =>
  `calc(${maxLength} * (${CHAR_WIDTH} + ${GAP_BETWEEN_CHAR}))`;
const getLinearGradient = (
  color: string,
  height: string,
  maxLength: number
) => {
  const lineSize = getLineSize(maxLength);
  return `repeating-linear-gradient(
      90deg,
      ${color} 0,
      ${color} ${CHAR_WIDTH},
      transparent 0,
      transparent calc(${CHAR_WIDTH} + ${GAP_BETWEEN_CHAR})
    )
    0 100% / ${lineSize} ${height} no-repeat`;
};
const getDashedLines = (color: string, maxLength: number) => {
  return getLinearGradient(color, "2px", maxLength);
};
const getBackgroundRectangles = (color: string, maxLength: number) => {
  return getLinearGradient(color, "38px", maxLength);
};
const getFeedbackColor = (feedbackType: TokenInputFeedbackType) => {
  switch (feedbackType) {
    case "warning": {
      return "ds.border.warning.standard.active";
    }
    case "error": {
      return "ds.border.danger.standard.active";
    }
    default: {
      return "ds.border.brand.standard.active";
    }
  }
};
type TokenInputFeedbackType = "error" | "warning";
export interface TokenInputProps {
  inputRef?: Ref<HTMLInputElement>;
  value: string;
  maxLength: number;
  feedbackType?: TokenInputFeedbackType;
  feedbackText?: string;
  feedbackTextId?: string;
  type?: HTMLInputTypeAttribute | undefined;
}
export const TokenInput = ({
  inputRef,
  value,
  maxLength,
  feedbackType,
  feedbackText,
  feedbackTextId,
  type = "text",
  ...rest
}: TokenInputProps & JSX.IntrinsicElements["input"]): JSX.Element => {
  return (
    <div>
      <p
        sx={{
          background: getBackgroundRectangles(
            "ds.container.expressive.brand.quiet.disabled",
            maxLength
          ),
          mb: "4px",
        }}
      >
        <input
          ref={inputRef}
          sx={{
            display: "block",
            width: "100%",
            mb: "8px",
            py: "4px",
            px: "9px",
            fontFamily: "monospace",
            fontSize: 6,
            letterSpacing: "25px",
            color: "ds.text.neutral.catchy",
            border: "none",
            background: getDashedLines("ds.border.brand.quiet.idle", maxLength),
            transition: "background-color 0.1s ease-in",
            ":hover": {
              background: !feedbackType
                ? getDashedLines("ds.border.brand.standard.active", maxLength)
                : getDashedLines(getFeedbackColor(feedbackType), maxLength),
            },
            ":focus": {
              outline: "none",
              border: "none",
              borderRadius: 0,
              background: !feedbackType
                ? getDashedLines("ds.border.brand.standard.active", maxLength)
                : getDashedLines(getFeedbackColor(feedbackType), maxLength),
            },
            ":disabled": {
              color: "ds.text.oddity.disabled",
              background: getDashedLines(
                "ds.border.brand.quiet.idle",
                maxLength
              ),
            },
            ...(feedbackType
              ? {
                  background: getDashedLines(
                    getFeedbackColor(feedbackType),
                    maxLength
                  ),
                }
              : {}),
          }}
          type={type}
          maxLength={maxLength}
          value={value}
          aria-describedby={feedbackTextId}
          {...rest}
        />
      </p>
      {feedbackType && feedbackText ? (
        <p
          id={feedbackTextId}
          sx={{
            color: getFeedbackColor(feedbackType),
            fontSize: 1,
            fontFamily: "body",
            lineHeight: 4,
            mt: 0,
          }}
        >
          {feedbackText}
        </p>
      ) : null}
    </div>
  );
};
