import { ReactNode } from "react";
import classnames from "classnames";
import { DSStyleObject, Heading } from "@dashlane/design-system";
import { Loader } from "../components/loader";
import styles from "./styles.css";
interface Props {
  sideContent?: ReactNode;
  trailingContent?: ReactNode;
  children?: ReactNode;
  title?: string;
  isLoading?: boolean;
}
export const SettingsPage = ({
  children,
  sideContent,
  trailingContent,
  title,
  isLoading = false,
}: Props) => {
  const sideContentStyles: DSStyleObject = sideContent
    ? {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "800px",
      }
    : {
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        padding: "32px",
        borderRadius: "8px",
      };
  return isLoading ? (
    <Loader scopedToPage={true} />
  ) : (
    <div
      className={classnames(styles.settingsPage, {
        [styles.withoutHeader]: !title,
      })}
    >
      <div className={styles.settingsContainer}>
        {title ? (
          <Heading
            as="h1"
            textStyle="ds.title.section.large"
            color="ds.text.neutral.catchy"
            sx={{ marginBottom: "32px" }}
          >
            {title}
          </Heading>
        ) : null}
        <div sx={{ display: "flex", gap: "24px" }}>
          <div sx={sideContentStyles}>
            {children}
            <div>{trailingContent}</div>
          </div>
          {sideContent}
        </div>
      </div>
    </div>
  );
};
