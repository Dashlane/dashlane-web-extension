import { DSStyleObject, Heading, Tabs } from "@dashlane/design-system";
import IntelligentTooltipOnOverflow from "../../../libs/dashlane-style/intelligent-tooltip-on-overflow";
import { TabProps } from "../../secure-notes/form/header/header";
const HEADER_SX: DSStyleObject = {
  display: "flex",
  flexDirection: "column",
  padding: "24px 24px 16px 24px",
  maxHeight: "40vh",
  gap: "16px",
};
const MAIN_SECTION: DSStyleObject = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const TITLE_DESCRIPTION_SX: DSStyleObject = {
  color: "ds.text.neutral.quiet",
  textTransform: "capitalize",
  fontSize: "15px",
  textOverflow: "ellipsis",
  overflow: "hidden",
};
interface TitleHeadingProps {
  title: React.ReactNode;
}
const TitleHeading = ({ title }: TitleHeadingProps) => (
  <Heading
    as="h2"
    textStyle="ds.title.section.medium"
    color="ds.text.neutral.catchy"
    sx={{
      display: "flex",
      textOverflow: "ellipsis",
      overflow: "hidden",
    }}
  >
    <IntelligentTooltipOnOverflow>{title}</IntelligentTooltipOnOverflow>
  </Heading>
);
interface TitleDescriptionProps {
  titleDescription: string;
}
const TitleDescription = ({ titleDescription }: TitleDescriptionProps) => (
  <IntelligentTooltipOnOverflow
    tooltipText={titleDescription}
    sx={TITLE_DESCRIPTION_SX}
  >
    {titleDescription}
  </IntelligentTooltipOnOverflow>
);
export interface HeaderProps {
  title: React.ReactNode;
  icon: React.ReactNode;
  iconBackgroundColor?: string;
  children?: React.ReactNode;
  titleDescription?: string;
  tabs?: TabProps[];
  tabIndex?: number;
}
export const PanelHeader = ({
  icon,
  iconBackgroundColor,
  titleDescription,
  title,
  tabs,
  tabIndex,
  children,
}: HeaderProps) => (
  <header sx={HEADER_SX}>
    <div sx={MAIN_SECTION}>
      <span
        sx={{
          backgroundColor: iconBackgroundColor,
          borderRadius: "4px",
        }}
      >
        {icon}
      </span>

      <span>
        {titleDescription && (
          <TitleDescription titleDescription={titleDescription} />
        )}
        <TitleHeading title={title} />
        {children}
      </span>
    </div>
    {tabs && (
      <div sx={{ overflow: "hidden", scrollbarGutter: "stable" }}>
        <Tabs
          key={tabIndex?.toString()}
          tabs={tabs}
          fullWidth
          defaultTab={tabIndex}
        />
      </div>
    )}
  </header>
);
