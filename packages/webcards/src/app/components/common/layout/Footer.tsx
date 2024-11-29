import * as React from "react";
import { Badge, jsx, mergeSx, Paragraph } from "@dashlane/design-system";
import { I18nContext } from "../../../context/i18n";
import { SX_STYLES } from "./Footer.styles";
interface Props {
  children?: React.ReactNode;
  withFooterDivider?: boolean;
  withFooterPadding?: boolean;
  extensionShortcuts?: string[];
}
export const Footer = ({
  children,
  withFooterDivider,
  withFooterPadding = true,
  extensionShortcuts,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const shortcutDisplayValue =
    extensionShortcuts && extensionShortcuts.length > 0
      ? extensionShortcuts.toString().replaceAll(",", " + ")
      : undefined;
  return (
    <footer>
      {children ? (
        <React.Fragment>
          {withFooterDivider ? (
            <hr sx={mergeSx([SX_STYLES.DIVIDER, SX_STYLES.BORDER_TOP])} />
          ) : null}
          <div
            sx={mergeSx([
              withFooterPadding
                ? SX_STYLES.FOOTER
                : SX_STYLES.WITHOUT_FOOTER_PADDING,
              withFooterDivider ? SX_STYLES.WITH_DIVIDER : {},
            ])}
          >
            {children}
          </div>
        </React.Fragment>
      ) : null}
      {shortcutDisplayValue ? (
        <div sx={SX_STYLES.EXTENSION_SHORTCUTS_WRAPPER}>
          <Paragraph
            sx={SX_STYLES.DESCRIPTION}
            color="ds.text.neutral.quiet"
            textStyle="ds.body.reduced.regular"
          >
            {translate("openTheExtension")}
          </Paragraph>
          <Badge label={shortcutDisplayValue} intensity="supershy" />
        </div>
      ) : null}
    </footer>
  );
};
