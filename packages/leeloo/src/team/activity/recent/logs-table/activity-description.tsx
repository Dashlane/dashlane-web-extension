import * as React from "react";
interface Props {
  text?: string;
}
export const ActivityDescription = ({ text }: Props) => {
  if (!text) {
    return null;
  }
  const textParts = text.split("**");
  if (textParts.length === 1) {
    return <span>{text}</span>;
  }
  return (
    <span>
      {textParts.map((textPart, i) =>
        i % 2 === 1 ? (
          <strong key={`${textPart}-${i}`}>{textPart}</strong>
        ) : (
          textPart
        )
      )}
    </span>
  );
};
