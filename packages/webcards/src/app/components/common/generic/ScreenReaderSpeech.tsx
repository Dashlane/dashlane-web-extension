import React from "react";
import { VisuallyHidden } from "@dashlane/design-system";
interface Props {
  children: React.ReactNode;
}
export const ScreenReaderSpeech = ({ children }: Props) => {
  return <VisuallyHidden>{children}</VisuallyHidden>;
};
