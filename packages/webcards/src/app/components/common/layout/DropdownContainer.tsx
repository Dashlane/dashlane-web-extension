import * as React from "react";
import { AutofillDropdownWebcardData } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { OptionsMenu } from "../../webcards/dropdowns/common/OptionsMenu";
import { SearchResults } from "../../webcards/dropdowns/common/SearchResults";
import { CardLayout } from "./CardLayout";
import { Footer } from "./Footer";
import { Header } from "./Header";
interface Props {
  children: React.ReactNode;
  closeWebcard: () => void;
  extensionShortcuts?: string[];
  footerContent?: React.ReactNode;
  headerContent?: React.ReactNode;
  isSearchActive?: boolean;
  srcElementValue?: string;
  webcardData: AutofillDropdownWebcardData;
  withAllBordersRounded?: boolean;
  withFooterDivider?: boolean;
  withHeaderCloseButton?: boolean;
  withHeaderLogo?: boolean;
  withHeaderOptionsButton?: boolean;
  withHeaderSearchButton?: boolean;
  withFooterPadding?: boolean;
  withNoMainPadding?: boolean;
}
export const DropdownContainer = ({
  children,
  closeWebcard,
  extensionShortcuts,
  footerContent,
  headerContent,
  isSearchActive = false,
  srcElementValue,
  webcardData,
  withAllBordersRounded,
  withFooterDivider,
  withHeaderCloseButton,
  withHeaderLogo,
  withHeaderOptionsButton,
  withHeaderSearchButton,
  withFooterPadding,
  withNoMainPadding,
}: Props) => {
  const [showSearch, setShowSearch] = React.useState(isSearchActive);
  const onClickSearch = () => setShowSearch(true);
  const onCloseSearch = () => setShowSearch(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const onMoreOptions = () => setShowOptions((prevState) => !prevState);
  React.useEffect(() => {
    setShowOptions(false);
    setShowSearch(false);
  }, [webcardData]);
  React.useEffect(() => {
    setShowSearch(isSearchActive);
  }, [isSearchActive]);
  if (showSearch) {
    return (
      <SearchResults
        closeWebcard={closeWebcard}
        onCloseSearch={onCloseSearch}
        srcElementValue={srcElementValue}
        webcardData={webcardData}
      />
    );
  }
  if (showOptions) {
    return (
      <OptionsMenu
        onMoreOptions={onMoreOptions}
        closeWebcard={closeWebcard}
        webcardData={webcardData}
      />
    );
  }
  const header = headerContent ? (
    <Header
      isDropdown={true}
      isOptionsMenuOpen={showOptions}
      onClickClose={withHeaderCloseButton ? closeWebcard : undefined}
      onClickOptions={withHeaderOptionsButton ? onMoreOptions : undefined}
      onClickSearch={withHeaderSearchButton ? onClickSearch : undefined}
      withDashlaneLogo={withHeaderLogo}
    >
      {headerContent}
    </Header>
  ) : null;
  const footer =
    footerContent || extensionShortcuts ? (
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
      isDropdown
      header={header}
      footer={footer}
      webcardData={webcardData}
      withAllBordersRounded={withAllBordersRounded}
      withNoMainPadding={withNoMainPadding}
    >
      {children}
    </CardLayout>
  );
};
