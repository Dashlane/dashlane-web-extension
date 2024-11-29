import { Tab } from "../shared/tab";
import { ColorTheme } from "./color-theme/color-theme";
import { RichIcons } from "./rich-icons/rich-icons";
export const AppearanceSettings = () => {
  return (
    <Tab>
      <ColorTheme />
      <RichIcons />
    </Tab>
  );
};
