import * as React from "react";
import { CardLayout } from "./CardLayout";
import { Footer } from "./Footer";
import { Header } from "./Header";
interface Props {
  children: React.ReactNode;
  closeWebcard: () => void;
  extensionShortcuts?: string[];
  footerContent?: React.ReactNode;
  headerContent?: React.ReactNode;
  withFooterDivider?: boolean;
  withHeaderCloseButton?: boolean;
  withHeaderLogo?: boolean;
  withFooterPadding?: boolean;
  withNoMainPadding?: boolean;
}
export const DialogContainer = ({
  children,
  closeWebcard,
  extensionShortcuts,
  footerContent,
  headerContent,
  withFooterDivider,
  withHeaderCloseButton,
  withHeaderLogo,
  withFooterPadding,
  withNoMainPadding,
}: Props) => {
  const header = headerContent ? (
    <Header
      onClickClose={withHeaderCloseButton ? closeWebcard : undefined}
      withDashlaneLogo={withHeaderLogo}
    >
      {headerContent}
    </Header>
  ) : null;
  const footer = footerContent ? (
    <Footer
      withFooterDivider={withFooterDivider}
      withFooterPadding={withFooterPadding}
      extensionShortcuts={extensionShortcuts}
    >
      {footerContent}
    </Footer>
  ) : null;
  return (
    <CardLayout
      header={header}
      footer={footer}
      withNoMainPadding={withNoMainPadding}
    >
      {children}
    </CardLayout>
  );
};
