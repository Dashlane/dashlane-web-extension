import classNames from "classnames";
import { Tab, TabList } from "react-tabs";
import { jsx, Paragraph } from "@dashlane/design-system";
import { Kernel } from "../../kernel";
import { getTabConfig, getTabIcon } from "./helpers";
import SelectedIndicator from "./icon/selected-indicator.svg";
import styles from "./styles.css";
interface Props {
  disabledTabs?: number[];
  selectedIndex: number;
  kernel: Kernel;
  isBusinessAdmin: boolean;
}
export const AppTabs = ({
  kernel,
  isBusinessAdmin,
  selectedIndex,
  disabledTabs,
}: Props) => {
  const { translate } = kernel.getTranslator();
  const config = getTabConfig(isBusinessAdmin);
  const tabs = config.map((tab, i) => {
    const isSelected = selectedIndex === i;
    const isDisabled = Boolean(disabledTabs && disabledTabs.includes(i));
    const icon = getTabIcon({
      isDisabledTab: isDisabled,
      isSelectedTab: isSelected,
      tabConfigItem: tab,
    });
    return (
      <Tab
        className={styles.tab}
        key={`tab-${i}`}
        aria-label={translate(tab.titleKey)}
        disabled={isDisabled}
        aria-selected={isSelected}
        disabledClassName={styles.disabledTab}
        role="tab"
      >
        <div
          aria-hidden
          className={classNames(styles.tabicon)}
          sx={{ color: "ds.text.brand.standard" }}
        >
          {icon}
        </div>

        <Paragraph
          color="ds.text.brand.standard"
          textStyle="ds.body.helper.regular"
        >
          {translate(tab.titleKey)}
        </Paragraph>
        {isSelected && (
          <div aria-hidden className={styles.selectedTabIndicator}>
            <SelectedIndicator />
          </div>
        )}
      </Tab>
    );
  });
  return (
    <TabList
      role="tabpanel"
      tabIndex={0}
      sx={{
        backgroundColor: "ds.container.agnostic.neutral.standard",
        display: "flex",
      }}
    >
      {tabs}
    </TabList>
  );
};
