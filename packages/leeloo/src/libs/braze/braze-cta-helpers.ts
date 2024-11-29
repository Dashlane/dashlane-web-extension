import { InAppMessageButton } from "@braze/web-sdk";
export const DEEPLINK_SCHEME = "dashlane:///";
export const mapBrazeButtonsToDialogActions = (
  buttons: InAppMessageButton[]
):
  | {
      primaryButton: InAppMessageButton;
      secondaryButton?: InAppMessageButton;
    }
  | undefined => {
  if (!buttons.length) {
    return undefined;
  }
  if (buttons.length === 1) {
    return { primaryButton: buttons[0] };
  }
  return {
    primaryButton: buttons[1],
    secondaryButton: buttons[0],
  };
};
type BrazeDialogActions =
  | {
      primary: {
        children: string;
        onClick: () => void;
      };
      secondary?: {
        children: string;
        onClick: () => void;
      };
    }
  | undefined;
export const getDialogActions = (
  buttons: InAppMessageButton[],
  actionHandler: (button: InAppMessageButton) => void
): BrazeDialogActions => {
  const { primaryButton, secondaryButton } =
    mapBrazeButtonsToDialogActions(buttons) ?? {};
  if (!primaryButton) {
    return undefined;
  }
  const primaryButtonAction = {
    primary: {
      children: primaryButton.text,
      onClick: () => actionHandler(primaryButton),
    },
  };
  if (!secondaryButton) {
    return primaryButtonAction;
  }
  return {
    ...primaryButtonAction,
    secondary: {
      children: secondaryButton.text,
      onClick: () => actionHandler(secondaryButton),
    },
  };
};
export const isDeeplink = (uri: string) => uri.startsWith(DEEPLINK_SCHEME);
