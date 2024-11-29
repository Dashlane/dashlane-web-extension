import { ChangeEventHandler, useEffect, useState } from "react";
import { Flex, Infobox, Toggle, useColorMode } from "@dashlane/design-system";
import { Link } from "@dashlane/ui-components";
import { useFeatureFlip } from "@dashlane/framework-react";
import { DashlaneLabsHeader } from "./header";
import { ExperimentList } from "./experiments/experiment-list";
import { Tip } from "./tip/tip";
import { useLabs } from "./hooks/use-labs";
import {
  DASHLANE_BETA_FORM,
  DASHLANE_DARK_THEME_KEY,
  DASHLANE_LABS_FEATURE_FLIP_NAME,
} from "./constants";
export const DashlaneLabs = () => {
  const hasDashlaneLabs = useFeatureFlip(DASHLANE_LABS_FEATURE_FLIP_NAME);
  const [, setColorMode] = useColorMode();
  const { refreshAvailableLabs } = useLabs();
  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState(
    window.localStorage.getItem(DASHLANE_DARK_THEME_KEY)
  );
  const onDarkThemeChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const updatedValue = String((target as HTMLInputElement).checked);
    setIsDarkThemeEnabled(updatedValue);
    window.localStorage.setItem(DASHLANE_DARK_THEME_KEY, updatedValue);
    setColorMode(updatedValue === "true" ? "dark" : "light");
    document.documentElement.style.setProperty(
      "color-scheme",
      updatedValue === "true" ? "dark" : "light"
    );
  };
  useEffect(() => {
    if (hasDashlaneLabs) {
      void refreshAvailableLabs();
    }
  }, []);
  if (!hasDashlaneLabs) {
    return null;
  }
  return (
    <Flex
      sx={{
        backgroundColor: "ds.background.alternate",
        padding: "16px 0",
        width: "100%",
        height: "100%",
      }}
      flexDirection="column"
    >
      <DashlaneLabsHeader />

      <Flex sx={{ margin: "8px 32px", flex: "1 1 auto" }}>
        <Flex sx={{ width: "60%", paddingRight: "8px" }}>
          <ExperimentList />
        </Flex>

        <div sx={{ width: "40%", paddingLeft: "8px" }}>
          <Tip
            emoji={{
              symbol: "🤔",
              label: "thinking",
            }}
            title="What is Dashlane Labs?"
            description="Dashlane Labs is a special section in the settings of our iOS Android and Web extensions which allow you to toggle alpha or beta features on and off."
          />
          <Tip
            emoji={{
              symbol: "📣",
              label: "megaphone",
            }}
            title="Feedback"
            description="We would love to hear about what you think of the features you’re trying out."
          >
            <Link
              color="ds.text.brand.quiet"
              target="_blank"
              rel="noopener noreferrer"
              href={DASHLANE_BETA_FORM}
            >
              Share your feedback
            </Link>
          </Tip>

          <Tip
            emoji={{
              symbol: "🌒",
              label: "waxing crescent moon",
            }}
            title="Dark theme"
            description=" This feature is highly experimental – you will see color
              aberrations where tokens are not used"
          >
            <Flex flexDirection="column" gap="16px">
              <Infobox
                title="But you can make it pretty by updating the colors to the Design System ones!"
                mood="positive"
              />
              <Toggle
                label="Enable Dark Theme"
                onChange={onDarkThemeChange}
                checked={isDarkThemeEnabled === "true"}
              />
            </Flex>
          </Tip>
        </div>
      </Flex>
    </Flex>
  );
};
