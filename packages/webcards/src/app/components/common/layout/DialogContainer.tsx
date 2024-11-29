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
  countdownPercentage?: number;
  withFooterDivider?: boolean;
  withHeaderCloseButton?: boolean;
  withHeaderLogo?: boolean;
  withFooterPadding?: boolean;
  withNoMainPadding?: boolean;
  withNoContentCardWrapper?: boolean;
}
export const DialogContainer = ({
  children,
  closeWebcard,
  extensionShortcuts,
  footerContent,
  headerContent,
  countdownPercentage,
  withFooterDivider,
  withHeaderCloseButton,
  withHeaderLogo,
  withFooterPadding,
  withNoMainPadding,
  withNoContentCardWrapper,
}: Props) => {
  const header = headerContent ? (
    <Header
      onClickClose={withHeaderCloseButton ? closeWebcard : undefined}
      withDashlaneLogo={withHeaderLogo}
      countdownPercentage={countdownPercentage}
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
      withNoContentCardWrapper={withNoContentCardWrapper}
    >
      {children}
    </CardLayout>
  );
};
