import { useColorMode } from "@dashlane/ui-components";
import { BasePanelContainer } from "../base-panel-container";
interface IllustrationPanelProps {
  illustrationSrc: string;
  illustrationDarkSrc?: string;
}
export const IllustrationPanel = ({
  illustrationSrc,
  illustrationDarkSrc,
}: IllustrationPanelProps) => {
  const [colorMode] = useColorMode();
  const illustrationSource =
    colorMode === "light"
      ? illustrationSrc
      : illustrationDarkSrc ?? illustrationSrc;
  return (
    <BasePanelContainer>
      <div
        sx={{
          display: "flex",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <img
          sx={{
            maxWidth: "50%",
            aspectRatio: "3/2",
            alignSelf: "center",
          }}
          src={illustrationSource}
          alt="secure passkeys illustration"
        />
      </div>
    </BasePanelContainer>
  );
};
