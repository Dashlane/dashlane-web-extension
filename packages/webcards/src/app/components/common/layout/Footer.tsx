import * as React from "react";
import { Paragraph } from "@dashlane/ui-components";
import { Badge, jsx, mergeSx } from "@dashlane/design-system";
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
      {extensionShortcuts && extensionShortcuts?.length > 0 ? (
        <div
          sx={mergeSx([
            SX_STYLES.EXTENSION_SHORTCUTS_WRAPPER,
            SX_STYLES.BORDER_TOP,
          ])}
        >
          <Paragraph
            sx={SX_STYLES.DESCRIPTION}
            color={"ds.text.neutral.quiet"}
            size="x-small"
          >
            {translate("openTheExtension")}
          </Paragraph>
          {extensionShortcuts.map((shortcut: string) => (
            <div sx={SX_STYLES.SHORTCUT_ITEM} key={shortcut}>
              <Badge label={shortcut} intensity="supershy" />
            </div>
          ))}
        </div>
      ) : null}
    </footer>
  );
};
